import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Prisma, TVShow } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyToken } from "@/lib/jwt";
import jwt, { JwtPayload } from "jsonwebtoken";

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
                jwt.verify(token, process.env.JWT_SECRET as string);
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

    const andConditions: Prisma.TVShowWhereInput[] = [
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

    // Filtro por año o rango de años sobre first_air_date ("YYYY-MM-DD")
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
            first_air_date: dateFilter,
        });
    }

    // Ordenación dinámica: 'recent' usa updatedAt para que series con nuevos capítulos suban al #1
    let orderBy: Prisma.TVShowOrderByWithRelationInput = { updatedAt: "desc" };
    switch (sortBy) {
        case "release_date":
            orderBy = { first_air_date: "desc" };
            break;
        case "rating":
            orderBy = { vote_average: "desc" };
            break;
        case "alphabetical":
            orderBy = { nameShow: "asc" };
            break;
        case "recent":
        default:
            orderBy = { updatedAt: "desc" };
            break;
    }

    try {
        const tv = await prismadb.tVShow.findMany({
            where: {
                AND: andConditions,
            },
            orderBy: orderBy,
            skip: skip,
            take: itemsPerPage,
        });
        return new Response(JSON.stringify(tv), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("[TVSHOWS_GET_ERROR]", error);
        return new Response("Error" + error, { status: 500 });
    }
}

export async function POST(req: Request) {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const decoded = verifyToken(token || "");

    const adminEmails = process.env.ADMIN?.split(",").map((email) => email.trim()) || [];

    if (!adminEmails.includes((decoded as JwtPayload).user)) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const tv: TVShow = await req.json();
    try {
        if (!tv) {
            return new NextResponse("Invalid request", { status: 400 });
        }
        const tvDB = await prismadb.tVShow.findUnique({
            where: {
                idTMDB: tv.idTMDB,
            },
        });
        if (tvDB) {
            return new NextResponse("Tvshow already exists", { status: 400 });
        }
        const newTvshow = await prismadb.tVShow.create({
            data: {
                ...tv,
            },
        });
        console.log("Stored tvshow", newTvshow.nameShow);
        return new NextResponse(JSON.stringify(newTvshow), { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse("Error" + error, { status: 500 });
    }
}
