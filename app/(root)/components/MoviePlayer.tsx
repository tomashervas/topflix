"use client"

import { useEffect, useState } from "react"
import ButtonSolid from "./ButtonSolid"
import CloseBtn from "./CloseBtn"
import { Episode, Movie, TVShow } from "@prisma/client"
import Player from "./Player"

interface MoviePlayerProps {
    media: Movie | Episode,
    token: string
}


const MoviePlayer = ({media, token}: MoviePlayerProps) => {

    const [mounted, setMounted] = useState(false)
    const [showPlayer, setShowPlayer] = useState(false)
    
    useEffect(() => {
      setMounted(true)

    }, [])

    if (!mounted) {
        return null
    }

  return (
    <div className="relative">
        <ButtonSolid setAction={() => setShowPlayer(true)}/>
        <Player media={media} show={showPlayer} setShow={setShowPlayer} token={token}/> 
    </div>
  )
}
export default MoviePlayer