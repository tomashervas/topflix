"use client"

import { FaCheck, FaCirclePlus, FaStar } from "react-icons/fa6"

interface BtnFavoriteProps {
    toggleFavourite: () => void
    isFavourite: boolean
}
const BtnFavorite = ({toggleFavourite, isFavourite}: BtnFavoriteProps) => {
  return (
    <button className="absolute bottom-2 right-2 md:bottom-3 md:right-3 text-md md:text-xl text-zinc-200" onClick={toggleFavourite}>{isFavourite ? <FaStar /> : <FaCirclePlus />}</button>
  )
}
export default BtnFavorite