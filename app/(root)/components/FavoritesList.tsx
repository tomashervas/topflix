"use client"

import useFetch from "@/hooks/useFetch"
import { Movie } from "@/models/movie"
import MovieCard from "./MovieCard"

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
            ))}
        </div>
    </div>
  )
}
export default FavoritesList