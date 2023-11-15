import useFetch from "@/hooks/useFetch"
import prismadb from "@/lib/prismadb";
import BillboardVideo from "../../components/BillboardVideo";

import Budget from "../../components/Budget";
import MoviePlayer from "../../components/MoviePlayer";
import Vibrant from "node-vibrant";
import { Movie } from "@prisma/client";
import { cookies } from "next/headers";
import { getColorsImg } from "@/lib/utils";

const MoviePage = async ({ params }: { params: { id: string } }) => {


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
        <div className={limitedAge < 12 ? 'bg-blue-700': 'bg-zinc-900'}>
            <BillboardVideo colors={[colorA, colorB]} media={movie as Movie} limitedAge={limitedAge } />
            <div className="p-4">
                <p>Película</p>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold py-1">{movie?.title}</h1>
                <p>Director: {movie?.director.map((director) => director).join(', ')}</p>
                <div className="flex items-center space-x-4 py-2">
                    <p className="text-gray-400 text-sm">Estreno: {movie?.release_date}</p>
                    <Budget rating={movie?.content_rating!} />
                    <p>{movie?.duration} min</p>
                </div>
                <MoviePlayer media={movie as Movie} />

                <div className="my-2">
                    <div tabIndex={1} className="line-clamp-4 focus:line-clamp-none"><span className="font-semibold">Sinopsis</span>: {movie?.overview}</div>
                </div>


                <div tabIndex={2} className="line-clamp-3 focus:line-clamp-none"><span className="font-semibold">Reparto</span>: {movie?.cast.map((actors) => actors.name).join(', ')}</div>


            </div>
        </div>
    )
}
export default MoviePage