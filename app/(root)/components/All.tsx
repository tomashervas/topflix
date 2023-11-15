import Card from "./Card";
import { cookies } from "next/headers";
import { getAllMovies, getAllTVs } from "./actions";

const All = async ({isMovie}: {isMovie: boolean}) => {
    const cookieStore = cookies()
    const limit = cookieStore.get('limitedAge')
    const limitedAge = (!limit || limit.value === 'null') ? 20 : Number( limit.value )

    const items = isMovie ? await getAllMovies(limitedAge) : await getAllTVs(limitedAge)

  return (
    <div>
        <h3 className="text-xl md:text-2xl font-semibold px-6">Todas las {isMovie ? 'peliculas' : 'series'}</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 justify-items-center gap-4 p-6">
            {items.map((item) => (
                <Card key={item.id} item={item} isMovie={isMovie} desde="Desde All"/>
            ))}
        </div>
    </div>
  )
}
export default All