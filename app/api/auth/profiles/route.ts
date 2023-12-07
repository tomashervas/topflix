import { authOptions } from '@/lib/auth';
import prismadb from '@/lib/prismadb'
import { getServerSession } from 'next-auth';
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }

    if (req.method !== 'POST') return new NextResponse("Must be POST method", {status: 400})

    try {
        const {name, age, isKid, avatar } = await req.json()
        //console.log(name, age, isKid, avatar )
    
        const user = await prismadb.user.update({
            where: {
                email: session.user!.email!
            },
            data: {
                profiles: {
                    push: {
                        name,
                        limitedAge: age,
                        isKid,
                        image: avatar,
                        favoriteIds: [],
                        favoriteTVIds: []
                    }
                }
            }
        })

        return NextResponse.json(user, {status: 201})
    } catch (error) {
        console.log(error)
        return new NextResponse("Error" + error, {status: 500})
    }
}