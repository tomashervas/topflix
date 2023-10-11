"use client"

import { signOut } from "next-auth/react"
import { TbLogout } from "react-icons/tb";

const SignOutBtn = () => {
  return (
    <div >
      <button className="flex items-center py-2 rounded-lg" onClick={() => signOut()}>
        <TbLogout size={20} className="text-white mr-2"/> Salir
      </button>
    </div>
  )
}
export default SignOutBtn