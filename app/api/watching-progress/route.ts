import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { Movie, TVShow } from "@prisma/client";

type MediaInfo = {
  title?: string;
  nameShow?: string;
  thumbnailUrl: string;
  seasons?: any[];
  updatedAt?: Date;
};

async function getAuthenticatedUser(request: Request) {
  const session = await getServerSession(authOptions);
  let email: string | undefined;

  if (session?.user?.email) {
    email = session.user.email;
  } else {
    const authorizationHeader = request.headers.get("authorization");
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      const token = authorizationHeader.substring(7);
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET! as string,
        ) as { userId: string; email: string };
        email = decoded.email;
      } catch (error) {
        console.error("JWT verification failed:", error);
      }
    }
  }

  if (!email) {
    return null;
  }

  return await prismadb.user.findUnique({
    where: { email },
  });
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const {
      profileId,
      mediaType,
      mediaId,
      seasonNumber,
      episodeNumber,
      duration,
      watching,
    } = await request.json();

    // Basic validation
    if (
      !profileId ||
      !mediaType ||
      !mediaId ||
      duration === undefined ||
      watching === undefined
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    if (mediaType !== "MOVIE" && mediaType !== "TVSHOW") {
      return new Response("Invalid mediaType", { status: 400 });
    }

    // Check if profile exists in user's profiles
    const profileExists = user.profiles.some(
      (p) => p.id === profileId || p.name === profileId,
    );
    if (!profileExists) {
      return new Response("Profile not found", { status: 404 });
    }

    const sNumber =
      seasonNumber !== undefined && seasonNumber !== null
        ? Number(seasonNumber)
        : null;
    const eNumber =
      episodeNumber !== undefined && episodeNumber !== null
        ? Number(episodeNumber)
        : null;

    // Find existing progress using findFirst instead of findUnique to allow nulls
    const existingProgress = await prismadb.watchingProgress.findFirst({
      where: {
        userId: user.id,
        profileId: profileId,
        mediaId: mediaId,
        seasonNumber: sNumber,
        episodeNumber: eNumber,
      },
    });

    let progress;
    if (existingProgress) {
      progress = await prismadb.watchingProgress.update({
        where: { id: existingProgress.id },
        data: {
          watching: Number(watching),
          duration: Number(duration),
          lastWatchedAt: new Date(),
        },
      });
    } else {
      progress = await prismadb.watchingProgress.create({
        data: {
          userId: user.id,
          profileId: profileId,
          mediaType: mediaType as "MOVIE" | "TVSHOW",
          mediaId: mediaId,
          seasonNumber: sNumber,
          episodeNumber: eNumber,
          duration: Number(duration),
          watching: Number(watching),
          lastWatchedAt: new Date(),
        },
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error in POST /api/watching-progress:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return new Response("profileId is required", { status: 400 });
    }

    // Check if profile belongs to user
    const profileExists = user.profiles.some(
      (p) => p.id === profileId || p.name === profileId,
    );
    if (!profileExists) {
      return new Response("Profile not found", { status: 404 });
    }

    const progressList = await prismadb.watchingProgress.findMany({
      where: {
        userId: user.id,
        profileId: profileId,
      },
      orderBy: {
        lastWatchedAt: "desc",
      },
    });

    // Enrich with media info (title/nameShow, thumbnailUrl)
    const enrichedProgressList = await Promise.all(
      progressList.map(async (progress) => {
        let mediaInfo: MediaInfo | null = null;
        let hasNextEpisode = false;
        let showUpdatedAt: Date | null = null;
        let latestSeasonNumber: number | null = null;
        let latestEpisodeNumber: number | null = null;

        if (progress.mediaType === "MOVIE") {
          mediaInfo = await prismadb.movie.findUnique({
            where: { id: progress.mediaId },
            select: { title: true, thumbnailUrl: true },
          });
        } else {
          mediaInfo = await prismadb.tVShow.findUnique({
            where: { id: progress.mediaId },
            select: { nameShow: true, thumbnailUrl: true, seasons: true, updatedAt: true },
          });

          showUpdatedAt = mediaInfo?.updatedAt ?? null;

          if (mediaInfo?.seasons) {
            const currentS = progress.seasonNumber ?? 0;
            const currentE = progress.episodeNumber ?? 0;

            // Calcular el último episodio disponible (con videoUrl != null) en toda la serie
            const validSeasons = mediaInfo.seasons
              .filter((s: any) => (s.season_number ?? 0) > 0 && Array.isArray(s.episodes))
              .sort((a: any, b: any) => a.season_number - b.season_number);

            for (const s of validSeasons) {
              const availableEps = s.episodes
                .filter((e: any) => e.videoUrl != null && String(e.videoUrl).trim() !== "")
                .sort((a: any, b: any) => (a.episode_number ?? 0) - (b.episode_number ?? 0));

              if (availableEps.length > 0) {
                const lastEp = availableEps[availableEps.length - 1];
                latestSeasonNumber = s.season_number;
                latestEpisodeNumber = lastEp.episode_number ?? null;
              }
            }

            // Check if there's a next episode con videoUrl disponible en la temporada actual
            const currentSeason = mediaInfo.seasons.find(
              (s: any) => s.season_number === currentS,
            );
            const moreEpisodesInSeason = currentSeason?.episodes.some(
              (e: any) =>
                (e.episode_number ?? 0) > currentE &&
                e.videoUrl != null &&
                String(e.videoUrl).trim() !== "",
            );

            if (moreEpisodesInSeason) {
              hasNextEpisode = true;
            } else {
              // Check if there's any subsequent season with available episodes
              hasNextEpisode = mediaInfo.seasons.some(
                (s: any) =>
                  s.season_number > currentS &&
                  Array.isArray(s.episodes) &&
                  s.episodes.some(
                    (e: any) => e.videoUrl != null && String(e.videoUrl).trim() !== "",
                  ),
              );
            }
          }
        }

        return {
          ...progress,
          title: progress.mediaType === "MOVIE" ? mediaInfo?.title : null,
          nameShow:
            progress.mediaType === "TVSHOW" ? mediaInfo?.nameShow : null,
          thumbnailUrl: mediaInfo?.thumbnailUrl,
          ...(progress.mediaType === "TVSHOW" && {
            hasNextEpisode,
            showUpdatedAt,
            latestSeasonNumber,
            latestEpisodeNumber,
          }),
        };
      }),
    );

    return NextResponse.json(enrichedProgressList);
  } catch (error) {
    console.error("Error in GET /api/watching-progress:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const mediaId = searchParams.get("mediaId");

    if (!profileId || !mediaId) {
      return new Response("profileId and mediaId are required", {
        status: 400,
      });
    }

    // Check if profile belongs to user
    const profileExists = user.profiles.some(
      (p) => p.id === profileId || p.name === profileId,
    );
    if (!profileExists) {
      return new Response("Profile not found", { status: 404 });
    }

    // Delete all progress records for this user, profile and mediaId
    const result = await prismadb.watchingProgress.deleteMany({
      where: {
        userId: user.id,
        profileId: profileId,
        mediaId: mediaId,
      },
    });

    return NextResponse.json({
      message: "Progress deleted successfully",
      count: result.count,
    });
  } catch (error) {
    console.error("Error in DELETE /api/watching-progress:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
