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

export default async function Home() {

  const session = await getServerSession(authOptions)

  if(!session) {
    return redirect('http://192.168.0.19:3000/auth')
  }

  return (
    <>
      <Billboard />
      <FavoritesList title='Mi lista' />
      <ScrollList title='Destacado: películas' url='/api/movies' isMovie/>
      <ScrollList title='Destacado: series' url='/api/tvshows' isMovie={false}/>

    </>
  )
}
