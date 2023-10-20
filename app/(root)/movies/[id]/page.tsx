import useFetch from "@/hooks/useFetch"
import prismadb from "@/lib/prismadb";
import BillboardVideo from "../../components/BillboardVideo";
import { Movie } from "@/models/movie";
import Budget from "../../components/Budget";
import ButtonSolid from "../../components/ButtonSolid";

const page = async ({params}:{params: {id: string}}) => {

    const movie = await prismadb.movie.findUnique({
        where: {
            id: params.id
        }
    })
  return (
    <div>
        <BillboardVideo movie={movie as Movie}/>
        <div className="p-4">
            <p>Película</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold py-1">{movie?.title}</h1>
            <p>Director: {movie?.director.map((director) => director).join(', ')}</p>
            <div className="flex items-center space-x-4 py-2">
                <p className="text-gray-400 text-sm">Estreno: {movie?.release_date}</p>
                <Budget movie={movie as Movie}/>
                <p>{movie?.duration} min</p>
            </div>
            <div>
                <ButtonSolid movie={movie as Movie}/>
            </div>
            <div className="my-2">
                <div tabIndex={1} className="line-clamp-4 focus:line-clamp-none"><span className="font-semibold">Sinopsis</span>: {movie?.overview}</div>
            </div>


            <div tabIndex={1} className="line-clamp-3 focus:line-clamp-none"><span className="font-semibold">Reparto</span>: {movie?.cast.map((actors) => actors.name).join(', ')}</div>

             
        </div>
    </div>
  )
}
export default page