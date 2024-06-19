"use client"

import { saveProfileLocal } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface AvatarProps {
  name: string,
  imgUrl: string,
  limitedAge: number | null
}

const Avatar = ({ name, imgUrl, limitedAge }: AvatarProps) => {

  const router = useRouter()



  return (
    <div onClick={()=>saveProfileLocal(router, name, imgUrl, limitedAge!)} className="group flex flex-col justify-center items-center cursor-pointer">
                <div className="w-32 h-32 transition rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white">
                    <img className="w-full h-full object-cover" src={imgUrl} alt="" />
                </div>
                <p className="text-center transition text-xl xl:text-2xl mt-4 text-zinc-400 group-hover:text-white">{name}</p>
            </div>
  )
}
export default Avatar