'use client'

import { useRouter } from "next/navigation"
import { FaPlus } from "react-icons/fa6"

const NewAvatar = () => {

    const router = useRouter()

  return (
    <div onClick={() => router.push(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/profiles/new`)} className="w-32 h-32 flex flex-col justify-center items-center rounded-lg bg-zinc-800 cursor-pointer">
        <FaPlus size={40} />
        <p>Crea un perfil</p>

    </div>
  )
}
export default NewAvatar