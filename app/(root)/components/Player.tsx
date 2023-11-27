"use client"

import { useEffect, useRef, useState } from "react"
import ButtonSolid from "./ButtonSolid"
import CloseBtn from "./CloseBtn"
import { Episode, Movie, TVShow } from "@prisma/client"
import { FaChromecast, FaPlay, FaPause, FaPowerOff } from "react-icons/fa6"




interface PlayerProps {
    media: Movie | Episode
    show?: boolean
    setShow: (v: boolean) => void
}


const Player = ({media, show, setShow}: PlayerProps) => {

    const [mounted, setMounted] = useState(false)
    
    const videoRef = useRef<HTMLVideoElement>(null)
    
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
                <video ref={videoRef} className="mt-12 w-full md:w-2/3 aspect-[16/9] object-cover overflow-hidden"controls autoPlay controlsList="nodownload" src={process.env.NEXT_PUBLIC_VIDEO_BASE_URL + media.videoUrl!}></video>
            </div>
        }
    </div>
  )
}
export default Player