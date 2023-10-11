"use client"

import { useState } from "react";
import SignOutBtn from "./SignOutBtn"
import { BsChevronDown } from "react-icons/bs";
const ProfileMenu = () => {

    const [visible, setVisible] = useState(false)
  return (
        <div  className="relative">
            <div onClick={() => setVisible(!visible)} className="flex items-center space-x-2 cursor-pointer">
                <img className="h-6 md:h-8 rounded-md" src="/images/man.jpg" alt="" />
                <BsChevronDown size={16} className={`transition ${visible ? 'rotate-180' : ''}`} />
            </div>

            {visible && 
                <div className=" absolute top-14 right-0 space-y-2">
                    <div>
                        <img className="h-8 md:h-12 rounded-md" src="/images/man.jpg" alt="" />
                    </div>
                <SignOutBtn />
            </div>}
        </div>
  )
}
export default ProfileMenu