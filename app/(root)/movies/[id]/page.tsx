import useFetch from "@/hooks/useFetch"
import prismadb from "@/lib/prismadb";
import BillboardVideo from "../../components/BillboardVideo";
import { Movie } from "@/models/movie";
import Budget from "../../components/Budget";
import MoviePlayer from "../../components/MoviePlayer";
import Vibrant from "node-vibrant";

const MoviePage = async ({params}:{params: {id: string}}) => {


    const movie = await prismadb.movie.findUnique({
        where: {
            id: params.id
        }
    })
    const palette = await Vibrant.from(movie?.thumbnailUrl!).getPalette()
    const arrayPalette =  Object.values(palette)
    const sortedArray = arrayPalette.sort((a, b) => b!.population - a!.population)
    const colorA = sortedArray[0]?.hex!
    const colorB = sortedArray[1]?.hex!


  return (
    <div className="mt-12">
        <BillboardVideo colors={[colorA, colorB]} media={movie as Movie}/>
        <div className="p-4">
            <p>Película</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold py-1">{movie?.title}</h1>
            <p>Director: {movie?.director.map((director) => director).join(', ')}</p>
            <div className="flex items-center space-x-4 py-2">
                <p className="text-gray-400 text-sm">Estreno: {movie?.release_date}</p>
                <Budget rating={movie?.content_rating}/>
                <p>{movie?.duration} min</p>
            </div>
            <MoviePlayer media={movie as Movie}/>

            <div className="my-2">
                <div tabIndex={1} className="line-clamp-4 focus:line-clamp-none"><span className="font-semibold">Sinopsis</span>: {movie?.overview}</div>
            </div>


            <div tabIndex={2} className="line-clamp-3 focus:line-clamp-none"><span className="font-semibold">Reparto</span>: {movie?.cast.map((actors) => actors.name).join(', ')}</div>

             
        </div>
    </div>
  )
}
export default MoviePage