"use client"

import { Movie } from "@/models/movie"
import { useRouter } from "next/navigation"
import { TbMovie } from "react-icons/tb"

interface ButtonSolidProps {
    setAction: ()=> void
}

const ButtonSolid = ({setAction}: ButtonSolidProps) => {

    const router = useRouter()
  return (
    <button onClick={setAction} className="flex items-center justify-center md:px-32 py-2 rounded-lg border border-slate-100 bg-slate-100 text-zinc-900 w-full md:w-fit my-4" ><TbMovie size={20} className="text-zinc-900 mr-2"/>Reproducir</button>
)}
export default ButtonSolid