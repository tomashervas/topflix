import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { Episode, TVShow } from '@prisma/client'
import { verifyToken } from '@/lib/jwt'
import { JwtPayload } from 'jsonwebtoken'

export async function PUT(req: Request, { params }: { params: { idTMDB: string, num: string } }) {

    const token = req.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token || '')

    const adminEmails = process.env.ADMIN?.split(',').map(email => email.trim()) || [];

    if (!adminEmails.includes((decoded as JwtPayload).user)) {
        return new NextResponse('Unauthorized', { status: 403 })
    }

    const idTMDB = +params.idTMDB
    const num = +params.num
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
                                push: {
                                    ...episode
                                }
                            }
                        }
                    }
                }
            }
        })
        console.log(episode)
        return new NextResponse(JSON.stringify(episode), { status: 200 })
    } catch (error) {
        console.log(error)
        return new NextResponse("Error" + error, { status: 500 })
    }
}