import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Billboard from './components/Billboard'
import ScrollList from './components/ScrollList'
import Favorites from './components/Favorites'
import Vibrant from 'node-vibrant'
import { TVShow, Movie } from '@prisma/client'
import prismadb from "@/lib/prismadb";


export default async function Home() {

  const session = await getServerSession(authOptions)

  if(!session) {
    return redirect('http://localhost:3000/auth')
  }

  const movieOrTV = (Math.floor(Math.random() * 2))
    
  const count = movieOrTV === 0 ? await prismadb.tVShow.count() : await prismadb.movie.count()
  const randomItem = Math.floor(Math.random() * count);

  let item: Movie[] | TVShow[];
  if(movieOrTV === 0) {
      item = await prismadb.tVShow.findMany({
          take: 1,
          skip: randomItem
      })
  } else {
      item = await prismadb.movie.findMany({
          take: 1,
          skip: randomItem
      })
  }

  const palette = await Vibrant.from(item[0]?.thumbnailUrl!).getPalette()
  const arrayPalette =  Object.values(palette)
  const sortedArray = arrayPalette.sort((a, b) => b!.population - a!.population)
  const colorA = sortedArray[0]?.hex!
  const colorB = sortedArray[1]?.hex!
  // console.log((palette).DarkMuted?.hex)



  return (
    <>
      <Billboard colors={[colorA, colorB]} media={item[0]}/>
      <Favorites/>
      <ScrollList title='Destacado: películas' url='/api/movies' isMovie/>
      <ScrollList title='Destacado: series' url='/api/tvshows' isMovie={false}/>
    </>
  )
}
