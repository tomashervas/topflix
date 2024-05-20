import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { Episode, TVShow } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'
import { JwtPayload } from 'jsonwebtoken'

export async function PATCH(req: Request, { params }: { params: { idTMDB: string } }) {

    const token = req.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token || '')

    if((decoded as JwtPayload).user  !== process.env.ADMIN) {
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

    if((decoded as JwtPayload).user  !== process.env.ADMIN) {
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

    if((decoded as JwtPayload).user  !== process.env.ADMIN) {
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