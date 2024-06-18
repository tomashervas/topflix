"use client"

import { FaCheck, FaCirclePlus } from "react-icons/fa6"

interface BtnFavoriteProps {
    toggleFavourite: () => void
    isFavourite: boolean
}
const BtnFavorite = ({toggleFavourite, isFavourite}: BtnFavoriteProps) => {
  return (
    <button className="absolute bottom-2 right-2 md:bottom-3 md:right-3 text-md md:text-xl" onClick={toggleFavourite}>{isFavourite ? <FaCheck /> : <FaCirclePlus />}</button>
  )
}
export default BtnFavorite