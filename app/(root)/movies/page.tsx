import Vibrant from "node-vibrant";
import BillboardVideo from "../components/BillboardVideo";
import ScrollList from "../components/ScrollList"
import ScrollListServer from "../components/ScrollListServer"
import prismadb from "@/lib/prismadb";
import { Movie } from "@prisma/client";
import { cookies } from "next/headers";
import All from "../components/All";
import { getColorsImg } from "@/lib/utils";
import Loader from "../components/Loader";

const getByGenre = (genres: string[], limited: number) => {
  return prismadb.movie.findMany({
    where:{
      AND: [
        {
          content_rating: {
            lte: limited
          }
        },
        {
          genres: {
            hasSome: genres
          }
        }
      ]
    },
    orderBy: {
      release_date: 'desc'
    },
    take: 20
  })
}

export const fetchCache = 'only-no-store'

const MoviesPage = async ({searchParams}: {searchParams: { sort_by_name: string | null }}) => {
  console.log('desde movies ' + searchParams.sort_by_name)
  const cookieStore = cookies()
  const limit = cookieStore.get('limitedAge')

  const limitedAge = (!limit || limit.value === 'null') ? 20 : Number( limit.value )

  const today = new Date();

  const last2weeks = new Date(today);
  last2weeks.setDate(today.getDate() - 40);

  const count =  await prismadb.movie.count({
    where: {
      AND: [
        {
          content_rating: {
            lte: limitedAge
          }
        },
        {
          createdAt: {
            gte: last2weeks
          }
        }
      ]
      
    }
  })
  const randomMovie = Math.floor(Math.random() * count | 0)

  let movie = await prismadb.movie.findMany({
    where: {
      AND: [
        {
          content_rating: {
            lte: limitedAge
          }
        },
        {
          createdAt: {
            gte: last2weeks
          }
        }
      ]
    },
    take: 1,
    skip: randomMovie
})

  if (movie.length === 0) {
    movie = await prismadb.movie.findMany({
      where: {
        content_rating: {
          lte: limitedAge
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    })
  }


  const clasicos = prismadb.movie.findMany({
    where: {
      AND: [
        {
          content_rating: {
            lte: limitedAge
          }
        },
        {
          release_date: {
            lt: '1990-01-01'
          }
        }
      ]
    },
    orderBy: {
      title: 'asc'
    },
    take: 20
  })

  const noventas = prismadb.movie.findMany({
    where: {
      AND: [
        {
          content_rating: {
            lte: limitedAge
          }
        },
        {
          release_date: {
            gt: '1990-01-01'
          }
        },
        {
          release_date: {
            lt: '2010-01-01'
          }
        }
      ]
    },
    orderBy: {
      title: 'asc'
    },
    take: 20
  })

  const thrillers = getByGenre(['Crimen','Misterio', 'Suspense'], limitedAge)

  const comedia = getByGenre(['Comedia'], limitedAge)

  const drama = getByGenre(['Drama'], limitedAge)

  const accion = getByGenre(['Acción', 'Aventura'], limitedAge)

  const romance = getByGenre(['Romance'], limitedAge)

  const ficcion = getByGenre(['Ciencia ficción'], limitedAge)

  const familiar = getByGenre(['Familia'], limitedAge)

  const terror = getByGenre(['Terror'], limitedAge)

  const [ thrillersResults, comediaResults, dramaResults, accionResults, romanceResults, ficcionResults, familiarResults, terrorResults, clasicosResults, noventasResults] = await Promise.all([thrillers, comedia, drama, accion, romance, ficcion, familiar, terror, clasicos, noventas])
  
  const [colorA, colorB] = await getColorsImg(Vibrant, movie[0]?.thumbnailUrl!, limitedAge)
  


  return (
    <div className={limitedAge < 12 ? 'bg-blue-700': 'bg-zinc-900'}>
        <BillboardVideo colors={[colorA, colorB]}  media={movie[0] as Movie} limitedAge={limitedAge}/>
        <ScrollList title='Añadido recientemente' url={'/api/movies?limitedAge=' + limitedAge} isMovie/>
        {thrillersResults.length > 0 && <ScrollListServer title='El mejor suspense' data={thrillersResults} isMovie />}
        {ficcionResults.length > 0 && <ScrollListServer title='Descubre nuevos horizontes' data={ficcionResults} isMovie />}
        {dramaResults.length > 0 && <ScrollListServer title='Un poco de drama' data={dramaResults} isMovie />}
        {accionResults.length > 0 && <ScrollListServer title='Acción y aventura' data={accionResults} isMovie />}
        {comediaResults.length > 0 && <ScrollListServer title='Para reír un rato' data={comediaResults} isMovie />}
        {familiarResults.length > 0 && <ScrollListServer title='Para toda la familia' data={familiarResults} isMovie />}
        {romanceResults.length > 0 && <ScrollListServer title='Siempre nos quedará París' data={romanceResults} isMovie />}
        {terrorResults.length > 0 && <ScrollListServer title='Para pasarlo de miedo' data={terrorResults} isMovie />}
        {noventasResults.length > 0 && <ScrollListServer title='Películas de los 90' data={noventasResults} isMovie />}
        {clasicosResults.length > 0 && <ScrollListServer title='Grandes clásicos' data={clasicosResults} isMovie />}
        <All sort={searchParams.sort_by_name} isMovie/>

    </div>
  )
}
export default MoviesPage