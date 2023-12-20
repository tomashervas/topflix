"use client"

import { useEffect, useState } from "react"
import CloseBtn from "./CloseBtn"
import { Episode, Movie, TVShow } from "@prisma/client"
import { toast } from "react-toastify"
import { isTokenExpired } from "@/lib/jwt"
import { useRouter } from "next/navigation"

interface PlayerProps {
  media: Movie | Episode
  show?: boolean
  setShow: (v: boolean) => void
  token: string
}


const Player = ({ media, show, setShow, token }: PlayerProps) => {

  const [mounted, setMounted] = useState(false)
  const router = useRouter()


  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMounted(true)
    if(isTokenExpired(token)){
      console.log('token expirado')
      router.refresh()
      toast.warn('Se ha recargado la página. vuelve a reproducir el video', {autoClose: 4000},)
      setMounted(false)
      setShow(false)
    }
  }, [show])


  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      {show &&
        <div className="z-30 h-screen bg-black w-full fixed top-0 left-0 flex justify-center items-center">
          <CloseBtn setAction={() => { setShow(false) }} />
          <video className="mt-12 w-full md:w-2/3 aspect-[16/9] object-cover overflow-hidden" controls autoPlay controlsList="nodownload" src={process.env.NEXT_PUBLIC_VIDEO_BASE_URL + media.videoUrl! + `?token=${token}`} onError={(err) => { 
            console.log('Error: ', err) 
            setShow(false)
            toast.error('Ha ocurrido un error')
          }}></video>
        </div>
      }
    </div>
  )
}
export default Player