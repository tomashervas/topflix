import { NextResponse } from 'next/server'
import prismadb from '@/lib/prismadb'
import { TVShow } from '@prisma/client'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifyToken } from '@/lib/jwt';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'; // Ensure jwt is imported directly


export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    let isAuthenticated = false;
    let userId: string | undefined;

    if (session) {
        isAuthenticated = true;
    } else {
        const authorizationHeader = request.headers.get('authorization');
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.substring(7);
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, email: string };
                userId = decoded.userId;
                isAuthenticated = true;
            } catch (error) {
                console.error("JWT verification failed:", error);
            }
        }
    }

    if (!isAuthenticated) {
        return new Response("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limitedAge = (!searchParams.get('limitedAge') || searchParams.get('limitedAge') === 'null') ? 20 : Number(searchParams.get('limitedAge'))
    const page = Number(searchParams.get('page')) || 1; // Default to page 1
    const itemsPerPage = 20; // Number of items per page
    const skip = (page - 1) * itemsPerPage;

    
    try {
        const tv = await prismadb.tVShow.findMany({
            where: {
                content_rating: {
                    lte: limitedAge
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: skip,
            take: itemsPerPage
        })
        return new Response(JSON.stringify(tv))

    } catch (error) {
        return new Response("Error" + error, {status: 500})
    }

}

export async function POST(req: Request) {

    const token = req.headers.get('Authorization')?.split(' ')[1]
    const decoded = verifyToken(token || '')

    const adminEmails = process.env.ADMIN?.split(',').map(email => email.trim()) || [];

    if (!adminEmails.includes((decoded as JwtPayload).user)) {
        return new NextResponse('Unauthorized', { status: 403 })
    }

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
            return new NextResponse("Tvshow already exists", {status: 400})
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