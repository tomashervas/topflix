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

    const movieOrTV = (Math.floor(Math.random() * 2))
    
    try {
        const count = movieOrTV === 0 ? await prismadb.tVShow.count({where: {content_rating: {lte: limitedAge}}}) : await prismadb.movie.count({where: {content_rating: {lte: limitedAge}}})
        const randomItem = Math.floor(Math.random() * count);
        let item;
        if(movieOrTV === 0) {
            item = await prismadb.tVShow.findMany({
                 where: {
                    content_rating: {
                         lte: limitedAge
                    }
                },
                take: 1,
                skip: randomItem
            })
        } else {
            item = await prismadb.movie.findMany({
                 where: {
                    content_rating: {
                        lte: limitedAge
                    }
                },
                take: 1,
                skip: randomItem
            })
        }
        return new Response(JSON.stringify(item[0]))

    } catch (error) {
        return new Response("Error" + error, {status: 500})
    }

}