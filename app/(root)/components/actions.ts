"use server"

import prismadb from "@/lib/prismadb";
import { Movie, TVShow } from "@prisma/client";


export const getAllMovies = async (limit: number, page: number = 1, take: number = 4, alphabetic: boolean = false) => {

    let orderByField: 'title' | 'release_date' = 'release_date';
    let orderByDirection: 'desc' | 'asc' = 'desc';
    if (alphabetic) {
        orderByField = 'title';
        orderByDirection = 'asc';
    }

    const movies = await prismadb.movie.findMany({
        where: {
            content_rating: {
                lte: limit
            }
        },
        orderBy: {
            [orderByField]: orderByDirection
        },
        skip: (page - 1) * take,
        take
    })
    return movies as Movie[]
}

export const getAllTVs = async (limit: number, page: number = 1, take: number = 3, alphabetic: boolean = false) => {

    let orderByField: 'nameShow' | 'first_air_date' = 'first_air_date';
    let orderByDirection: 'desc' | 'asc' = 'desc';
    if (alphabetic) {
        orderByField = 'nameShow';
        orderByDirection = 'asc';
    }

    const tvs = await prismadb.tVShow.findMany({
        where: {
            content_rating: {
                lte: limit
            }
        },
        orderBy: {
            [orderByField]: orderByDirection
        },
        skip: (page - 1) * take,
        take
    })
    return tvs as TVShow[]
}