import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { Episode, TVShow } from '@prisma/client'

export async function PUT(req: Request, { params }: { params: { idTMDB: string } }) {

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
                                        videoUrl: episode.videoUrl
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