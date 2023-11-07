"use client"

import { Movie } from "@/models/movie"
import { TVShow } from "@prisma/client"
import { useEffect, useState } from "react"

interface BillboardVideoProps {
    media: Movie | TVShow
    colors: string[]
}


const BillboardVideo = ({media, colors}: BillboardVideoProps) => {

    const colorA = colors[0]
    const colorB = colors[1]
    const gradientStyle = {
      backgroundImage: `linear-gradient(${colorA}, ${colorB}, #18181b)`,
    };

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
        <div className={'p-6 md:p-0'} style={gradientStyle}>
          <div className="w-full aspect-[16/9] h-[50vh] md:h-[56.25vw] object-cover overflow-hidden rounded-lg">
            <img src={poster} alt=""/>
          </div>
        </div>}
    </div>
  )
}
export default BillboardVideo