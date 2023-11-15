"use server"

import prismadb from "@/lib/prismadb";


export const getAllMovies = async (limit: number, page: number = 1, take: number = 20) => {
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
    return movies
}

export const getAllTVs = async (limit: number, page: number = 1, take: number = 20) => {
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
    return tvs
}