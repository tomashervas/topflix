"use client"
import { FaSortAlphaDown } from 'react-icons/fa'

const SortIconButton = () => {
  return (
    <>
        <button onClick={()=>console.log('sort')} className="text-zinc-400 border border-zinc-400 p-2 mr-4 rounded-xl hover:text-zinc-100">
          <FaSortAlphaDown size={20}/>
        </button>
    </>
  )
}
export default SortIconButton