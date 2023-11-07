import useFetch from "@/hooks/useFetch"
import prismadb from "@/lib/prismadb";
import BillboardVideo from "../../components/BillboardVideo";
import { Movie } from "@/models/movie";
import Budget from "../../components/Budget";
import Player from "../../components/Player";
import { Episode, TVShow } from "@prisma/client";
import Seasons from "../../components/Seasons";

import Vibrant from 'node-vibrant'




const TVShowPage = async ({params}:{params: {id: string}}) => {


    const tv = await prismadb.tVShow.findUnique({
        where: {
            id: params.id
        }
    })

    const palette = await Vibrant.from(tv?.thumbnailUrl!).getPalette()
    const arrayPalette =  Object.values(palette)
    const sortedArray = arrayPalette.sort((a, b) => b!.population - a!.population)
    const colorA = sortedArray[0]?.hex!
    const colorB = sortedArray[1]?.hex!

  return (
    <div className="mt-12">
        <BillboardVideo media={tv as TVShow} colors={[colorA, colorB]}/>
        <div className="p-4 md:p-8">
            <p>Serie</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold py-1">{tv?.nameShow}</h1>
            <p>Creado por: {tv?.created_by.map((director) => director).join(', ')}</p>
            <div className="flex items-center space-x-4 py-2">
                <p className="text-gray-400 text-sm">Estreno: {tv?.first_air_date}</p>
                <Budget rating={tv?.content_rating}/>
                <p>{tv?.duration} min</p>
            </div>
            <Seasons tv={tv as TVShow}/>

            <div className="my-2">
                <div tabIndex={1} className="line-clamp-4 focus:line-clamp-none"><span className="font-semibold">Sinopsis</span>: {tv?.overview}</div>
            </div>



             
        </div>
    </div>
  )
}
export default TVShowPage