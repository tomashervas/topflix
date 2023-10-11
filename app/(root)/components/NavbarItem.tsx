"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavbarItemProps {
    children: React.ReactNode,
    link: string,
    setVisible: (v: boolean) => void
}

const NavbarItem = ({children, link, setVisible}: NavbarItemProps) => {
    const pathname = usePathname()

  return (
    <li onClick={()=> screen.width < 768 && setVisible(false)} className="text-slate-100 hover:text-slate-400 font-semibold transition">
        <Link className={`${pathname === link ? 'text-red-600' : ''}`} href={link}>
            {children}
        </Link>
    </li>
  )
}
export default NavbarItem