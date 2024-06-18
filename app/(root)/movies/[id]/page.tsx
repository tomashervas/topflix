import useFetch from "@/hooks/useFetch"
import prismadb from "@/lib/prismadb";
import BillboardVideo from "../../components/BillboardVideo";

import Budget from "../../components/Budget";
import MoviePlayer from "../../components/MoviePlayer";
import Vibrant from "node-vibrant";
import { Movie } from "@prisma/client";
import { cookies } from "next/headers";
import { getColorsImg } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateToken } from "@/lib/jwt";
import OpenWith from "../../components/OpenWith";
import FavoriteToogle from "../../components/FavoriteToogle";

const MoviePage = async ({ params }: { params: { id: string } }) => {

    const session = await getServerSession(authOptions)
    if(!session) {
        return redirect(process.env.NEXT_PUBLIC_DOMAIN_URL + '/auth')
    }

    const token = generateToken(session.user!.email!, session.user!.email === process.env.ADMIN)
    // const token = generateToken(session.user!.email!, true)

    const isAdmin = session.user!.email === process.env.ADMIN
    // const isAdmin = true

    const movie = await prismadb.movie.findUnique({
        where: {
            id: params.id
        }
    })

    const cookieStore = cookies()
    const limit = cookieStore.get('limitedAge')
    const limitedAge = (!limit || limit.value === 'null') ? 20 : Number(limit.value)

    const [colorA, colorB] = await getColorsImg(Vibrant, movie?.thumbnailUrl!, limitedAge)


    return (
        <div className={`${limitedAge < 12 ? 'bg-blue-700': 'bg-zinc-900'}  flex flex-col relative`}>
            <BillboardVideo colors={[colorA, colorB]} media={movie as Movie} limitedAge={limitedAge } />
            <div className="md:absolute top-[30vh] left-8 p-4 pb-0">
                <p className="text-red-600 text-xl md:text-2xl shadow">Película</p>
                <div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold py-1">{movie?.title}</h1>
                    <FavoriteToogle item={movie as Movie} isMovie/>
                </div>
            </div>
            <div className="p-4 pt2">
                <p>Director: {movie?.director.map((director) => director).join(', ')}</p>
                <div className="flex items-center space-x-4 py-2">
                    <p className="text-gray-400 text-sm">Estreno: {movie?.release_date}</p>
                    <Budget rating={movie?.content_rating!} />
                    <p>{movie?.duration} min</p>
                </div>

                {isAdmin && <div className="flex w-full md:w-1/2 gap-2">
                        <MoviePlayer media={movie as Movie} token={token}/>
                        <OpenWith url={movie?.videoUrl!} token={token} isTv={false}/>
                    </div>
                }

                <div className="my-2">
                    <div tabIndex={1} className="line-clamp-4 focus:line-clamp-none"><span className="font-semibold">Sinopsis</span>: {movie?.overview}</div>
                </div>


                <div tabIndex={2} className="line-clamp-3 focus:line-clamp-none"><span className="font-semibold">Reparto</span>: {movie?.cast.map((actors) => actors.name).join(', ')}</div>


            </div>
        </div>
    )
}
export default MoviePage