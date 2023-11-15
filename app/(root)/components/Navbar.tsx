import { BsChevronDown } from "react-icons/bs"
import ProfileMenu from "./ProfileMenu"
import NavMenu from "./NavMenu"
import Link from "next/link"
import Search from "./Search"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { User } from "@prisma/client"
import prismadb from "@/lib/prismadb";
import { cookies } from "next/headers"


const Navbar = async () => {

  const session = await getServerSession(authOptions)
  if(!session) {
    return redirect('http://localhost:3000/auth')
  }

  const cookieStore = cookies()
  const limit = cookieStore.get('limitedAge')
  const limitedAge = (!limit || limit.value === 'null') ? 20 : Number(limit.value)

  const userComplete: User | null = await prismadb.user.findUnique({
    where: {
      email: session.user!.email!
    }
  })

  return (
    <nav className="w-full top-0 fixed z-20">
         <div className={`flex items-center justify-between px-6 py-2 ${limitedAge < 12 ? 'bg-blue-950 bg-opacity-80' : 'bg-zinc-950 bg-opacity-70'} `}>
            <div className="flex items-center">
                <Link href="/">
                  <img className="h-8 md:h-10 cursor-pointer"  src="/images/logoTFX.png" alt="logo TFX" />
                </Link>
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