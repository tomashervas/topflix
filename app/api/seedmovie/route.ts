import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { Movie } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'
import { JwtPayload } from 'jsonwebtoken'

export async function POST(req: Request) {
    const token = req.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token || '')

    const adminEmails = process.env.ADMIN?.split(',').map(email => email.trim()) || [];

    

    if (!adminEmails.includes((decoded as JwtPayload).user)) {
        return new NextResponse('Unauthorized', { status: 403 })
    }

    const movie = await req.json()

    const movieDB = await prismadb.movie.findFirst({
        where: {
            idTMDB: movie.idTMDB
        }
    })

    if (movieDB) {
        return new NextResponse("La película " + movieDB.name + " ya existe", { status: 400 })
    }

    try {
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
                vote_average: movie.vote_average || 0,
                duration: movie.duration || 0,
                content_rating: movie.content_rating || 18,
                budget: movie.budget,
                revenue: movie.revenue,
                tagline: movie.tagline,
                trailer: movie.trailer
            }
        })
        console.log('Stored movie', newMovie.name)
        return new NextResponse(JSON.stringify(newMovie), { status: 201 })
    } catch (error) {
        return new NextResponse("Error" + error, { status: 500 })
    }
}