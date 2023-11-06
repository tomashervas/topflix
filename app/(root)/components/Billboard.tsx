'use client'

import useFetch from "@/hooks/useFetch"
import { Movie } from "@/models/movie"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { GoInfo } from "react-icons/go"


const Billboard =  () => {

    const {data}:{data: Movie} = useFetch('/api/random')
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

    if (!mounted) {
        return null
    }
    

  return (
    <div className="relative w-full  md:h-[56.25vw] overflow-hidden mt-12 flex justify-center">
        {/* atoplay! */}
        {data?.trailer ?
        <iframe className="w-auto md:w-full h-[40vh] aspect-[3/2]  md:h-[56.25vw] object-cover bg-center brightness-[60%] overflow-hidden" src={data?.trailer}></iframe> :
        <div className={'p-6 md:p-0'}>
          <div className="mt-12 w-full aspect-[16/9] h-[50vh] md:h-[56.25vw] object-cover overflow-hidden">
            <img src={poster} alt="" />
          </div>
        </div> }
        <div className="absolute top-[15%] md:top-[40%] w-full p-4 md:ml-16">
            <p className="text-2xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl">{data?.title}</p>
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