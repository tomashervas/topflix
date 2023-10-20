"use client"

import { getRatingColor } from "@/lib/utils"
import { Movie } from "@/models/movie"
import { useCallback, useEffect, useState } from "react"

interface BudgetProps {
  movie: Movie
}
const Budget = ({movie} : BudgetProps) => {

  const [ratingColor, setRatingColor] = useState("")

  useEffect(() => {
    console.log(ratingColor)
    const color = getRatingColor(movie?.content_rating!)
    setRatingColor(color)
  }, [movie])

  return (
    <div style={{backgroundColor: ratingColor, borderRadius: "5px"}}>
      <p className="px-2">{movie?.content_rating}</p>
    </div>
  )
}
export default Budget