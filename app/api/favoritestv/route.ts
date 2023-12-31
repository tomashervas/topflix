import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }

    const { searchParams } = new URL(request.url)
    const profile:string | null = searchParams.get('profile')

    if(!profile) {
        return new Response("Invalid request", {status: 400})
    }

    try {
        const user = await prismadb.user.findUnique({
            where: {
                email: session.user!.email!
            }
        })
        const tvs = await prismadb.tVShow.findMany({
            where: {
                id: {
                    in: user!.profiles.find(p=>p.name===profile)?.favoriteTVIds
                }
            }
        })

        tvs.reverse()

        return new Response(JSON.stringify(tvs))
        
    } catch (error) {
        console.log(error)
    }
}