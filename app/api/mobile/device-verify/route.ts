import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prismadb from '@/lib/prismadb';
import { completeDeviceCode, getDeviceCode } from '@/lib/deviceCodes';

/**
 * POST /api/mobile/device-verify
 * 
 * Called by the mobile app (already logged in) to verify a TV device code.
 * Requires a valid JWT in the Authorization header.
 * 
 * Body: { code: string }
 * 
 * Flow:
 * 1. Validates the mobile user's JWT
 * 2. Fetches fresh user data from DB
 * 3. Generates a NEW JWT for the TV device
 * 4. Marks the device code as completed with the new token
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Validate mobile user's JWT
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET!;

        let decoded: { userId: string; email: string };
        try {
            decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };
        } catch {
            return new NextResponse('Invalid or expired token', { status: 401 });
        }

        // 2. Parse request body
        const { code } = await request.json();
        if (!code || typeof code !== 'string') {
            return new NextResponse('Code is required', { status: 400 });
        }

        // 3. Check that the device code exists and is pending
        const deviceCode = getDeviceCode(code.toUpperCase());
        if (!deviceCode) {
            return NextResponse.json(
                { error: 'Code expired or not found' },
                { status: 404 }
            );
        }

        if (deviceCode.status !== 'pending') {
            return NextResponse.json(
                { error: 'Code already used' },
                { status: 409 }
            );
        }

        // 4. Fetch fresh user data from DB (to get updated profiles)
        const user = await prismadb.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        // 5. Generate a new JWT for the TV device
        const tvToken = jwt.sign(
            { userId: user.id, email: user.email, profiles: user.profiles },
            jwtSecret,
            { expiresIn: '7d' }
        );

        // 6. Complete the device code with the new token
        const success = completeDeviceCode(code.toUpperCase(), tvToken);
        if (!success) {
            return NextResponse.json(
                { error: 'Code expired during verification' },
                { status: 410 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error verifying device code:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
