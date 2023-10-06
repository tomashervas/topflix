"use client"
import { useState } from "react"
import Input from "./components/input"

const AuthPage = () => {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")



  return (
    <div className="relative h-screen w-full bg-[url('/images/hero_1.jpg')] bg-cover bg-fixed bg-center">
        <div className="bg-black bg-opacity-50 h-screen w-full">
            <nav className="px-12 py-5">
                <img src="/images/logoTFX.png" alt="" className="h-24" />
            </nav>
            <div className="flex justify-center">
                <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:max-w-md lg:w-2/5 rounded-md w-full">
                    <h2 className="text-2xl mb-8 font-semibold">Sign in</h2>
                    <div className="flex flex-col gap-4">
                        <Input id="username" placeholder="Username" type="text" 
                        onChange={(e) => setUsername(e.target.value)} value={username}/>
                        <Input id="email" placeholder="Email" type="email" 
                        onChange={(e) => setEmail(e.target.value)} value={email}/>
                        <Input id="password" placeholder="Password" type="password" 
                        onChange={(e) => setPassword(e.target.value)} value={password}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default AuthPage