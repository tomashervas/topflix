"use client"

import useFetch from "@/hooks/useFetch"
import { Movie, TVShow } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import BtnFavorite from "./BtnFavorite"
interface CardProps {
  item: TVShow | Movie
  isMovie: boolean
  grid?: boolean
}

const Card = ({ item, isMovie, grid}: CardProps) => {

  const [mounted, setMounted] = useState(false)
  if (!mounted) {
    setMounted(true)
  }

  const profile = JSON.parse(localStorage.getItem('profile')!)

  const { data: favorites, mutate }: { data: Movie[] | TVShow[], mutate: Function } = useFetch(isMovie ? `/api/favorites?profile=${profile.name}` : `/api/favoritestv?profile=${profile.name}`)
  const [isFavourite, setIsFavourite] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!favorites) return setIsFavourite(false)
    if (favorites.length === 0) {
      setIsFavourite(false)
    } else {
      setIsFavourite(favorites.some(favorite => favorite.id === item.id))
    }
  }, [favorites, item.id])



  const toggleFavourite = async () => {
    if (isFavourite) {
      toast.success('Eliminado de favoritos', {autoClose: 2500,})
      setIsFavourite(false)
      const res = await axios.delete(isMovie ? `/api/favorites/${item.id}?profile=${profile.name}` : `/api/favoritestv/${item.id}?profile=${profile.name}`)

    }
    else {
      toast.success('Añadido a favoritos', {autoClose: 2500,})
      setIsFavourite(true)
      const res = await axios.post(isMovie ? `/api/favorites/${item.id}?profile=${profile.name}` : `/api/favoritestv/${item.id}?profile=${profile.name}`)
    }
    mutate()
  }

  return (
    <div className={`group rounded-md  bg-zinc-900 relative`}>
      <img className="h-44 md:h-56 w-28 md:w-36 object-cover cursor-pointer rounded-md shadow-xl transition group-hover:opacity-70" src={item.thumbnailUrl?.replace('original', 'w342')} alt="" />
      <div onClick={() => router.push(`${isMovie ? '/movies' : '/tvshows'}/${item.id!}`)} className="bg-gradient-to-t from-black via-transparent via-30%  to-transparent  absolute top-0 left-0 cursor-pointer h-full w-full"></div>
      <div className="absolute bottom-0 p-1 text-xs sm:text-base ">{isMovie ? (item as Movie).title : (item as TVShow).nameShow}</div>
      <BtnFavorite toggleFavourite={toggleFavourite} isFavourite={isFavourite} />
    </div>
  )
}
export default Card