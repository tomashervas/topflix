import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Avatar from "./components/Avatar"

const ProfilesPage = async () => {
    const session = await getServerSession(authOptions)

    if(!session) {
        return redirect('http://192.168.0.19:3000/auth')
    }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl xl:text-4xl">¿Quién está viendo?</h1>
        <div className="flex justify-center items-center gap-4 mt-8">
            <Avatar name={session.user!.name!} />
        </div>
    </div>
  )
}
export default ProfilesPage