"use server"

import prismadb from "@/lib/prismadb";
import { Movie, TVShow } from "@prisma/client";


export const getAllMovies = async (limit: number, page: number = 1, take: number = 4) => {
    const movies = await prismadb.movie.findMany({
        where: {
            content_rating: {
                lte: limit
            }
        },
        orderBy: {
            release_date: 'desc'
        },
        skip: (page - 1) * take,
        take
    })
    return movies as Movie[]
}

export const getAllTVs = async (limit: number, page: number = 1, take: number = 3) => {
    const tvs = await prismadb.tVShow.findMany({
        where: {
            content_rating: {
                lte: limit
            }
        },
        orderBy: {
            first_air_date: 'desc'
        },
        skip: (page - 1) * take,
        take
    })
    return tvs as TVShow[]
}