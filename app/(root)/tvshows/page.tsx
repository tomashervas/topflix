import { TVShow } from "@prisma/client";
import BillboardVideo from "../components/BillboardVideo";
import ScrollList from "../components/ScrollList"
import ScrollListServer from "../components/ScrollListServer"
import prismadb from "@/lib/prismadb";
import { Movie } from "@/models/movie";
import Vibrant from "node-vibrant";

const TVsPage = async () => {

  const today = new Date();

  const last2weeks = new Date(today);
  last2weeks.setDate(today.getDate() - 14);

  const count =  await prismadb.tVShow.count({
    where: {
      createdAt: {
        gte: last2weeks
      }
    }
  })
  const randomTV = Math.floor(Math.random() * count | 0)

  let tv = await prismadb.tVShow.findMany({
    where: {
      createdAt: {
        gte: last2weeks
      }
    },
    take: 1,
    skip: randomTV
})

  if (tv.length === 0) {
    tv = await prismadb.tVShow.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    })
  }


  const clasicos = await prismadb.tVShow.findMany({
    where: {
      first_air_date: {
        lt: '1990-01-01'
      }
    },
    orderBy: {
      nameShow: 'asc'
    },
    take: 20
  })

  const noventas = await prismadb.tVShow.findMany({
    where: {
      first_air_date: {
        lt: '2010-01-01'
      },
      AND: {
        first_air_date: {
          gt: '1990-01-01'
        }
      }
    },
    orderBy: {
      nameShow: 'asc'
    },
    take: 20
  })

  const thrillers = await prismadb.tVShow.findMany({
    where:{
      genres: {
        hasSome: ['Crimen','Misterio']
      }
    },
    orderBy: {
      first_air_date: 'desc'
    },
    take: 20
  })

  const comedia = await prismadb.tVShow.findMany({
    where:{
      genres: {
        hasSome: ['Comedia']
      }
    },
    orderBy: {
      first_air_date: 'desc'
    },
    take: 20
  })

  const drama = await prismadb.tVShow.findMany({
    where:{
      genres: {
        hasSome: ['Drama']
      }
    },
    orderBy: {
      first_air_date: 'desc'
    },
    take: 20
  })

  const accion = await prismadb.tVShow.findMany({
    where:{
      genres: {
        hasSome: ['Action & Adventure']
      }
    },
    orderBy: {
      first_air_date: 'desc'
    },
    take: 20
  })

  const ficcion = await prismadb.tVShow.findMany({
    where:{
      genres: {
        hasSome: ['Sci-Fi & Fantasy']
      }
    },
    orderBy: {
      first_air_date: 'desc'
    },
    take: 20
  })

  const familiar = await prismadb.tVShow.findMany({
    where:{
      genres: {
        hasSome: ['Familia', 'Kids']
      }
    },
    orderBy: {
      first_air_date: 'desc'
    },
    take: 20
  })

    const palette = await Vibrant.from(tv[0]?.thumbnailUrl!).getPalette()
    const arrayPalette =  Object.values(palette)
    const sortedArray = arrayPalette.sort((a, b) => b!.population - a!.population)
    const colorA = sortedArray[0]?.hex!
    const colorB = sortedArray[1]?.hex!
    // console.log(palette.DarkMuted?.hex)

  


  return (
    <div className="mt-12">
        <BillboardVideo colors={[colorA, colorB]}  media={tv[0] as TVShow}/>
        <ScrollList title='Añadido recientemente' url='/api/tvshows' isMovie={false}/>
        {thrillers.length > 0 && <ScrollListServer title='El mejor suspense' data={thrillers} isMovie={false} />}
        {ficcion.length > 0 && <ScrollListServer title='Descubre nuevos horizontes' data={ficcion} isMovie={false} />}
        {drama.length > 0 && <ScrollListServer title='Un poco de drama' data={drama} isMovie={false} />}
        {accion.length > 0 && <ScrollListServer title='Acción y aventura' data={accion} isMovie={false} />}
        {comedia.length > 0 && <ScrollListServer title='Para reír un rato' data={comedia} isMovie={false} />}
        {familiar.length > 0 && <ScrollListServer title='Para toda la familia' data={familiar} isMovie={false} />}
        {noventas.length > 0 && <ScrollListServer title='Películas de los 90' data={noventas} isMovie={false} />}
        {clasicos.length > 0 && <ScrollListServer title='Grandes clásicos' data={clasicos} isMovie={false} />}

    </div>
  )
}
export default TVsPage