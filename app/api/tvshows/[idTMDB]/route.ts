import { NextRequest, NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { Episode, TVShow } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'
import { JwtPayload } from 'jsonwebtoken'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest, { params }: { params: { idTMDB:string } }) {
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

        const { idTMDB } = params;
        if (!idTMDB) {
            return new NextResponse('TV Show ID is required', { status: 400 });
        }

        const tvShow = await prismadb.tVShow.findUnique({
            where: { id: idTMDB },
        });

        if (!tvShow) {
            return new NextResponse('TV Show not found', { status: 404 });
        }

        return NextResponse.json(tvShow);

    } catch (error) {
        console.error('[TVSHOW_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { idTMDB: string } }) {

    const token = req.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token || '')

    const adminEmails = process.env.ADMIN?.split(',').map(email => email.trim()) || [];

    if (!adminEmails.includes((decoded as JwtPayload).user)) {
        return new NextResponse('Unauthorized', { status: 403 })
    }

    const idTMDB = +params.idTMDB
    const episode: Episode = await req.json()

    try {
        if (!episode) {
            return new NextResponse("Invalid request", { status: 400 })
        }
        const tvshow = await prismadb.tVShow.update({
            where: {
                idTMDB
            },
            data: {
                seasons: {
                    updateMany: {
                        where: {
                            season_number: episode.season_number
                        }, data: {
                            episodes: {
                                updateMany: {
                                    where: {
                                        id_episode: episode.id_episode
                                    },
                                    data: {
                                        ...episode
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        console.log(episode.videoUrl)
        return new NextResponse(JSON.stringify(episode.videoUrl), { status: 200 })
    } catch (error) {
        console.log(error)
        return new NextResponse("Error" + error, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { idTMDB: string } }) {

    const token = req.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token || '')

    const adminEmails = process.env.ADMIN?.split(',').map(email => email.trim()) || [];

    if (!adminEmails.includes((decoded as JwtPayload).user)) {
        return new NextResponse('Unauthorized', { status: 403 })
    }

    const idTMDB = +params.idTMDB
    const tv: TVShow = await req.json()

    try {
        if(!tv) {
            return new NextResponse("Invalid request", {status: 400})
        }

        const updatedTvshow = await prismadb.tVShow.update({
            where: {
                idTMDB
            },
            data: {
                ...tv
            }
        })
        console.log('Stored tvshow', updatedTvshow.nameShow)
        return new NextResponse(JSON.stringify(updatedTvshow), {status: 200})
    } catch (error) {
        console.log(error)
        return new NextResponse("Error" + error, { status: 500 })
    }

}

export async function DELETE(req: Request, { params }: { params: { idTMDB: string } }) {

    const token = req.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token || '')

    const adminEmails = process.env.ADMIN?.split(',').map(email => email.trim()) || [];

    if (!adminEmails.includes((decoded as JwtPayload).user)) {
        return new NextResponse('Unauthorized', { status: 403 })

    }

    const idTMDB = +params.idTMDB

    try {
        const tvshow = await prismadb.tVShow.delete({
            where: {
                idTMDB
            }
        })
        return new NextResponse(JSON.stringify(tvshow), { status: 200 })
    }catch (error) {
        console.log(error)
        return new NextResponse("Error" + error, { status: 500 })
    }

}