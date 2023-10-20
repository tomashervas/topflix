"use client"

import useFetch from "@/hooks/useFetch"
import { Movie } from "@/models/movie"
import MovieCard from "./MovieCard"

interface MovieListProps {
    title: string
}

const MovieList = ({ title}: MovieListProps) => {
    const {data}: {data: Movie[]} = useFetch('/api/movies')
    
    if (!data || !data.length) {
        return null
    }

  
    
  return (
    <div className="space-y-4 md:p-8 p-4 overflow-hidden ">
        <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
        <div className="flex flex-nowrap overflow-auto space-x-3 md:space-x-5 md:scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent md:pb-4">
            {data.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
            ))}
        </div>
    </div>
  )
}
export default MovieList