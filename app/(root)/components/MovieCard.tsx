import { Movie } from "@/models/movie"

interface MovieListProps {
    movie: Movie
}

const MovieCard = ({movie}: MovieListProps) => {
  return (
    <div className="group bg-zinc-900 relative">
        <img className="aspect-[16/9] object-cover cursor-pointer rounded-md shadow-xl transition group-hover:opacity-70"  src={movie.thumbnailUrl} alt={movie.title} />
        <div className="bg-gradient-to-t from-black via-transparent via-30%  to-transparent  absolute top-0 left-0 w-full h-full"></div>
        <div className="absolute bottom-0 p-1 text-xs sm:text-base ">{movie.title}</div>
    </div>
  )
}
export default MovieCard