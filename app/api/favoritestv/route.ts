import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prismadb";
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
     const session = await getServerSession(authOptions);
        let isAuthenticated = false;
        let userId: string | undefined;
        let email: string | undefined;    
    
        if (session) {
            isAuthenticated = true;
            email = session.user!.email!
           
        } else {
            const authorizationHeader = request.headers.get('authorization');

            if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
                const token = authorizationHeader.substring(7);
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET! as string) as { userId: string, email: string };
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

    const { searchParams } = new URL(request.url)
    const profile:string | null = searchParams.get('profile')

    if(!profile) {
        return new Response("Invalid request", {status: 400})
    }

    try { 
        const user = await prismadb.user.findUnique({
            where: {
                email
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