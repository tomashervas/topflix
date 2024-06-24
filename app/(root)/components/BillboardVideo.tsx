"use client"

import { Movie, TVShow } from "@prisma/client"
import Image from "next/image"
import { useEffect, useState } from "react"

interface BillboardVideoProps {
    media: Movie | TVShow
    colors: string[]
    limitedAge: number
}


const BillboardVideo = ({media, colors, limitedAge }: BillboardVideoProps) => {

    const colorA = colors[0]
    const colorB = colors[1]
    const gradientStyle = {
      backgroundImage: `linear-gradient(${colorA}, ${colorB}, ${limitedAge < 12 ? '#1d4ed8' : '#18181b'})`,
    };

    const [mounted, setMounted] = useState(false)
    const [poster, setPoster] = useState('')

    useEffect(() => {
      if (media && media.backdropUrl) {
        setMounted(true)
        if (screen.width > 1500 ) {
          setPoster(media.backdropUrl)
        }
        else if (screen.width > 768) {
          setPoster(media.backdropUrl.replace('original', 'w1280'))
        } else {
          setPoster(media.thumbnailUrl.replace('original', 'w500'))
        }
      }
    }, [media])

    if (!mounted) {
        return null
    }

  return (
    <div>
        {media?.trailer ?
        <iframe className="mt-12 mb-4 w-full aspect-[16/9] h-[40vh] md:h-[56.25vw] object-cover overflow-hidden" src={media?.trailer}></iframe> :
        <div className={'p-6 mt-12 md:p-0'} style={gradientStyle}>
          <div className="w-full h-[55vh] md:h-[56.25vw] overflow-hidden rounded-lg relative">
            <img src={poster} alt={media.name} className="w-full object-cover" />
          </div>
        </div>}
    </div>
  )
}
export default BillboardVideo