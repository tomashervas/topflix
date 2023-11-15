"use client"

import { useEffect, useState } from "react"
import FavoritesList from "./FavoritesList"
import useFetch from "@/hooks/useFetch"
import { Movie } from "@prisma/client"
import axios from "axios"

type FavoritesProps = {
  limitedAge: number
}
const Favorites = ({limitedAge}: FavoritesProps) => {

  const [mounted, setMounted] = useState(false)
  const [showMovies, setShowMovies] = useState(true)
  
  const accentColor =  limitedAge < 12 ? 'text-yellow-400 border-2 border-yellow-400' : 'text-red-500 border border-red-500'


  useEffect(() => {
    setMounted(true)

    
    axios.get(`/api/favorites?profile=${typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('profile')!).name}`).then(res => {
      res.data.length === 0 ? setShowMovies(false) : setShowMovies(true)
    })

  }, [mounted])

  if (!mounted) {
    return null
  }

  
  return (
    <div className="mt-6">
      <div className="flex items-center gap-4">
        <h3 className="ml-4 text-xl md:text-2xl font-semibold"> Mi lista: </h3>
        <button className={`${showMovies ? accentColor : '' }  py-1 px-4 rounded-full`} onClick={() => setShowMovies(true)}>Películas</button>
        <button className={`${!showMovies ? accentColor : ''}  py-1 px-4 rounded-full`} onClick={() => setShowMovies(false)}>Series</button>
      </div>
      {showMovies ?
        <FavoritesList isMovie /> :
        <FavoritesList isMovie={false} />
      }
    </div>
  )
}
export default Favorites