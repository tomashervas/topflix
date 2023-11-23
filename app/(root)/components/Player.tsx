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
    // @ts-ignore
    const cjs = new Castjs();

    const [mounted, setMounted] = useState(false)
    const [showCast, setShowCast] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [castState, setCastState] = useState('Desconectado')
    
    const videoRef = useRef<HTMLVideoElement>(null)
    
    
    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {

      cjs.on(('event'), (e:any) => {
        console.log(e)
        if(e === 'connect') {
          console.log('connect')
          setShowCast(true)
          cjs.paused ? setIsPlaying(false) : setIsPlaying(true)
        }
  
        if(e === 'playing') {
          console.log('playing')
          setCastState('Reproduciendo')
          setIsPlaying(true)
        }
  
        if(e === 'pause') {
          console.log('pause')
          setCastState('Pausado')
          setIsPlaying(false)
        }
  
        if(e === 'disconnect') {
          console.log('disconnect')
          setCastState('Desconectado')
          setIsPlaying(false)
          setShowCast(false)
        }
      })
      
    },[])

    if (!mounted) {
        return null
    }

  return (
    <div className="relative">
        { show &&
            <div className="z-30 h-screen bg-black w-full fixed top-0 left-0 flex justify-center items-center">
                <CloseBtn setAction={() => {setShow(false)}} />
                { cjs.available && <button className="p-4 absolute top-0 left-0" onClick={() => {
                  videoRef.current!.pause()
                    cjs.cast("http://192.168.0.19:3435/movies/Goonies.mp4");
                }}><FaChromecast size={20} className={showCast ? 'text-blue-400' : 'text-white'} /></button>}
                <video ref={videoRef} className="mt-12 w-full md:w-2/3 aspect-[16/9] object-cover overflow-hidden"controls autoPlay controlsList="nodownload" src={process.env.NEXT_PUBLIC_VIDEO_BASE_URL + media.videoUrl!}></video>
                {showCast && 
                  <div className="p-4 absolute w-[70vw] bg-zinc-900 top-20 right-0">
                    <div className="flex items-center space-x-4 py-4">
                      <button onClick={() =>{
                        isPlaying ? cjs.pause() : cjs.play()
                        isPlaying ? setIsPlaying(false) : setIsPlaying(true)
                      }} >{isPlaying ? <FaPause size={20} className="text-white"/> : <FaPlay size={20} className="text-white"/>}</button>
                      <button onClick={() => {
                        cjs.disconnect()
                        setIsPlaying(false)
                        setTimeout(() => {
                          setShowCast(false)
                        }, 2000)
                      }}><FaPowerOff size={20} className="text-white"/></button>
                    </div>
                    <p>{cjs.device + ': ' + castState }</p>
                  </div>
                }
            </div>
        }
    </div>
  )
}
export default Player

// A more complex example
            // cjs.cast('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', {
            //     poster     : 'https://castjs.io/media/poster.jpg',
            //     title      : 'Sintel',
            //     description: 'Third Open Movie by Blender Foundation',
            //     subtitles: [{
            //         active: true,
            //         label : 'English',
            //         src   : 'https://castjs.io/media/english.vtt'
            //     }, {
            //         label : 'Spanish',
            //         src   : 'https://castjs.io/media/spanish.vtt'
            //     }],
            // })