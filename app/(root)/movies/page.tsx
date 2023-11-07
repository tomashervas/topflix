import Vibrant from "node-vibrant";
import BillboardVideo from "../components/BillboardVideo";
import ScrollList from "../components/ScrollList"
import ScrollListServer from "../components/ScrollListServer"
import prismadb from "@/lib/prismadb";
import { Movie } from "@/models/movie";

const MoviesPage = async () => {

  const today = new Date();

  const last2weeks = new Date(today);
  last2weeks.setDate(today.getDate() - 40);

  const count =  await prismadb.movie.count({
    where: {
      createdAt: {
        gte: last2weeks
      }
    }
  })
  const randomMovie = Math.floor(Math.random() * count | 0)

  let movie = await prismadb.movie.findMany({
    where: {
      createdAt: {
        gte: last2weeks
      }
    },
    take: 1,
    skip: randomMovie
})

  if (movie.length === 0) {
    movie = await prismadb.movie.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    })
  }


  const clasicos = await prismadb.movie.findMany({
    where: {
      release_date: {
        lt: '1990-01-01'
      }
    },
    orderBy: {
      title: 'asc'
    },
    take: 20
  })

  const noventas = await prismadb.movie.findMany({
    where: {
      release_date: {
        lt: '2010-01-01'
      },
      AND: {
        release_date: {
          gt: '1990-01-01'
        }
      }
    },
    orderBy: {
      title: 'asc'
    },
    take: 20
  })

  const thrillers = await prismadb.movie.findMany({
    where:{
      genres: {
        hasSome: ['Crimen','Misterio', 'Suspense']
      }
    },
    orderBy: {
      release_date: 'desc'
    },
    take: 20
  })

  const comedia = await prismadb.movie.findMany({
    where:{
      genres: {
        hasSome: ['Comedia']
      }
    },
    orderBy: {
      release_date: 'desc'
    },
    take: 20
  })

  const drama = await prismadb.movie.findMany({
    where:{
      genres: {
        hasSome: ['Drama']
      }
    },
    orderBy: {
      release_date: 'desc'
    },
    take: 20
  })

  const accion = await prismadb.movie.findMany({
    where:{
      genres: {
        hasSome: ['Acción', 'Aventura']
      }
    },
    orderBy: {
      release_date: 'desc'
    },
    take: 20
  })

  const romance = await prismadb.movie.findMany({
    where:{
      genres: {
        hasSome: ['Romance']
      }
    },
    orderBy: {
      release_date: 'desc'
    },
    take: 20
  })

  const ficcion = await prismadb.movie.findMany({
    where:{
      genres: {
        hasSome: ['Ciencia ficción']
      }
    },
    orderBy: {
      release_date: 'desc'
    },
    take: 20
  })

  const familiar = await prismadb.movie.findMany({
    where:{
      genres: {
        hasSome: ['Familia']
      }
    },
    orderBy: {
      release_date: 'desc'
    },
    take: 20
  })

  const terror = await prismadb.movie.findMany({
    where:{
      genres: {
        hasSome: ['Terror']
      }
    },
    orderBy: {
      release_date: 'desc'
    },
    take: 20
  })
  
  const palette = await Vibrant.from(movie[0]?.thumbnailUrl!).getPalette()
    const arrayPalette =  Object.values(palette)
    const sortedArray = arrayPalette.sort((a, b) => b!.population - a!.population)
    const colorA = sortedArray[0]?.hex!
    const colorB = sortedArray[1]?.hex!
  


  return (
    <div className="mt-12">
        <BillboardVideo colors={[colorA, colorB]}  media={movie[0] as Movie}/>
        <ScrollList title='Añadido recientemente' url='/api/movies' isMovie/>
        {thrillers.length > 0 && <ScrollListServer title='El mejor suspense' data={thrillers} isMovie />}
        {ficcion.length > 0 && <ScrollListServer title='Descubre nuevos horizontes' data={ficcion} isMovie />}
        {drama.length > 0 && <ScrollListServer title='Un poco de drama' data={drama} isMovie />}
        {accion.length > 0 && <ScrollListServer title='Acción y aventura' data={accion} isMovie />}
        {comedia.length > 0 && <ScrollListServer title='Para reír un rato' data={comedia} isMovie />}
        {familiar.length > 0 && <ScrollListServer title='Para toda la familia' data={familiar} isMovie />}
        {romance.length > 0 && <ScrollListServer title='Siempre nos quedará París' data={romance} isMovie />}
        {terror.length > 0 && <ScrollListServer title='Para pasarlo de miedo' data={terror} isMovie />}
        {noventas.length > 0 && <ScrollListServer title='Películas de los 90' data={noventas} isMovie />}
        {clasicos.length > 0 && <ScrollListServer title='Grandes clásicos' data={clasicos} isMovie />}

    </div>
  )
}
export default MoviesPage