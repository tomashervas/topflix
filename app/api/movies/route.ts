import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    let isAuthenticated = false;
    let userId: string | undefined;

    if (session) {
        isAuthenticated = true;
        // If using PrismaAdapter, session.user.id might be available, or you might need to fetch it
        // For simplicity, we'll assume session.user.email is enough for now or that the user object is populated.
        // If you need the Prisma user ID, you'd fetch it here based on session.user.email
    } else {
        const authorizationHeader = request.headers.get('authorization');
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.substring(7);
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET! as string) as { userId: string, email: string };
                userId = decoded.userId;
                isAuthenticated = true;
            } catch (error) {
                console.error("JWT verification failed:", error);
                // Token is invalid, proceed to return Unauthorized
            }
        }
    }

    if (!isAuthenticated) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url)

    const limitedAge = (!searchParams.get('limitedAge') || searchParams.get('limitedAge') === 'null') ? 20 : Number(searchParams.get('limitedAge'))
    
    try {
        const movies = await prismadb.movie.findMany({
            where: {
                content_rating: {
                    lte: limitedAge
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        })
        return new Response(JSON.stringify(movies))

    } catch (error) {
        return new Response("Error" + error, {status: 500})
    }

}