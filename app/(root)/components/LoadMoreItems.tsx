"use client"

import { useEffect, useState } from "react";
import { InView, useInView } from "react-intersection-observer";
import { getAllMovies, getAllTVs } from "./actions";
import { Movie, TVShow } from "@prisma/client";
import Loader from "./Loader";
import AllItems from "./AllItems";

interface LoadMoreItemsProps {
  isMovie: boolean,
  limitedAge: number,
  sort: boolean
}

const LoadMoreItems = ({ isMovie, limitedAge, sort }: LoadMoreItemsProps) => {

  const [items, setItems] = useState<Movie[] | TVShow[]>([])
  const [page, setPage] = useState(1)
  const [show, setShow] = useState(true)
  const { ref, inView } = useInView()

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const loadMore = async () => {
    // await delay(1000);
    const nextPage = page + 1
    console.log('next page: ' + nextPage)
    const newItems = isMovie ? await getAllMovies(limitedAge, nextPage, undefined, sort) ?? [] : await getAllTVs(limitedAge, nextPage, undefined, sort) ?? []
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