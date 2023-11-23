import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Avatar from "./components/Avatar"
import { User } from "@prisma/client"
import NewAvatar from "./components/NewAvatar"
import prismadb from "@/lib/prismadb";


const ProfilesPage = async () => {
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
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl xl:text-4xl">¿Quién está viendo?</h1>
        <div className="flex justify-center items-center flex-wrap gap-4 mt-8">
          {userComplete?.profiles && userComplete?.profiles.length > 0 && userComplete?.profiles.map((profile) => (
            <Avatar key={profile.name} name={profile.name} imgUrl={profile.image} limitedAge={profile.limitedAge} />
            ))
          }
          <NewAvatar />
        </div>
    </div>
  )
}
export default ProfilesPage