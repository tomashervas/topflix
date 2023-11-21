"use client"

import { useEffect, useState } from "react";
import { InView, useInView } from "react-intersection-observer";
import { getAllMovies, getAllTVs } from "./actions";
import { Movie, TVShow } from "@prisma/client";
import Loader from "./Loader";
import AllItems from "./AllItems";
import { useItemsStore } from "@/hooks/useItemsStore";

interface LoadMoreItemsProps {
  isMovie: boolean,
  limitedAge: number
}

const LoadMoreItems = ({ isMovie, limitedAge}: LoadMoreItemsProps) => {

  // const [items, setItems] = useState<Movie[] | TVShow[]>([])
  // const [page, setPage] = useState(1)
  // const [show, setShow] = useState(true)
  const {TVs, setTVs, movies, setMovies, pageM, setPageM, pageT, setPageT,showM, setShowM, showT, setShowT, sort} = useItemsStore((state) => state)

  const { ref, inView } = useInView()

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const loadMore = async () => {
    // await delay(1000);
    // console.log(isMovie ? pageM : pageT)
    const nextPage = isMovie ? pageM + 1 : pageT + 1
    const newItems = isMovie ? await getAllMovies(limitedAge, nextPage, undefined, sort) ?? [] : await getAllTVs(limitedAge, nextPage, undefined, sort) ?? []
    if (newItems.length === 0) {
      isMovie ? setShowM(false) : setShowT(false)
      return
    }
    console.log(newItems.map((item) => item.name))
    isMovie ? setMovies(newItems) : setTVs(newItems)
    isMovie ? setPageM(nextPage) : setPageT(nextPage)
  }

  useEffect(() => {
    // console.log('sort',sort)
    // console.log(isMovie ? movies.map((item) => item.name) : TVs.map((item) => item.name))
    if (inView) {
      loadMore();
    }
  }, [inView]);

  return (
    <>
      <AllItems items={isMovie ? movies : TVs} isMovie={isMovie} />
      {((isMovie && showM) || (!isMovie && showT)) &&
        <div ref={ref}  >
          <Loader />
        </div>
      }
    </>
  )
}
export default LoadMoreItems