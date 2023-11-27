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
    if (media) {
      setMounted(true)

      if (screen.width > 768) {
        setPoster(media?.backdropUrl!)
      } else {
        setPoster(media?.thumbnailUrl)
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
          <div className="w-full h-96 md:h-[56.25vw] overflow-hidden rounded-lg relative">
            <Image fill src={poster} className="object-cover object-top" alt={media.name}/>
          </div>
        </div>{/* } */}
      <div className="absolute top-[17%] md:top-[40%] w-full p-8 md:ml-16">
        <p className="text-2xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl">{('title' in media) ? media?.title : (media as TVShow).nameShow}</p>
        <div className="">
          <p className="line-clamp-3 text-white md:w-[50%] hidden md:[display:-webkit-box] drop-shadow-xl">{media?.overview}</p>

        </div>
        <div >
          <button className="flex items-center gap-2 bg-zinc-500 bg-opacity-60 hover:bg-opacity-40 py-2 px-4 my-3 font-semibold rounded-full md:rounded-md transition" onClick={() => router.push(('title' in media) ? `/movies/${media.id}` : `/tvshows/${media.id}`)}><GoInfo size={20} /><span className="hidden md:block">Más información</span></button>
        </div>
      </div>
    </div>
  )
}
export default Billboard