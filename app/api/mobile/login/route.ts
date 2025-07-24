import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return new NextResponse('Email and password are required', { status: 400 });
        }

        const user = await prismadb.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user || !user.hashedPassword) {
            return new NextResponse('Invalid credentials', { status: 401 });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);

        if (!isCorrectPassword) {
            return new NextResponse('Invalid credentials', { status: 401 });
        }

        // Generate JWT
        const jwtSecret = process.env.JWT_SECRET!;
        if (!jwtSecret) {
            throw new Error('SECRET is not defined');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, profiles: user.profiles },
            jwtSecret,
            { expiresIn: '7d' } // Token expires in 7 days
        );

        return NextResponse.json({ token });

    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
