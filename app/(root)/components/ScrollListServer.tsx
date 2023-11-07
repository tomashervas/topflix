"use client"

import Card from "./Card"
import { Movie, TVShow } from "@prisma/client"

interface ScrollListProps {
    title: string
    data: Movie[] | TVShow[]
    isMovie: boolean
}

const ScrollListServer = ({title, data, isMovie}: ScrollListProps) => {
    
  return (
    <div className="space-y-4 md:p-8 px-4 pt-4 overflow-hidden ">
        <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
        <div className="flex flex-nowrap overflow-auto space-x-3 md:space-x-5 md:scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent md:pb-4">
            {data.map((item) => (
                <Card key={item.id} item={item} isMovie={isMovie}/>
            ))}
        </div>
    </div>
  )
}
export default ScrollListServer