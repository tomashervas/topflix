"use client"

import { useEffect, useState } from "react";
import SignOutBtn from "./SignOutBtn"
import { BsChevronDown } from "react-icons/bs";
import { type } from "os";
import { User } from "@prisma/client";
import { profile } from "console";

type ProfileMenuProps = {
    user: User
}
const ProfileMenu = ({user}: ProfileMenuProps) => {

    const [profile, setProfile] = useState<{name: string, imgUrl: string} |null>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setProfile(JSON.parse(localStorage.getItem('profile')!))
    },[])


  return (
        <div  className="relative">
            <div onClick={() => setVisible(!visible)} className="flex items-center space-x-2 cursor-pointer">
                <img className="h-6 md:h-8 rounded-md" src={profile?.imgUrl} alt="" />
                <BsChevronDown size={16} className={`transition ${visible ? 'rotate-180' : ''}`} />
            </div>

            {visible && 
                <div className=" absolute top-14 right-0 space-y-2">
                {user.profiles.map((prof) => (
                    <div>
                        <img className="h-8 md:h-12 rounded-md" src={prof.image} alt="" />
                    </div>
                ))}
                <SignOutBtn />
            </div>}
        </div>
  )
}
export default ProfileMenu