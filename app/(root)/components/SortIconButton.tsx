"use client"
import { useItemsStore } from '@/hooks/useItemsStore'
import { useRouter } from 'next/navigation'
import { FaSortAlphaDown } from 'react-icons/fa'

interface SortIconButtonProps {
  isMovie: boolean
}

const SortIconButton = ( { isMovie }: SortIconButtonProps) => {
  const router = useRouter()
  const {setPageM, setPageT, setShowM, setShowT,clearMovies, clearTVs, setSort} = useItemsStore((state) => state)

  const handleClick = async () => {
    setSort(true)
    if (isMovie) {
      router.push('/movies?sort_by_name=true', {scroll: false})
      clearMovies()
      setPageM(1)
      setShowM(true)
    } else {
      router.push('/tvshows?sort_by_name=true', {scroll: false})
      clearTVs()
      setPageT(1)
      setShowT(true)
    }

  }

  return (
    <>
        <button onClick={handleClick} className="text-zinc-400 p-2 mr-6 rounded-xl border border-zinc-400 hover:text-zinc-100 hover:border-zinc-100">
          <FaSortAlphaDown size={20}/>
        </button>
    </>
  )
}
export default SortIconButton