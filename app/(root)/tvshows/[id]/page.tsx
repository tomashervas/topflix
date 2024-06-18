import useFetch from "@/hooks/useFetch"
import prismadb from "@/lib/prismadb";
import BillboardVideo from "../../components/BillboardVideo";
import { Movie } from "@/models/movie";
import Budget from "../../components/Budget";
import Player from "../../components/Player";
import { Episode, TVShow } from "@prisma/client";
import Seasons from "../../components/Seasons";

import Vibrant from 'node-vibrant'
import { cookies } from "next/headers";
import { getColorsImg } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateToken } from "@/lib/jwt";
import BtnFavorite from "../../components/BtnFavorite";
import FavoriteToogle from "../../components/FavoriteToogle";




const TVShowPage = async ({ params }: { params: { id: string } }) => {

    const session = await getServerSession(authOptions)
    if(!session) {
        return redirect(process.env.NEXT_PUBLIC_DOMAIN_URL + '/auth')
    }

    const token = generateToken(session.user!.email!, session.user!.email === process.env.ADMIN)

    const isAdmin = session.user!.email === process.env.ADMIN

    const cookieStore = cookies()
    const limit = cookieStore.get('limitedAge')
    const limitedAge = (!limit || limit.value === 'null') ? 20 : Number(limit.value)


    const tv = await prismadb.tVShow.findUnique({
        where: {
            id: params.id
        }
    })

    const [colorA, colorB] = await getColorsImg(Vibrant, tv?.thumbnailUrl!, limitedAge)

    return (
        <div className={`${limitedAge < 12 ? 'bg-blue-700': 'bg-zinc-900'}  flex flex-col relative`}>
            <BillboardVideo media={tv as TVShow} colors={[colorA, colorB]} limitedAge={limitedAge}/>
            <div className="md:absolute top-[30vh] left-8 p-4 pb-0">
                <p className="text-red-600 text-xl md:text-2xl shadow">Serie</p>
                <div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold py-1">{tv?.nameShow}</h1>
                    <FavoriteToogle item={tv as TVShow} isMovie={false}/>
                </div>
            </div>
            <div className="p-4 pt-2 md:p-8">
                <p>Creado por: {tv?.created_by.map((director) => director).join(', ')}</p>
                <div className="flex items-center space-x-4 py-2">
                    <p className="text-gray-400 text-sm">Estreno: {tv?.first_air_date}</p>
                    <Budget rating={tv?.content_rating!} />
                    <p>{tv?.duration} min</p>
                </div>
                <Seasons tv={tv as TVShow} token={token} isAdmin={isAdmin} />

                <div className="my-2">
                    <div tabIndex={1} className="line-clamp-4 focus:line-clamp-none"><span className="font-semibold">Sinopsis</span>: {tv?.overview}</div>
                </div>




            </div>
        </div>
    )
}
export default TVShowPage