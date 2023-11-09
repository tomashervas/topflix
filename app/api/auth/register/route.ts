import bcrypt from "bcrypt";

import prismadb from '@/lib/prismadb'
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(req: Request) {

    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }

    if (req.method !== 'POST') return new NextResponse("Must be POST method", {status: 400})

    try {
        const {email, username, password } = await req.json()
        console.log(email, username, password)

        const existingUser = await prismadb.user.findFirst({
            where: {
                email
            }
        })

        if(existingUser) return new NextResponse('Email alredy taken', {status: 400})
        const hashedPassword = await bcrypt.hash(password, 12)
        // const hashedPassword = password
    
        const user = await prismadb.user.create({
            data: {
                email,
                name: username,
                hashedPassword,
                image: '',
                emailVerified: new Date()

            }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.log(error)
        return new NextResponse("Error" + error, {status: 500})
    }
}