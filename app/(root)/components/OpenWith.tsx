"use client"

import { useEffect, useState } from "react";
import { IoOpenOutline } from "react-icons/io5"
import { SHARE_ENV } from "worker_threads";

const OpenWith = ({url, token, isTv}: {url: string, token: string, isTv: boolean}) => {

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, []);
  
  if (!mounted) {
    return null
  }
  const shareUrl = async () => {
    try {
      await navigator.share({
        url: process.env.NEXT_PUBLIC_VIDEO_BASE_URL! + url + `?token=${token}`
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  return (

    <div>
      { (navigator.share !== undefined) && 
       (isTv ?
       <button onClick={shareUrl} className='flex justify-center items-center rounded-full self-start bg-zinc-700 text-white h-[24px] w-[42px] ml-4'><IoOpenOutline size={16}/></button> :
       <button onClick={shareUrl} className="h-[42px] px-4 py-3 my-4 bg-red-500 text-white rounded-lg"><IoOpenOutline size={20} /></button>)
      }
    </div>
  )
}
export default OpenWith