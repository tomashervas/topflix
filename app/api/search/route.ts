import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { Movie, TVShow } from '@prisma/client'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request){
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    console.log('query' + query)
    if(!query) {
        return new Response("Invalid request", {status: 400})
    }
    const results: {tv: TVShow[], movies: Movie[]} = {tv:[], movies:[]}
    try {
        const tv = await prismadb.tVShow.findMany({
            where: {
                name: {
                    contains: query!,
                    mode: 'insensitive'
                }
            },
            take: 20
        })
        if (tv.length > 0) {
            results.tv = tv
        }


        const movies = await prismadb.movie.findMany({
            where: {
                name: {
                    contains: query!,
                    mode: 'insensitive'
                }
            }
        })
        if (movies.length > 0) {
            results.movies = movies
        }
        return new Response(JSON.stringify(results))

    } catch (error) {
        return new Response("Error" + error, {status: 500})
    }

}