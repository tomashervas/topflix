import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import SignOutBtn from './components/SignOutBtn'
import Navbar from './components/Navbar'
import Billboard from './components/Billboard'
import MovieList from './components/MovieList'
import { Movie } from '@/models/movie'

export default async function Home() {

  const session = await getServerSession(authOptions)

  if(!session) {
    return redirect('http://192.168.0.19:3000/auth')
  }

  return (
    <>
      <Billboard />
      <MovieList title='Destacado' />
    </>
  )
}
