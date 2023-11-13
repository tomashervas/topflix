import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Billboard from './components/Billboard'
import ScrollList from './components/ScrollList'
import Favorites from './components/Favorites'
import Vibrant from 'node-vibrant'
import { TVShow, Movie } from '@prisma/client'
import prismadb from "@/lib/prismadb";
import { cookies } from 'next/headers'


export const revalidate = 0

export default async function Home(/* {searchParams}: {searchParams: { limitedAge: string | null }} */) {

  
  const session = await getServerSession(authOptions)
  
  if(!session) {
    return redirect('http://localhost:3000/auth')
  }

  const cookieStore = cookies()
  const limit = cookieStore.get('limitedAge')

  // const limitedAge = (!searchParams.limitedAge || searchParams.limitedAge === 'null') ? 20 : Number( searchParams.limitedAge )
  const limitedAge = (!limit || limit.value === 'null') ? 20 : Number( limit.value )
 
  console.log('limited cookie: ' + limitedAge, typeof limitedAge)
  
  const movieOrTV = (Math.floor(Math.random() * 2))
    
  const count = movieOrTV === 0 ? await prismadb.tVShow.count() : await prismadb.movie.count()
  const randomItem = Math.floor(Math.random() * count);

  let item: Movie[] | TVShow[];
  if(movieOrTV === 0) {
      item = await prismadb.tVShow.findMany({
          where: {
            content_rating: {
              lte: limitedAge
            }
          },

          take: 1,
          skip: randomItem
      })
  } else {
      item = await prismadb.movie.findMany({
        where: {
          content_rating: {
            lte: limitedAge
          }
          },
          take: 1,
          skip: randomItem
      })
  }

  let colorA = '#18181b'
  let colorB = '#18181b'

  try {
    const palette = await Vibrant.from(item[0]?.thumbnailUrl!).getPalette()
    const arrayPalette =  Object.values(palette)
    const sortedArray = arrayPalette.sort((a, b) => b!.population - a!.population)
    colorA = sortedArray[0]?.hex!
    colorB = sortedArray[1]?.hex!
    
  } catch (error) {
    colorA = '#18181b'
    colorB = '#18181b'
  }

  console.log('item: ' + item[0]?.name)

  return (
    <>
      <Billboard colors={[colorA, colorB]} media={item[0]}/>
      <Favorites/>
      <ScrollList title='Destacado: películas' url={'/api/movies?limitedAge=' + limitedAge} isMovie/>
      <ScrollList title='Destacado: series' url={'/api/tvshows?limitedAge=' + limitedAge} isMovie={false}/>
    </>
  )
}
