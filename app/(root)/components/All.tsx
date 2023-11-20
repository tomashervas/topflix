import { cookies } from "next/headers";
import { getAllMovies, getAllTVs} from "./actions";
import AllItems from "./AllItems";
import LoadMoreItems from "./LoadMoreItems";
import { FaSortAlphaDown } from "react-icons/fa"
import Link from "next/link";

const All = async ({ isMovie, sort }: { isMovie: boolean, sort: string | undefined| null }) => {
  const cookieStore = cookies()
  const limit = cookieStore.get('limitedAge')
  const limitedAge = (!limit || limit.value === 'null') ? 20 : Number(limit.value)
  const sortByName= sort === 'true'
  console.log("desde all: " + sortByName)
  const items = isMovie ? await getAllMovies(limitedAge, undefined, undefined, sortByName ) : await getAllTVs(limitedAge, undefined, undefined, sortByName )

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-xl md:text-2xl font-semibold px-6">Todas las {isMovie ? 'peliculas' : 'series'}</h3>
        <a className="text-zinc-400 p-2 mr-6 rounded-xl border border-zinc-400 hover:text-zinc-100 hover:border-zinc-100" href={isMovie ? '/movies?sort_by_name=true' : '/tvshows?sort_by_name=true' } ><FaSortAlphaDown size={20}/></a>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 justify-items-center gap-4 p-6">
        <AllItems items={items} isMovie={isMovie} />
        <LoadMoreItems isMovie={isMovie} limitedAge={limitedAge} sort={sortByName} />
      </div>
    </div>
  )
}
export default All