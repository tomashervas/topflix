import BillboardVideo from "@/app/(root)/components/BillboardVideo"
import { Movie } from "@/models/movie"
import prismadb from "@/lib/prismadb"

const PlayPage = async ({params}: {params: {id: string}}) => {

    const movie = await prismadb.movie.findUnique({
        where: {
            id: params.id
        }
    })
    
  return (
    <div className="h-screen flex justify-center items-center">
        <BillboardVideo movie={movie as Movie}/>
    </div>
  )
}
export default PlayPage