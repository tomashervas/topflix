"use client"

import { useRouter } from "next/navigation"

interface AvatarProps {
  name: string,
  imgUrl: string,
  limitedAge: number | null
}

const Avatar = ({ name, imgUrl, limitedAge }: AvatarProps) => {

  const router = useRouter()

  const saveProfileLocalStorage = () => {
    console.log('edad: ' + limitedAge)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 90);
    localStorage.setItem('profile', JSON.stringify({name, imgUrl, limitedAge}))
    document.cookie = `limitedAge=${limitedAge}; path=/; expires=${expirationDate.toUTCString()}`
    router.push(process.env.NEXT_PUBLIC_DOMAIN_URL + '/')
  }

  return (
    <div onClick={saveProfileLocalStorage} className="group flex flex-col justify-center items-center cursor-pointer">
                <div className="w-32 h-32 transition rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white">
                    <img src={imgUrl} alt="" />
                </div>
                <p className="text-center transition text-xl xl:text-2xl mt-4 text-zinc-400 group-hover:text-white">{name}</p>
            </div>
  )
}
export default Avatar