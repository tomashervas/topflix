"use client"

import { useEffect, useState } from "react";
import SignOutBtn from "./SignOutBtn"
import { BsChevronDown } from "react-icons/bs";
import { type } from "os";
import { User } from "@prisma/client";
import { profile } from "console";
import { useRouter } from "next/navigation";
import { saveProfileLocal } from "@/lib/utils";
import { useItemsStore } from "@/hooks/useItemsStore";

type ProfileMenuProps = {
    user: User
}
const ProfileMenu = ({user}: ProfileMenuProps) => {

    const [profile, setProfile] = useState<{name: string, imgUrl: string} |null>(null)
    const [visible, setVisible] = useState(false)
    const {clearMovies, clearTVs, setPageM, setPageT, setShowM, setShowT, setSort} = useItemsStore( (state) => state)
    const router = useRouter()

    useEffect(() => {
        setProfile(JSON.parse(localStorage.getItem('profile')!))
    },[user])


  return (
        <div  className="relative">
            <div onClick={() => setVisible(!visible)} className="flex items-center space-x-2 cursor-pointer">
                <img className="h-6 w-6 object-cover overflow-hidden md:h-8 rounded-md" src={profile?.imgUrl} alt="" />
                <BsChevronDown size={16} className={`transition ${visible ? 'rotate-180' : ''}`} />
            </div>

            {visible && 
                <div className=" absolute top-14 right-0 space-y-2">
                {user.profiles.map((prof) => (
                    <div key={prof.name} onClick={()=>{
                        setVisible(false)
                        saveProfileLocal( router, prof.name, prof.image, prof.limitedAge!)
                        router.refresh()
                        setPageM(1)
                        setPageT(1)
                        clearMovies()
                        clearTVs()
                        setSort(false)
                        }}>
                        <img className="h-12 w-12 object-cover overflow-hidden md:h-16 rounded-md" src={prof.image} alt="" />
                    </div>
                ))}
                <SignOutBtn />
            </div>}
        </div>
  )
}
export default ProfileMenu