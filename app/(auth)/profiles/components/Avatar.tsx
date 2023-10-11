"use client"

import { useRouter } from "next/navigation"

interface AvatarProps {
  name: string
}

const Avatar = ({ name }: AvatarProps) => {

  const router = useRouter()

  return (
    <div onClick={() => router.push('http://192.168.0.19:3000/')} className="group flex flex-col justify-center items-center cursor-pointer">
                <div className="w-44 h-44 transition rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white">
                    <img src="/images/man.jpg" alt="" />
                </div>
                <p className="text-center transition text-xl xl:text-2xl mt-4 text-zinc-400 group-hover:text-white">{name}</p>
            </div>
  )
}
export default Avatar