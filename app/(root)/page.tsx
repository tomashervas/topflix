import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import SignOutBtn from './components/SignOutBtn'
import Navbar from './components/Navbar'
import Billboard from './components/Billboard'
import ScrollList from './components/ScrollList'
import { Movie } from '@/models/movie'
import FavoritesList from './components/FavoritesList'
import Favorites from './components/Favorites'

export default async function Home() {

  const session = await getServerSession(authOptions)

  if(!session) {
    return redirect('http://localhost:3000/auth')
  }

  return (
    <>
      <Billboard />
      <Favorites/>
      <ScrollList title='Destacado: películas' url='/api/movies' isMovie/>
      <ScrollList title='Destacado: series' url='/api/tvshows' isMovie={false}/>

    </>
  )
}
