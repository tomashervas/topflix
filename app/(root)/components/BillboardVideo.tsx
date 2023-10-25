"use client"

import { Movie } from "@/models/movie"
import { useEffect, useState } from "react"

interface BillboardVideoProps {
    movie: Movie
}


const BillboardVideo = ({movie}: BillboardVideoProps) => {

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)

    }, [])

    if (!mounted) {
        return null
    }

  return (
    <div>
        {movie?.trailer ?
        <iframe className="mt-12 w-full aspect-[16/9] h-[40vh] md:h-[56.25vw] object-cover overflow-hidden" src={movie?.trailer}></iframe> :
        <video className="mt-12 w-full aspect-[16/9] h-[60vh] md:h-[56.25vw] object-cover overflow-hidden"  muted autoPlay loop poster={movie?.thumbnailUrl} src={movie?.trailer}></video> }
    </div>
  )
}
export default BillboardVideo