"use client"

import useFetch from "@/hooks/useFetch"
import Card from "./Card"
import { Movie } from "@prisma/client"

interface MovieListProps {
    title: string
}

const FavoritesList = ({ title}: MovieListProps) => {
    const {data}: {data: Movie[]} = useFetch('/api/favorites')
    
    if (!data || !data.length) {
        return null
    }

    
  return (
    <div className="space-y-4 md:p-8 p-4">
        <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
        <div className="flex flex-nowrap overflow-auto space-x-3 md:space-x-5 md:scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent md:pb-4">
            {data.map((movie) => (
                <Card key={movie.id} item={movie} isMovie/>
            ))}
        </div>
    </div>
  )
}
export default FavoritesList