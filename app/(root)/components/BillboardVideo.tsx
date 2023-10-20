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
        <video className="mt-12 w-full aspect-[16/9] md:h-[56.25vw] object-cover overflow-hidden" muted loop controls poster={movie?.backdropUrl} autoPlay src={movie?.videoUrl}></video>
    </div>
  )
}
export default BillboardVideo