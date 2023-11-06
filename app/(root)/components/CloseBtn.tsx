"use client"
import { FaX } from 'react-icons/fa6'

interface CloseBtnProps {
    setAction: () => void
}

const CloseBtn = ({setAction}: CloseBtnProps) => {
  return (
    <button onClick={setAction} className='z-40 p-4 text-zinc-400 absolute top-0 right-0 cursor-pointer'>
      <FaX size={20} className="" />
    </button>
  )
}
export default CloseBtn