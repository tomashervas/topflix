import { NextRequest, NextResponse } from 'next/server';
import { getDeviceCode } from '@/lib/deviceCodes';

/**
 * GET /api/mobile/device-poll/[code]
 * 
 * Called by the TV every ~4 seconds to check if the code has been verified.
 * No authentication required — the TV is not logged in yet.
 * 
 * Response:
 * - { status: "pending" }              — code exists, waiting for mobile verification
 * - { status: "completed", token: "..." } — mobile verified, here's the JWT
 * - { status: "expired" }              — code not found or expired
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { code: string } }
) {
    try {
        const { code } = params;

        const deviceCode = getDeviceCode(code);

        if (!deviceCode) {
            return NextResponse.json({ status: 'expired' });
        }

        if (deviceCode.status === 'completed' && deviceCode.token) {
            return NextResponse.json({
                status: 'completed',
                token: deviceCode.token,
            });
        }

        return NextResponse.json({ status: 'pending' });
    } catch (error) {
        console.error('Error polling device code:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
