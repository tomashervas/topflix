import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, {params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }

    const tvId = params.id

    try {
        const existingTV = await prismadb.tVShow.findUnique({
            where: {
                id: tvId
            }
        })

        if(!existingTV) {
            return new Response("Tv show not found", {status: 404})
        }

        const user = await prismadb.user.update({
            where: {
                email: session.user!.email!
            },
            data: {
                favoriteTVIds: {
                    push: tvId
                }
            }
        })

        return new Response(JSON.stringify(user))
        
    } catch (error) {
        console.log(error)
    }
}

export async function DELETE(req: Request, {params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }
    
    const tvId = params.id
    
    try {
        const existingTV = await prismadb.tVShow.findUnique({
            where: {
                id: tvId
            }
        })

        if(!existingTV) {
            return new Response("Movie not found", {status: 404})
        }

        const user = await prismadb.user.findUnique({
            where: {
                email: session.user!.email!
            }
        })

        const favorites = user?.favoriteTVIds?.filter(id => id !== tvId)

        const updatedUser = await prismadb.user.update({
            where: {
                email: session.user!.email!
            },
            data: {
                favoriteTVIds: favorites
            }
        })

        return new Response(JSON.stringify(updatedUser))
        
    } catch (error) {
        console.log(error)
    }
}

