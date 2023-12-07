import { cookies } from "next/headers";
import { getColorsImg } from "@/lib/utils";
import { TVShow } from "@prisma/client";
import All from "../components/All";
import BillboardVideo from "../components/BillboardVideo";
import prismadb from "@/lib/prismadb";
import ScrollList from "../components/ScrollList"
import Vibrant from "node-vibrant";
import Billboard from "../components/Billboard";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const ScrollListServerLazy = dynamic(() => import("../components/ScrollListServer"))

const getByGenre = (genres: string[], limited: number) => {
  
  return prismadb.tVShow.findMany({
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
      first_air_date: 'desc'
    },
    take: 20
  })
}

const TVsPage = async ({searchParams}: {searchParams: { sort_by_name: string | null }}) => {
  
  const session = await getServerSession(authOptions)
    if(!session) {
        return redirect(process.env.NEXT_PUBLIC_DOMAIN_URL + '/auth')
    }
  
  console.log('desde tvs ' + searchParams.sort_by_name)
  const cookieStore = cookies()
  const limit = cookieStore.get('limitedAge')

  const limitedAge = (!limit || limit.value === 'null') ? 20 : Number( limit.value )

  const today = new Date();

  const last2weeks = new Date(today);
  last2weeks.setDate(today.getDate() - 14);

  const count =  await prismadb.tVShow.count({
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
  const randomTV = Math.floor(Math.random() * count | 0)

  let tv = await prismadb.tVShow.findMany({
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
    skip: randomTV
})

  if (tv.length === 0) {
    tv = await prismadb.tVShow.findMany({
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


  const clasicos = prismadb.tVShow.findMany({
    where: {
      AND: [
        {
          content_rating: {
            lte: limitedAge
          }
        },
        {
          first_air_date: {
            lt: '1990-01-01'
          }
        }
      ]
    },
    orderBy: {
      nameShow: 'asc'
    },
    take: 20
  })

  const noventas = prismadb.tVShow.findMany({
    where: {
      AND: [
        {
          content_rating: {
            lte: limitedAge
          }
        },
        {
          first_air_date: {
            gt: '1990-01-01'
          }
        },
        {
          first_air_date: {
            lt: '2010-01-01'
          }
        }
      ]
    },
    orderBy: {
      nameShow: 'asc'
    },
    take: 20
  })

  const thrillers = getByGenre(['Crimen','Misterio'], limitedAge)

  const comedia = getByGenre(['Comedia'], limitedAge)

  const drama = getByGenre(['Drama'], limitedAge)

  const accion = getByGenre(['Action & Adventure'], limitedAge)
   
  const ficcion = getByGenre(['Sci-Fi & Fantasy'], limitedAge)
   
  const familiar = getByGenre(['Familia', 'Kids'], limitedAge)

  const [thrillersResults, comediaResults, dramaResults, accionResults, ficcionResults, familiarResults, noventasResults, clasicosResults] = await Promise.all([thrillers, comedia, drama, accion, ficcion, familiar, noventas, clasicos])

  const [colorA, colorB] = await getColorsImg(Vibrant, tv[0]?.thumbnailUrl!, limitedAge)
    // console.log(palette.DarkMuted?.hex)


  return (
    <div className={limitedAge < 12 ? 'bg-blue-700': 'bg-zinc-900'}>
        <Billboard colors={[colorA, colorB]}  media={tv[0] as TVShow} limitedAge={limitedAge}/>
        <ScrollList title='Añadido recientemente' url={'/api/tvshows?limitedAge=' + limitedAge} isMovie={false}/>
        {thrillersResults.length > 0 && <ScrollListServerLazy title='El mejor suspense' data={thrillersResults} isMovie={false} />}
        {ficcionResults.length > 0 && <ScrollListServerLazy title='Descubre nuevos horizontes' data={ficcionResults} isMovie={false} />}
        {dramaResults.length > 0 && <ScrollListServerLazy title='Un poco de drama' data={dramaResults} isMovie={false} />}
        {accionResults.length > 0 && <ScrollListServerLazy title='Acción y aventura' data={accionResults} isMovie={false} />}
        {comediaResults.length > 0 && <ScrollListServerLazy title='Para reír un rato' data={comediaResults} isMovie={false} />}
        {familiarResults.length > 0 && <ScrollListServerLazy title='Para toda la familia' data={familiarResults} isMovie={false} />}
        {noventasResults.length > 0 && <ScrollListServerLazy title='Series de los 90' data={noventasResults} isMovie={false} />}
        {clasicosResults.length > 0 && <ScrollListServerLazy title='Grandes clásicos' data={clasicosResults} isMovie={false} />}
        <All sort={searchParams.sort_by_name} isMovie={false}/>

    </div>
  )
}
export default TVsPage