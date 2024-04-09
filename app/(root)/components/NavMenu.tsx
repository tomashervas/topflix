"use client"

import { BsChevronDown } from "react-icons/bs"
import NavbarItem from "./NavbarItem"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const NavMenu = () => {
    const pathname = usePathname()

    const [visible, setVisible] = useState(false)

    const handleName = (path: string): string => {
        if (path === '/') return 'Home'
        if (path === '/tvshows') return 'Series'
        if (path === '/movies') return 'Películas'
        return 'Categorías'
    }

    useEffect(() => {
        if(window.innerWidth > 800) {   
            setVisible(true)
        }
      }, [])

  return (
    <div className="flex items-center space-x-4 relative">
        {visible && <ul className="flex flex-col text-white bg-zinc-900/80 p-4 md:p-0 lg:bg-transparent lg:flex-row absolute top-8 left-0 lg:space-x-4 lg:static ml-8 transition">
            <NavbarItem setVisible={setVisible} link="/">Home</NavbarItem>
            <NavbarItem setVisible={setVisible} link="/tvshows">Series</NavbarItem>
            <NavbarItem setVisible={setVisible} link="/movies">Películas</NavbarItem>
        </ul>}
        <div className="flex items-center ml-4 space-x-2 lg:hidden cursor-pointer">
            <button  onClick={() => setVisible(!visible)}>{handleName(pathname)}</button>
            <BsChevronDown size={16} className={`transition ${visible ? 'rotate-180' : ''}`}/>
        </div>
    </div>
  )
}
export default NavMenu