"use client"

import { useItemsStore } from "@/hooks/useItemsStore"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavbarItemProps {
    children: React.ReactNode,
    link: string,
    setVisible: (v: boolean) => void
}

const NavbarItem = ({children, link, setVisible}: NavbarItemProps) => {
    const pathname = usePathname()
    const {setShowM, setShowT, setPageM, setPageT, clearMovies, clearTVs, setSort} = useItemsStore((state) => state)

  return (
    <li onClick={()=> {
      screen.width < 768 && setVisible(false)
      setShowM(true)
      setShowT(true)
      setPageM(1)
      setPageT(1)
      clearMovies()
      clearTVs()
      setSort(false)
      }} className="text-slate-100 hover:text-slate-400 font-semibold transition">
        <Link className={`${pathname === link ? 'text-red-500 font-extrabold' : ''}`} href={link}>
            {children}
        </Link>
    </li>
  )
}
export default NavbarItem