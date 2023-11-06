'use client'

import useFetch from "@/hooks/useFetch"
import { Movie } from "@/models/movie"
import { TVShow } from "@prisma/client"
import { useRouter } from "next/navigation"
import { title } from "process"
import { useEffect, useState } from "react"
import { GoInfo } from "react-icons/go"


const Billboard = () => {

    const {data, isLoading}:{data: Movie | TVShow, isLoading: boolean} = useFetch('/api/random')
    const [mounted, setMounted] = useState(false)
    const [poster, setPoster] = useState('')
    const router = useRouter()

    useEffect(() => {
      setMounted(true)
      if(screen.width > 768) {
        setPoster(data?.backdropUrl!)
    } else {
        setPoster(data?.thumbnailUrl)
    }

    }, [data])

    if (!mounted || isLoading) {
        return null
    }
    

  return (
    <div className="relative">
        {/* atoplay! */}
        {data?.trailer ?
        <iframe className="mt-12 w-full aspect-[16/9] h-[40vh] md:h-[56.25vw] object-cover overflow-hidden brightness-[60%]" src={data?.trailer}></iframe> :
        <div className={'p-6 md:p-0'}>
          <div className="mt-12 w-full aspect-[16/9] h-[50vh] md:h-[56.25vw] object-cover overflow-hidden">
            <img src={poster} alt="" />
          </div>
        </div> }
        <div className="absolute top-[17%] md:top-[40%] w-full p-8 md:ml-16">
            <p className="text-2xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl">{('title' in data) ? data?.title : (data as TVShow).nameShow}</p>
            <div className="">
              <p className="line-clamp-3 text-white md:w-[50%] hidden md:[display:-webkit-box] drop-shadow-xl">{data?.overview}</p>

            </div>
            <div >
                <button className="flex items-center gap-2 bg-zinc-500 bg-opacity-60 hover:bg-opacity-40 py-2 px-4 my-3 font-semibold rounded-full md:rounded-md transition" onClick={() => router.push(`/movies/${data?.id}`)}><GoInfo size={20}/><span className="hidden md:block">Más información</span></button>
            </div>
        </div>
    </div>
  )
}
export default Billboard