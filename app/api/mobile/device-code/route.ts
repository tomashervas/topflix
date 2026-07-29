import { NextResponse } from 'next/server';
import { createDeviceCode } from '@/lib/deviceCodes';

/**
 * POST /api/mobile/device-code
 * 
 * Generates a new 6-character device code for TV login.
 * No authentication required — the TV is not logged in yet.
 * 
 * Response: { code: string, expiresIn: number (seconds) }
 */
export async function POST() {
    try {
        const { code, expiresIn } = createDeviceCode();
        return NextResponse.json({ code, expiresIn });
    } catch (error) {
        console.error('Error generating device code:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
