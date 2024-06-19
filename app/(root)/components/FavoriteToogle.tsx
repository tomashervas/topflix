"use client"

import { useEffect, useState } from "react"
import BtnFavorite from "./BtnFavorite"
import useFetch from "@/hooks/useFetch"
import { Movie, TVShow } from "@prisma/client"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import axios from "axios"

interface FavoriteToogleProps {
    item: TVShow | Movie
    isMovie: boolean
  }
const FavoriteToogle = ({ item, isMovie }: FavoriteToogleProps) => {
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
    <div className="relative bottom-[6px]">
        <BtnFavorite toggleFavourite={toggleFavourite} isFavourite={isFavourite} />
    </div>
  )
}
export default FavoriteToogle