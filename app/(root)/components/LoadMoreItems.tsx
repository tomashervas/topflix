"use client"

import { useEffect, useState } from "react";
import { InView, useInView } from "react-intersection-observer";
import { getAllMovies, getAllTVs } from "./actions";
import { Movie, TVShow } from "@prisma/client";
import Loader from "./Loader";
import AllItems from "./AllItems";

interface LoadMoreItemsProps {
  isMovie: boolean,
  limitedAge: number
}

const LoadMoreItems = ({ isMovie, limitedAge }: LoadMoreItemsProps) => {

  const [items, setItems] = useState<Movie[] | TVShow[]>([])
  const [page, setPage] = useState(1)
  const [show, setShow] = useState(true)
  const { ref, inView } = useInView()

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const loadMore = async () => {
    await delay(1000);
    const nextPage = page + 1
    const newItems = isMovie ? await getAllMovies(limitedAge, nextPage) ?? [] : await getAllTVs(limitedAge, nextPage) ?? []
    if (newItems.length === 0) {
      setShow(false)
      return
    }
    setItems((prevItems: any) => [...prevItems, ...newItems])
    setPage(nextPage)
  }

  useEffect(() => {
    if (inView) {
      loadMore();
      console.log('in view')
    }
  }, [inView]);

  return (
    <>
      <AllItems items={items} isMovie={isMovie} />
      {show &&
        <div ref={ref}  >
          <Loader />
        </div>
      }
    </>
  )
}
export default LoadMoreItems