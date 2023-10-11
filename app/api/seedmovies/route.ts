import movies from '@/movies.json'
import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { Movie } from '@/models/movie'

export function GET(){
    return new Response(JSON.stringify(movies))
}

export async function POST() {
    try {
        movies.map(async (movie: Movie) => {
            const newMovie = await prismadb.movie.create({
                data: {
                    title: movie.title,
                    description: movie.description,
                    videoUrl: movie.videoUrl,
                    thumbnailUrl: movie.thumbnailUrl,
                    genre: movie.genre,
                    duration: movie.duration
                }
            })
            console.log(newMovie)
        })
        return new NextResponse("Success", {status: 200})
    } catch (error) {
        return new NextResponse("Error" + error, {status: 500})
    }
}