'use client'

import useFetch from "@/hooks/useFetch"
import { Movie } from "@/models/movie"
import { useEffect, useState } from "react"
import { GoInfo } from "react-icons/go"


const Billboard = () => {

    const {data}:{data: Movie} = useFetch('/api/random')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)

    }, [])

    if (!mounted) {
        return null
    }
    

  return (
    <div className="relative h-[60vh]  md:h-[56.25vw] overflow-hidden">
        {/* atoplay! */}
        <video className="h-[60vh] md:h-[56.25vw] object-cover brightness-[60%] overflow-hidden"  muted loop poster={data?.thumbnailUrl} src={data?.videoUrl}></video>
        <div className="absolute top-[70%] md:top-[40%] ml-4 md:ml-16">
            <p className="text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl">{data?.title}</p>
            <p className="text-white md:w-[50%] hidden md:block drop-shadow-xl">{data?.description}</p>
            <div className="flex mt-4">
                <button className="flex items-center gap-2 bg-zinc-500 bg-opacity-60 hover:bg-opacity-40 py-2 px-4 font-semibold rounded-md transition"><GoInfo size={20}/>Más información</button>
            </div>
        </div>
    </div>
  )
}
export default Billboard