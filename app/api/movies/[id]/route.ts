import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Check NextAuth session
        const session = await getServerSession(authOptions);
        let isAuthenticated = !!session;

        // If no session, check for JWT
        if (!isAuthenticated) {
            const authHeader = request.headers.get('authorization');
            if (authHeader?.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                try {
                    jwt.verify(token, process.env.JWT_SECRET as string);
                    isAuthenticated = true;
                } catch (error) {
                    // Invalid token
                }
            }
        }

        if (!isAuthenticated) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = params;
        if (!id) {
            return new NextResponse('Movie ID is required', { status: 400 });
        }

        const movie = await prismadb.movie.findUnique({
            where: { id: id },
        });

        if (!movie) {
            return new NextResponse('Movie not found', { status: 404 });
        }

        return NextResponse.json(movie);

    } catch (error) {
        console.error('[MOVIE_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
