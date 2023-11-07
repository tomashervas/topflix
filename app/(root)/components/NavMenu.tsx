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
        if (path === '/mylist') return 'Mi lista'
        return 'Categorías'
    }

    useEffect(() => {
        if(screen.width > 768) {
            setVisible(true)
        }
      }, [])

  return (
    <div className="flex items-center space-x-4 relative">
        {visible && <ul className="flex flex-col bg-zinc-900/80 py-6 px-10 md:p-0 md:bg-transparent md:flex-row absolute top-8 left-0 md:static ml-8 gap-4 transition">
            <NavbarItem setVisible={setVisible} link="/">Home</NavbarItem>
            <NavbarItem setVisible={setVisible} link="/tvshows">Series</NavbarItem>
            <NavbarItem setVisible={setVisible} link="/movies">Películas</NavbarItem>
            <NavbarItem setVisible={setVisible} link="/mylist">Mi lista</NavbarItem>
        </ul>}
        <div className="flex items-center ml-4 space-x-2 md:hidden cursor-pointer">
            <button onClick={() => setVisible(!visible)}>{handleName(pathname)}</button>
            <BsChevronDown size={16} className={`transition ${visible ? 'rotate-180' : ''}`}/>
        </div>
    </div>
  )
}
export default NavMenu