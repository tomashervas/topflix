import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";


export async function GET(){
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }
    const movieOrTV = (Math.floor(Math.random() * 2))
    
    try {
        const count = movieOrTV === 0 ? await prismadb.tVShow.count() : await prismadb.movie.count()
        const randomItem = Math.floor(Math.random() * count);
        let item;
        if(movieOrTV === 0) {
            item = await prismadb.tVShow.findMany({
                take: 1,
                skip: randomItem
            })
        } else {
            item = await prismadb.movie.findMany({
                take: 1,
                skip: randomItem
            })
        }
        return new Response(JSON.stringify(item[0]))

    } catch (error) {
        return new Response("Error" + error, {status: 500})
    }

}