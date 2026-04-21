import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

async function getAuthenticatedUser(request: Request) {
    const session = await getServerSession(authOptions);
    let email: string | undefined;

    if (session?.user?.email) {
        email = session.user.email;
    } else {
        const authorizationHeader = request.headers.get('authorization');
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.substring(7);
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET! as string) as { userId: string, email: string };
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
        where: { email }
    });
}

export async function GET(
    request: Request, 
    { params }: { params: { mediaId: string } }
) {
    try {
        const user = await getAuthenticatedUser(request);

        if (!user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const mediaId = params.mediaId;
        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get('profileId');
        
        // These can be null for movies
        const seasonNumberStr = searchParams.get('seasonNumber');
        const episodeNumberStr = searchParams.get('episodeNumber');
        
        const sNumber = seasonNumberStr !== undefined && seasonNumberStr !== null ? Number(seasonNumberStr) : null;
        const eNumber = episodeNumberStr !== undefined && episodeNumberStr !== null ? Number(episodeNumberStr) : null;

        if (!profileId) {
            return new Response("profileId is required", { status: 400 });
        }

        // Check if profile belongs to user
        const profileExists = user.profiles.some(p => p.id === profileId || p.name === profileId);
        if (!profileExists) {
            return new Response("Profile not found", { status: 404 });
        }

        const progress = await prismadb.watchingProgress.findFirst({
            where: {
                userId: user.id,
                profileId: profileId,
                mediaId: mediaId,
                seasonNumber: sNumber,
                episodeNumber: eNumber,
            }
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error("Error in GET /api/watching-progress/[mediaId]:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
