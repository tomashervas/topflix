import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }

    try {
        const user = await prismadb.user.findUnique({
            where: {
                email: session.user!.email!
            }
        })
        const movies = await prismadb.movie.findMany({
            where: {
                id: {
                    in: user!.favoriteIds
                }
            }
        })

        return new Response(JSON.stringify(movies))
        
    } catch (error) {
        console.log(error)
    }
}