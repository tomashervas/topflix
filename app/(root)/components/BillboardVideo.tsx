"use client"

import { Movie } from "@/models/movie"
import { TVShow } from "@prisma/client"
import { useEffect, useState } from "react"

interface BillboardVideoProps {
    media: Movie | TVShow
}


const BillboardVideo = ({media}: BillboardVideoProps) => {


    const [mounted, setMounted] = useState(false)
    const [poster, setPoster] = useState('')

    useEffect(() => {
      setMounted(true)
      if(screen.width > 768) {
        setPoster(media?.backdropUrl!)
    } else {
        setPoster(media?.thumbnailUrl)
    }

    }, [media])

    if (!mounted) {
        return null
    }

  return (
    <div>
        {media?.trailer ?
        <iframe className="mt-12 w-full aspect-[16/9] h-[40vh] md:h-[56.25vw] object-cover overflow-hidden" src={media?.trailer}></iframe> :
        <div className="mt-12 w-full aspect-[16/9] h-[50vh] md:h-[56.25vw] object-cover overflow-hidden">
          <img src={poster} alt="" />
        </div> }
    </div>
  )
}
export default BillboardVideo