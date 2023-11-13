import { BsChevronDown } from "react-icons/bs"
import NavbarItem from "./NavbarItem"
import ProfileMenu from "./ProfileMenu"
import SignOutBtn from "./SignOutBtn"
import NavMenu from "./NavMenu"
import Link from "next/link"
import Search from "./Search"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { User } from "@prisma/client"
import prismadb from "@/lib/prismadb";


const Navbar = async () => {
  const session = await getServerSession(authOptions)
  if(!session) {
    return redirect('http://localhost:3000/auth')
  }

  const userComplete: User | null = await prismadb.user.findUnique({
    where: {
      email: session.user!.email!
    }
  })

  return (
    <nav className="w-full top-0 fixed z-20">
         <div className="flex items-center justify-between px-6 py-2 bg-zinc-900 bg-opacity-70">
            <div className="flex items-center">
                <img className="h-8 md:h-10 cursor-pointer"  src="/images/logoTFX.png" alt="logo TFX" />
                <NavMenu />
            </div>
            <div className="flex items-center space-x-4">
              <Search />
              <ProfileMenu user= {userComplete as User}/>
            </div>
         </div>

    </nav>
  )
}
export default Navbar