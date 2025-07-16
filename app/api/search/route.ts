import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { Movie, TVShow } from '@prisma/client'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request: Request){
    let isAuthenticated = false;
    const session = await getServerSession(authOptions);
    if(session) {
        isAuthenticated = true;
    } else {
            const authorizationHeader = request.headers.get('authorization');
            if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
                const token = authorizationHeader.substring(7);
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, email: string };
                    isAuthenticated = true;
                } catch (error) {
                    console.error("JWT verification failed:", error);
                }
            }
        }
    
        if (!isAuthenticated) {
            return new Response("Unauthorized", { status: 401 })
        }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    const cookieStore = cookies()
    const limit = cookieStore.get('limitedAge')
    const limitedAge = (!limit || limit.value === 'null') ? 20 : Number(limit.value)

    if(!query) {
        return new Response("Invalid request", {status: 400})
    }
    const results: {tv: TVShow[], movies: Movie[]} = {tv:[], movies:[]}
    try {
        const tv = await prismadb.tVShow.findMany({
            where: {
                AND: [
                    {
                        content_rating: {
                            lte: limitedAge
                        }
                    }
                ],
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
                AND: [
                    {
                        content_rating: {
                            lte: limitedAge
                        }
                    }
                ],
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