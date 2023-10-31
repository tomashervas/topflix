import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { TVShow } from '@prisma/client'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export async function GET(){
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }
    
    try {
        const tv = await prismadb.tVShow.findMany()
        return new Response(JSON.stringify(tv))

    } catch (error) {
        return new Response("Error" + error, {status: 500})
    }

}

export async function POST(req: Request) {
    const tv: TVShow = await req.json()    
    try {
        if(!tv) {
            return new NextResponse("Invalid request", {status: 400})
        }
        const tvDB = await prismadb.tVShow.findUnique({
            where: {
                idTMDB: tv.idTMDB
            }
        })
        if(tvDB) {
            return new NextResponse("Movie already exists", {status: 400})
        }
        const newTvshow = await prismadb.tVShow.create({
            data: {
                ...tv
            }
        })
        console.log('Stored tvshow', newTvshow.nameShow)
        return new NextResponse(JSON.stringify(newTvshow), {status: 200})
    } catch (error) {
        console.log(error)
        return new NextResponse("Error" + error, {status: 500})
    }

}