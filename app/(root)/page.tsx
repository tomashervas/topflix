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


export default async function Home(/* {searchParams}: {searchParams: { limitedAge: string | null }} */) {


  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect('http://localhost:3000/auth')
  }

  const cookieStore = cookies()
  const limit = cookieStore.get('limitedAge')
  const limitedAge = (!limit || limit.value === 'null') ? 20 : Number(limit.value)

  // const limitedAge = (!searchParams.limitedAge || searchParams.limitedAge === 'null') ? 20 : Number( searchParams.limitedAge )
  // const limitedAge = 7

  console.log('limited cookie: ' + limitedAge, typeof limitedAge)

  const movieOrTV = (Math.floor(Math.random() * 2))
  console.log('movieOrTV: ' + movieOrTV)

  const count = movieOrTV === 0 ? await prismadb.tVShow.count({where: {content_rating: {lte: limitedAge}}}) 
    : await prismadb.movie.count({where: {content_rating: {lte: limitedAge}}})
  console.log('count: ' + count)
  const randomItem = Math.floor(Math.random() * count);
  console.log('randomItem: ' + randomItem)

  let item: Movie[] | TVShow[] = []
  try {
    item = movieOrTV === 0 ? await prismadb.tVShow.findMany({
      where: {
        content_rating: {
          lte: limitedAge
        }
      },
      take: 1,
      skip: randomItem
    }) : await prismadb.movie.findMany({
      where: {
        content_rating: {
          lte: limitedAge
        }
      },
      take: 1,
      skip: randomItem
    })
    console.log('item: ' + item)
  } catch (error) {
    console.log("error consulta: " + error)
    
  }
  

  let colorA = limitedAge < 12 ? '#1d4ed8' : '#18181b'
  let colorB = limitedAge < 12 ? '#1d4ed8' : '#18181b'

  try {
    const palette = await Vibrant.from(item[0]?.thumbnailUrl!).getPalette()
    const arrayPalette = Object.values(palette)
    const sortedArray = arrayPalette.sort((a, b) => b!.population - a!.population)
    colorA = sortedArray[0]?.hex!
    colorB = sortedArray[1]?.hex!

  } catch (error) {
    console.log(error)
  }

  console.log('item: ' + item[0]?.name)

  return (
    <div className={limitedAge < 12 ? 'bg-blue-700' : 'bg-zinc-900'}>
      <Billboard colors={[colorA, colorB]} media={item[0]} limitedAge={limitedAge}/>
      <Favorites limitedAge={limitedAge}/>
      <ScrollList title='Destacado: películas' url={'/api/movies?limitedAge=' + limitedAge} isMovie />
      <ScrollList title='Destacado: series' url={'/api/tvshows?limitedAge=' + limitedAge} isMovie={false} />
    </div>
  )
}
