'use client'

import useFetch from "@/hooks/useFetch"
import { TVShow, Movie } from "@prisma/client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Vibrant from "node-vibrant"
import { title } from "process"
import { useEffect, useState } from "react"
import { GoInfo } from "react-icons/go"


interface BillboardProps {
  media: Movie | TVShow
  colors: string[]
  limitedAge: number
}

const Billboard = ({ media, colors, limitedAge }: BillboardProps) => {

  const [mounted, setMounted] = useState(false)
  const [poster, setPoster] = useState('')
  const router = useRouter()

  const colorA = colors[0]
  const colorB = colors[1]
  const gradientStyle = {
    backgroundImage: `linear-gradient(${colorA}, ${colorB}, ${limitedAge < 12 ? '#1d4ed8' : '#18181b'})`,
  };

  

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
    <div className="relative">
      {/* atoplay! */}
      {/* {media?.trailer ?
        <iframe className="mt-12 w-full aspect-[16/9] h-[40vh] md:h-[56.25vw] object-cover overflow-hidden brightness-[60%]" src={media?.trailer}></iframe> : */}
        <div className={'p-6 mt-12 md:p-0'} style={gradientStyle}>
          <div onClick={() => router.push(('title' in media) ? `/movies/${media.id}` : `/tvshows/${media.id}`)} className="w-full h-[55vh] md:h-[56.25vw] overflow-hidden rounded-lg relative">
            {/* <Image fill src={poster} className="object-cover" alt={media.name}/> */}
            <img src={poster} alt={media.name} className="w-full object-cover" />
          </div>
        </div>{/* } */}
      <div className="absolute top-[17%] md:top-[40%] p-8 md:ml-16">
        <p className="hidden md:[display:-webkit-box] md:text-5xl lg:text-6xl font-bold drop-shadow-xl">{('title' in media) ? media?.title : (media as TVShow).nameShow}</p>
        <div className="">
          <p className="line-clamp-3 text-white md:w-[50%] hidden md:[display:-webkit-box] drop-shadow-xl">{media?.overview}</p>
        </div>
      </div>  
    </div>
  )
}
export default Billboard