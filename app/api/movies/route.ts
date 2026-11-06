import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    let isAuthenticated = false;

    if (session) {
        isAuthenticated = true;
    } else {
        const authorizationHeader = request.headers.get("authorization");
        if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
            const token = authorizationHeader.substring(7);
            try {
                jwt.verify(token, process.env.JWT_SECRET! as string);
                isAuthenticated = true;
            } catch (error) {
                console.error("JWT verification failed:", error);
            }
        }
    }

    if (!isAuthenticated) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const limitedAge =
        !searchParams.get("limitedAge") || searchParams.get("limitedAge") === "null"
            ? 20
            : Number(searchParams.get("limitedAge"));

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const requestedLimit = Number(searchParams.get("limit")) || 20;
    const itemsPerPage = Math.min(Math.max(1, requestedLimit), 100);
    const skip = (page - 1) * itemsPerPage;

    const genre = searchParams.get("genre")?.trim() || null;
    const yearFrom = searchParams.get("yearFrom")?.trim() || null;
    const yearTo = searchParams.get("yearTo")?.trim() || null;
    const sortBy = searchParams.get("sortBy")?.trim() || "recent";

    const andConditions: Prisma.MovieWhereInput[] = [
        {
            content_rating: {
                lte: limitedAge,
            },
        },
    ];

    // Filtro por género: 'has' comprueba si el string está dentro del array 'genres'
    if (genre && genre.length > 0) {
        andConditions.push({
            genres: {
                has: genre,
            },
        });
    }

    // Filtro por año o rango de años sobre release_date ("YYYY-MM-DD")
    if (yearFrom || yearTo) {
        const dateFilter: Prisma.StringNullableFilter = {
            not: "",
        };
        if (yearFrom) {
            dateFilter.gte = `${yearFrom}-01-01`;
        }
        if (yearTo) {
            dateFilter.lte = `${yearTo}-12-31`;
        }
        andConditions.push({
            release_date: dateFilter,
        });
    }

    // Ordenación dinámica
    let orderBy: Prisma.MovieOrderByWithRelationInput = { createdAt: "desc" };
    switch (sortBy) {
        case "release_date":
            orderBy = { release_date: "desc" };
            break;
        case "rating":
            orderBy = { vote_average: "desc" };
            break;
        case "alphabetical":
            orderBy = { title: "asc" };
            break;
        case "recent":
        default:
            orderBy = { createdAt: "desc" };
            break;
    }

    try {
        const movies = await prismadb.movie.findMany({
            where: {
                AND: andConditions,
            },
            orderBy: orderBy,
            skip: skip,
            take: itemsPerPage,
        });
        return new Response(JSON.stringify(movies), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("[MOVIES_GET_ERROR]", error);
        return new Response("Error" + error, { status: 500 });
    }
}
