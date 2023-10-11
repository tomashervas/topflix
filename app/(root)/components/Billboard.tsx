"use client"

import useBillboard from "@/hooks/useBillboard"
import { Movie } from "@/models/movie"
import { GoInfo } from "react-icons/go"


const Billboard = () => {
    const {data}:{data: Movie} = useBillboard()
  return (
    <div className="relative h-[56.25vw]">
        <video className="w-full h-[56.25vw] object-cover brightness-[60%]" autoPlay muted loop poster={data?.thumbnailUrl} src={data?.videoUrl}></video>
        <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
            <p className="text-2xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl">{data?.title}</p>
            <p className="text-white w-[90%] md:w-1/2 drop-shadow-xl">{data?.description}</p>
            <div className="flex mt-4">
                <button className="flex items-center gap-2 bg-white bg-opacity-50 hover:bg-opacity-70 py-2 px-4 font-semibold rounded-md transition"><GoInfo size={20}/>Más información</button>
            </div>
        </div>
    </div>
  )
}
export default Billboard