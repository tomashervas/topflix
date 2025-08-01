import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { Movie } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'
import { JwtPayload } from 'jsonwebtoken'

/* export function GET(){
    return new Response(JSON.stringify(movies))
} */

export async function POST(req: Request) {
    const token = req.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token || '')

    const adminEmails = process.env.ADMIN?.split(',').map(email => email.trim()) || [];

    if (!adminEmails.includes((decoded as JwtPayload).user)) {
        return new NextResponse('Unauthorized', { status: 403 })
    }

    const movies = await req.json()
    const moviesStored: any = []

    const moviesDB = await prismadb.movie.findMany()

    try {
        movies.map(async(movie: Movie) => {
            if(moviesDB && moviesDB.find((m) => m.idTMDB === movie.idTMDB)) {
                return
            }
            const newMovie = await prismadb.movie.create({
                data: {
                    idTMDB: movie.idTMDB || 0,
                    name: movie.name,
                    title: movie.title,
                    overview: movie.overview,
                    videoUrl: movie.videoUrl,
                    thumbnailUrl: movie.thumbnailUrl,
                    backdropUrl: movie.backdropUrl || '',
                    images: movie.images,
                    director: movie.director || [],
                    cast: movie.cast,
                    genres: movie.genres,
                    release_date: movie.release_date || '',
                    vote_average: movie.vote_average  || 0,
                    duration: movie.duration  || 0,
                    content_rating: movie.content_rating,
                    budget: movie.budget,
                    revenue: movie.revenue,
                    tagline: movie.tagline,
                    trailer: movie.trailer
                }
            })
            moviesStored.push(newMovie)
        })
        console.log(moviesStored)
        return new NextResponse(JSON.stringify(moviesStored), {status: 200})
    } catch (error) {
        return new NextResponse("Error" + error, {status: 500})
    }
}