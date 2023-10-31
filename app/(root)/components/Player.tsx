"use client"

import { Movie } from "@/models/movie"
import { useEffect, useState } from "react"
import ButtonSolid from "./ButtonSolid"
import CloseBtn from "./CloseBtn"
import { Episode, TVShow } from "@prisma/client"

interface PlayerProps {
    media: Movie | Episode
    show?: boolean
    setShow: (v: boolean) => void
}


const Player = ({media, show, setShow}: PlayerProps) => {

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)

    }, [])

    if (!mounted) {
        return null
    }

  return (
    <div className="relative">
        { show &&
            <div className="z-30 h-screen bg-black w-full fixed top-0 left-0 flex justify-center items-center">
                <CloseBtn setAction={() => {setShow(false)}} />
                <video className="mt-12 w-full md:w-2/3 aspect-[16/9] object-cover overflow-hidden"controls controlsList="nodownload" src={media.videoUrl!}></video>
            </div>
        }
        </div>
  )
}
export default Player