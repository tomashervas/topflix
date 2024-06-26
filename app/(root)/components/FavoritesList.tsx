"use client"

import useFetch from "@/hooks/useFetch"
import Card from "./Card"
import { Movie, TVShow } from "@prisma/client"
import { useEffect, useState } from "react"

interface MovieListProps {
    isMovie: boolean
}

const FavoritesList = ({  isMovie}: MovieListProps) => {

    const [mounted, setMounted] = useState(false)

    if (!mounted) {
        setMounted(true)
    }

    // //get profile from local storage
    // if(typeof localStorage === 'undefined') {
    //     return null
    // }
    const profile = JSON.parse(localStorage.getItem('profile')!)
    //console.log(profile)


    const {data}: {data: Movie[] | TVShow[]} = useFetch(isMovie ? `/api/favorites?profile=${profile.name}` : `/api/favoritestv?profile=${profile.name}`)
    
    if (!data || !data.length) {
        return (
            <div>
                <p className="p-4">No hay favoritos</p>
            </div>
        )
    }

    
  return (
    <div className="space-y-4 md:p-8 p-4 overflow-hidden">
        <div className="flex overflow-auto space-x-3 md:space-x-5 md:scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent md:pb-4">
            {data.map((item) => (
                <Card key={item.id} item={item} isMovie={isMovie}/>
            ))}
        </div>
    </div>
  )
}
export default FavoritesList