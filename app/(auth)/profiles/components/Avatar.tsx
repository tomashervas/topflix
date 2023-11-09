"use client"

import { useRouter } from "next/navigation"

interface AvatarProps {
  name: string,
  imgUrl: string
}

const Avatar = ({ name, imgUrl }: AvatarProps) => {

  const router = useRouter()

  const saveProfileLocalStorage = () => {
    localStorage.setItem('profile', JSON.stringify({name, imgUrl}))
    router.push('http://localhost:3000/')
  }

  return (
    <div onClick={saveProfileLocalStorage} className="group flex flex-col justify-center items-center cursor-pointer">
                <div className="w-44 h-44 transition rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white">
                    <img src={imgUrl} alt="" />
                </div>
                <p className="text-center transition text-xl xl:text-2xl mt-4 text-zinc-400 group-hover:text-white">{name}</p>
            </div>
  )
}
export default Avatar