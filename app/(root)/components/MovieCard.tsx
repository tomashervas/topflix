import useFetch from "@/hooks/useFetch"
import { Movie } from "@/models/movie"
import axios from "axios"
import { useEffect, useState } from "react"
import { FaCirclePlus, FaCheck } from 'react-icons/fa6'
interface MovieListProps {
    movie: Movie
}

const MovieCard = ({movie}: MovieListProps) => {

  const {data: favorites, mutate}: {data: Movie[], mutate: Function} = useFetch('/api/favorites')
  const [isFavourite, setIsFavourite] = useState(false)
  
  useEffect(() => {
    if (!favorites) return setIsFavourite(false)
    if(favorites.length === 0){
      setIsFavourite(false)
    } else{
      setIsFavourite(favorites.some(favorite => favorite.id === movie.id))
    }
  },[favorites])



  const toggleFavourite = async () => {
    if(isFavourite){
      console.log('ya no es favorito')
      setIsFavourite(false)
      const res = await axios.delete(`/api/favorites/${movie.id}`)
      console.log(res.data)

    }
    else {
      console.log('es favorito')
      setIsFavourite(true)
      const res = await axios.post(`/api/favorites/${movie.id}`)
      console.log(res.data)
    }
    mutate()
  }


  return (
    <div className="group bg-zinc-900 relative">
        <img className="aspect-[16/9] object-cover cursor-pointer rounded-md shadow-xl transition group-hover:opacity-70"  src={movie.thumbnailUrl} alt={movie.title} />
        <div className="bg-gradient-to-t from-black via-transparent via-30%  to-transparent  absolute top-0 left-0 w-full h-full"></div>
        <div className="absolute bottom-0 p-1 text-xs sm:text-base ">{movie.title}</div>
        <button className="absolute bottom-2 right-2 md:bottom-3 md:right-3 text-md md:text-xl" onClick={toggleFavourite}>{isFavourite ? <FaCheck /> : <FaCirclePlus />}</button>
    </div>
  )
}
export default MovieCard