"use client"

import { getRatingColor } from "@/lib/utils"
import { Movie } from "@/models/movie"
import { useCallback, useEffect, useState } from "react"

interface BudgetProps {
  rating: string | null | undefined
}
const Budget = ({rating} : BudgetProps) => {

  const [ratingColor, setRatingColor] = useState("")

  useEffect(() => {
    const color = getRatingColor(rating!)
    setRatingColor(color)
  }, [rating])

  return (
    <div style={{backgroundColor: ratingColor, borderRadius: "5px"}}>
      <p className="px-2">{rating}</p>
    </div>
  )
}
export default Budget