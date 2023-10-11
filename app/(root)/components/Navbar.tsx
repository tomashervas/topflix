import { BsChevronDown } from "react-icons/bs"
import NavbarItem from "./NavbarItem"
import ProfileMenu from "./ProfileMenu"
import SignOutBtn from "./SignOutBtn"
import NavMenu from "./NavMenu"

const Navbar = () => {
  return (
    <nav className="w-full fixed z-20">
         <div className="flex items-center justify-between px-6 py-2 bg-zinc-900 bg-opacity-90">
            <div className="flex items-center">
              <img className="h-8 md:h-10"  src="/images/logoTFX.png" alt="logo TFX" />
              <NavMenu />
            </div>
            <ProfileMenu />
         </div>

    </nav>
  )
}
export default Navbar