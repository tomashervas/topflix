import { readdir, stat } from "fs/promises"
import path from "path"
import FormClient from "../components/FormClient"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

const NewProfilePage = async () => {

    const session = await getServerSession(authOptions)

    if(!session) {
        return redirect('http://localhost:3000/auth')
    }

    const getImages = async (dir: string) => {
        const avatars: any[] = []
        const getImagesRecursive = async (dir: string, ava: any[], images?: string[]) => {
            const elements = await readdir(dir)
            for (const element of elements) {
                const avatarFamily: any = {}
                const elementPath = path.join(dir, element)
                const imgPath = elementPath.split('public')[1]
                const stats = await stat(elementPath)

                if (images) images.push(imgPath)

                if (stats.isDirectory()) {
                    //console.log(element)
                    avatarFamily.name = element
                    avatarFamily.images = []
                    ava.push(avatarFamily)
                    await getImagesRecursive(elementPath, ava, avatarFamily.images)
                    continue
                }
                //console.log(elementPath)
            }
        }
        await getImagesRecursive(dir, avatars)

        return avatars
    }


    const avatars = await getImages(path.join(process.cwd(), '/public/images/avatars'))
    // console.log(avatars)
    return (
        <div className="p-4 container m-auto">
            <h2 className="text-2xl p-4">Crear un perfil</h2>
            <FormClient avatars={avatars} mail={session.user?.email} />
        </div>
    )
}
export default NewProfilePage