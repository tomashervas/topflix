import { BsChevronDown } from "react-icons/bs"
import NavbarItem from "./NavbarItem"
import ProfileMenu from "./ProfileMenu"
import SignOutBtn from "./SignOutBtn"
import NavMenu from "./NavMenu"
import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="w-full top-0 fixed z-20">
         <div className="flex items-center justify-between px-6 py-2 bg-zinc-900 bg-opacity-70">
            <div className="flex items-center">
              <Link href="/" >
                <img className="h-8 md:h-10 cursor-pointer"  src="/images/logoTFX.png" alt="logo TFX" />
              </Link>
              <NavMenu />
            </div>
            <ProfileMenu />
         </div>

    </nav>
  )
}
export default Navbar