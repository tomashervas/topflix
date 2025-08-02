import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import jwt from "jsonwebtoken";

export async function POST(request: Request, {params}: {params: {id: string}}) {
            const session = await getServerSession(authOptions);
            let isAuthenticated = false;
            let userId: string | undefined;
            let email: string | undefined;    
            if (session) {
                isAuthenticated = true;
                email = session!.user!.email!
               
            } else {
                const authorizationHeader = request.headers.get('authorization');
                if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
                    const token = authorizationHeader.substring(7);
                    try {
                        const decoded = jwt.verify(token, process.env.JWT_SECRET! as string) as { userId: string, email: string };
                        userId = decoded.userId;
                        email = decoded.email;
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

    const movieId = params.id

    const { searchParams } = new URL(request.url)
    const profile:string | null = searchParams.get('profile')

    if(!profile) {
        return new Response("Invalid request", {status: 400})
    }

    try {
        const existingMovie = await prismadb.movie.findUnique({
            where: {
                id: movieId
            }
        })

        if(!existingMovie) {
            return new Response("Movie not found", {status: 404})
        }

        const user = await prismadb.user.update({
            where: {
                email
            },
            data: {
                profiles: {
                    updateMany: {
                        where: {
                            name: profile
                        },
                        data: {
                            favoriteIds: {
                                push: movieId
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
            let isAuthenticated = false;
            let userId: string | undefined;
            let email: string | undefined;    
            if (session) {
                isAuthenticated = true;
                email = session!.user!.email!
               
            } else {
                const authorizationHeader = request.headers.get('authorization');
                if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
                    const token = authorizationHeader.substring(7);
                    try {
                        const decoded = jwt.verify(token, process.env.JWT_SECRET! as string) as { userId: string, email: string };
                        userId = decoded.userId;
                        email = decoded.email;
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

    
    const movieId = params.id

    const { searchParams } = new URL(request.url)
    const profile:string | null = searchParams.get('profile')

    if(!profile) {
        return new Response("Invalid request", {status: 400})
    }

    
    try {
        const existingMovie = await prismadb.movie.findUnique({
            where: {
                id: movieId
            }
        })

        if(!existingMovie) {
            return new Response("Movie not found", {status: 404})
        }

        const user = await prismadb.user.findUnique({
            where: {
                email
            }
        })

        const favorites = user?.profiles.find(p=>p.name===profile)?.favoriteIds?.filter(id => id !== movieId)

        const updatedUser = await prismadb.user.update({
            where: {
                email
            },
            data: {
                profiles: {
                    updateMany: {
                        where: {
                            name: profile
                        },
                        data: {
                            favoriteIds: {
                                set: favorites
                            }
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

