import BillboardVideo from "../components/BillboardVideo";
import ScrollList from "../components/ScrollList"
import ScrollListServer from "../components/ScrollListServer"
import prismadb from "@/lib/prismadb";
import Vibrant from "node-vibrant";
import { Movie } from "@/models/movie";

const MoviesPage = async () => {

  const today = new Date();

  const last2weeks = new Date(today);
  last2weeks.setDate(today.getDate() - 30);

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

  return (
    <div className="mt-12">
        <BillboardVideo colors={['#52525b', '#27272a']}  media={movie[0] as Movie}/>
        <ScrollList title='Añadido recientemente' url='/api/movies' isMovie/>
        <ScrollListServer title='Películas de los 90' data={noventas} isMovie />
        <ScrollListServer title='Grandes clásicos' data={clasicos} isMovie />

    </div>
  )
}
export default MoviesPage