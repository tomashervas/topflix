import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";


export async function GET(){
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }
    
    try {
        const movieCount = await prismadb.movie.count()
        const randomMovie = Math.floor(Math.random() * movieCount);
        const movie = await prismadb.movie.findMany({
            take: 1,
            skip: randomMovie
        })
        return new Response(JSON.stringify(movie[0]))

    } catch (error) {
        return new Response("Error" + error, {status: 500})
    }

}