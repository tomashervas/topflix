"use client"
import { FaX } from 'react-icons/fa6'

interface CloseBtnProps {
    setAction: () => void
}

const CloseBtn = ({setAction}: CloseBtnProps) => {
  return (
    <div onClick={setAction}>
      <FaX size={20} className="z-40 text-zinc-400 absolute top-4 right-4 cursor-pointer" />
    </div>
  )
}
export default CloseBtn