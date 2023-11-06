"use client"

import { useState } from "react"
import FavoritesList from "./FavoritesList"

const Favorites = () => {
    const [showMovies, setShowMovies] = useState(true)
  return (
    <div className="mt-6">
        <div className="flex items-center gap-4">
            <h3 className="ml-4 text-xl md:text-2xl font-semibold"> Mi lista: </h3>
            <button className={`${ showMovies ? 'text-red-500 border border-red-500' : ''}  py-1 px-4 rounded-full`} onClick={() => setShowMovies(true)}>Películas</button>  
            <button className={`${ !showMovies ? 'text-red-500 border border-red-500' : ''}  py-1 px-4 rounded-full`} onClick={() => setShowMovies(false)}>Series</button>
        </div>
    { showMovies ?
        <FavoritesList  isMovie/> :
        <FavoritesList  isMovie={false}/>
    }
    </div>
  )
}
export default Favorites