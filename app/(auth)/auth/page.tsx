"use client"
import { useCallback, useState } from "react"
import Input from "./components/input"
import axios from "axios"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";

const AuthPage = () => {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [variant, setVariant] = useState("login")

    const router = useRouter()

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === "login" ? "signup" : "login")
    },[])

    const login = async () =>{
        try {
            await signIn('credentials', {
                email,
                password,
                redirect: true,
                callbackUrl: '/'
            })
            //router.push('/')

        } catch (error) {
            console.log(error)
        }
    }

    const register = async ()=>{
        console.log(email, username, password)
        try {
            await axios.post('/api/auth/register', {
                email,
                username,
                password
            })
            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }



  return (
    <div className="relative h-screen w-full bg-[url('/images/hero_1.jpg')] bg-cover bg-fixed bg-center">
        <div className="bg-black bg-opacity-50 h-screen w-full">
            <nav className="px-12 py-5">
                <img src="/images/logoTFX.png" alt="" className="h-24" />
            </nav>
            <div className="flex justify-center">
                <div className="m-4 bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:max-w-md lg:w-2/5 rounded-md w-full">
                    <h2 className="text-2xl mb-8 font-semibold">{variant == "login" ? "Login" : "Sign Up"}</h2>
                    <div className="flex flex-col gap-4">
                        {variant == "signup" && <Input id="username" placeholder="Username" type="text" 
                        onChange={(e) => setUsername(e.target.value)} value={username}/>}
                        <Input id="email" placeholder="Email" type="email" 
                        onChange={(e) => setEmail(e.target.value)} value={email}/>
                        <Input id="password" placeholder="Password" type="password" 
                        onChange={(e) => setPassword(e.target.value)} value={password}/>
                    </div>
                    <button onClick={variant==='login' ? login : register} className="mt-8 bg-red-500 hover:bg-red-700 py-2 px-4 font-semibold rounded-md transition w-full">{variant == "login" ? "Login" : "Sign Up"}</button>
                    <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                        <div onClick={() => signIn('google', { callbackUrl: '/' })} className="w-10 h-10  rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                            <FcGoogle size={30}/>
                        </div>
                        <div onClick={() => signIn('github', { callbackUrl: '/' })} className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                            <FaGithub size={30}/>
                        </div>

                    </div>
                    <p className="text-neutral-400 mt-12">{variant == "login" ? "Don't have an account?" : "Already have an account?"} 
                        <span onClick={toggleVariant} className="text-white ml-2 cursor-pointer">{variant == "login" ? "Sign Up" : "Login"}</span> </p>
                </div>
            </div>
        </div>
    </div>
  )
}
export default AuthPage