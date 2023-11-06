"use client"

import useFetch from "@/hooks/useFetch"
import Card from "./Card"
import { Movie, TVShow } from "@prisma/client"

interface MovieListProps {
    isMovie: boolean
}

const FavoritesList = ({  isMovie}: MovieListProps) => {


    const {data}: {data: Movie[] | TVShow[]} = useFetch(isMovie ? '/api/favorites' : '/api/favoritestv')
    
    if (!data || !data.length) {
        return null
    }

    
  return (
    <div className="space-y-4 md:p-8 p-4">
        <div className="flex flex-nowrap overflow-auto space-x-3 md:space-x-5 md:scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent md:pb-4">
            {data.map((item) => (
                <Card key={item.id} item={item} isMovie={isMovie}/>
            ))}
        </div>
    </div>
  )
}
export default FavoritesList