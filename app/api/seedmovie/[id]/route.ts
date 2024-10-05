import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { Movie } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'
import { JwtPayload } from 'jsonwebtoken'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token || '')

    if ((decoded as JwtPayload).user !== process.env.ADMIN) {
        return new NextResponse('Unauthorized', { status: 403 })
    }

    const id = +params.id

    const movie = await req.json()

    try {
        const movieDB = await prismadb.movie.update({
            where: {
                idTMDB: id
            },
            data: {
                ...movie
            }
        })
        console.log('Stored movie', movieDB.title)
        return new NextResponse(JSON.stringify(movieDB), { status: 200 })

    } catch (error) {
        return new NextResponse("Error" + error, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    const decoded = verifyToken(token || '');

    // Verificar si el usuario tiene privilegios de administrador
    if ((decoded as JwtPayload).user !== process.env.ADMIN) {
        return new NextResponse('Unauthorized', { status: 403 });
    }

    const id = +params.id;

    try {
        // Eliminar la película de la base de datos usando Prisma
        const deletedMovie = await prismadb.movie.delete({
            where: {
                idTMDB: id
            }
        });

        console.log('Deleted movie', deletedMovie.title);
        return new NextResponse("Movie deleted " + deletedMovie.title , { status: 200 });

    } catch (error) {
        console.error(error);
        return new NextResponse("Error" + error, { status: 500 });
    }
}
