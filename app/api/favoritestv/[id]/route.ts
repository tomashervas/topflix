import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";

export async function POST(request: Request, {params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }

    const tvId = params.id

    const { searchParams } = new URL(request.url)
    const profile:string | null = searchParams.get('profile')

    if(!profile) {
        return new Response("Invalid request", {status: 400})
    }


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
                profiles: {
                    updateMany: {
                        where: {
                            name: profile
                        },
                        data: {
                            favoriteTVIds: {
                                push: tvId
                            }
                        }
                    }
                }
            }
        })

        return new Response(JSON.stringify(user))
        
    } catch (error) {
        console.log(error)
    }
}

export async function DELETE(request: Request, {params}: {params: {id: string}}) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return new Response("Unauthorized", {status: 401})
    }
    
    const tvId = params.id

    const { searchParams } = new URL(request.url)
    const profile:string | null = searchParams.get('profile')

    if(!profile) {
        return new Response("Invalid request", {status: 400})
    }

    
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

        const favorites = user?.profiles.find(p=>p.name===profile)?.favoriteTVIds?.filter(id => id !== tvId)

        const updatedUser = await prismadb.user.update({
            where: {
                email: session.user!.email!
            },
            data: {
                profiles: {
                    updateMany: {
                        where: {
                            name: profile
                        },
                        data: {
                            favoriteTVIds: favorites
                        }
                    }
                }
            }
        })

        return new Response(JSON.stringify(updatedUser))
        
    } catch (error) {
        console.log(error)
    }
}

