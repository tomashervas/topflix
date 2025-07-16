import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismadb from '@/lib/prismadb';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        let isAuthenticated = false;
        let isAdmin = false;
        let userEmail: string | null | undefined = null;

        if (session) {
            isAuthenticated = true;
            userEmail = session.user?.email;
        } else {
            const authorizationHeader = request.headers.get('authorization');
            if (authorizationHeader?.startsWith('Bearer ')) {
                const token = authorizationHeader.substring(7);
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET! as string) as { email: string};
                    isAuthenticated = true;
                    userEmail = decoded.email;
                } catch (error) {
                    return new NextResponse('Invalid token', { status: 401 });
                }
            }
        }

        if (!isAuthenticated || !userEmail) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const adminEmails = process.env.ADMIN?.split(',').map(email => email.trim()) || [];
        isAdmin = adminEmails.includes(userEmail);

        if (!isAdmin) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        const videoToken = generateToken(userEmail, isAdmin);

        return NextResponse.json({ videoToken });

    } catch (error) {
        console.error('[VIDEO_TOKEN_POST]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
