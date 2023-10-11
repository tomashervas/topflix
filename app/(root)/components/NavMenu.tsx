"use client"

import { BsChevronDown } from "react-icons/bs"
import NavbarItem from "./NavbarItem"
import { useEffect, useState } from "react"

const NavMenu = () => {

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if(screen.width > 768) {
            setVisible(true)
        }
      }, [])

  return (
    <div className="flex items-center space-x-4 relative">
        {visible && <ul className="flex flex-col md:flex-row absolute top-14 left-0 md:static ml-8 gap-4 transition">
            <NavbarItem setVisible={setVisible} link="/">Home</NavbarItem>
            <NavbarItem setVisible={setVisible} link="/tvs">Series</NavbarItem>
            <NavbarItem setVisible={setVisible} link="/films">Películas</NavbarItem>
            <NavbarItem setVisible={setVisible} link="/mylist">Mi lista</NavbarItem>
        </ul>}
        <div onClick={() => setVisible(!visible)} className="flex items-center ml-4 space-x-2 md:hidden cursor-pointer">
            <button>Navegar</button>
            <BsChevronDown size={16} className={`transition ${visible ? 'rotate-180' : ''}`}/>
        </div>
    </div>
  )
}
export default NavMenu