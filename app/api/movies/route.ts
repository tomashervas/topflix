import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";


export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
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