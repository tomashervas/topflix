"use client"
import { useDebounce } from '@/hooks/useDebounce'
import useFetch from '@/hooks/useFetch'
import { Movie, TVShow } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { IoSearch } from 'react-icons/io5'


const Search = () => {

  const [query, setQuery] = useState(null)
  const debouncedQuery = useDebounce(query, 500)
  const [showInput, setShowInput] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null);

  const { data }: { data: {tv : TVShow[], movies: Movie[]} } = useFetch('/api/search?query=' + debouncedQuery)
  
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);
  
  const handleSearch = (e: any) => {
    if(e.target.value.length > 2) setQuery(e.target.value)
    else setQuery(null)
  }

  const goDetails = (url: string) => {
    router.push(url)
    setQuery(null)
    setShowInput(false)
  }

    

  return (
      <div className='flex justify-end items-center relative'>
          {showInput && <input ref={inputRef} type="text" placeholder='Buscar...' className='w-28 md:w-48 h-8 border-0 focus:ring-0  text-zinc-400 bg-transparent' onChange={handleSearch}/>}
          <button onClick={()=>{
            setShowInput(!showInput)
            setQuery(null)
            }}><IoSearch size={20}/></button>
          {(data?.tv.length > 0 || data?.movies.length > 0) && <div className='absolute space-y-2 -right-16 top-12 w-[85vw] max-h-[50vh] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] bg-zinc-500/70 p-4 rounded-md overflow-auto'>
              <div className='space-y-2'>
                {data?.tv.map((item) => (
                    <div key={item.id} className='flex gap-4 cursor-pointer hover:bg-zinc-600' onClick={() => goDetails(`/tvshows/${item.id}`)}>
                      <div className="w-24 h-16 rounded-md overflow-hidden">
                          <img className={`w-full h-full object-cover` } src={item?.backdropUrl?.replace('/original/', '/w300/')} alt="" />
                      </div>
                      <p>{item.name}</p>

                    </div>
                ))}
              </div>
              <div className='space-y-2'>
                {data?.movies.map((item) => (
                    <div key={item.id} className='flex gap-4 cursor-pointer hover:bg-zinc-600' onClick={() => goDetails(`/movies/${item.id}`)}>
                      <div className="w-24 h-16 rounded-md overflow-hidden">
                          <img className={`w-full h-full object-cover` } src={item?.backdropUrl?.replace('/original/', '/w300/')} alt="" />
                      </div>
                      <p>{item.title}</p>

                    </div>
                ))}
              </div>
          </div>}
      </div>
  )
}
export default Search