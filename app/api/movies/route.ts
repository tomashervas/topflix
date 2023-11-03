import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";


export async function GET(){
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }
    
    try {
        const movies = await prismadb.movie.findMany({
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