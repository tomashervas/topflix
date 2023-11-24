"use client"

import { useState } from "react"
import Input from "../../auth/components/input"
import axios from "axios"
import { useRouter } from "next/navigation"

interface FormClientProps {
    avatars: {
        name: string,
        images: string[]
    }[],
    mail: string | null | undefined
}

const FormClient = ({avatars, mail}: FormClientProps) => {

    const router = useRouter()

    const [name, setName] = useState<string>('')
    const [isKid, setIsKid] = useState<boolean>(false)
    const [age, setAge] = useState<number>(0)
    const [avatar, setAvatar] = useState<string>('')
    const [errors, setErrors] = useState<string[] | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors(null)
        isKid ? console.log(name, isKid, age, avatar) : console.log(name, isKid, avatar)
        name.length < 3 && setErrors(err => err ? [...err, 'El nombre tiene que tener al menos 3 caracteres'] : ['El nombre tiene que tener al menos 3 caracteres'])
        name.length === 0 && setErrors(err => err ? [...err, 'El nombre es obligatorio'] : ['El nombre es obligatorio'])
        avatar.length === 0 && setErrors(err => err ? [...err, 'Debes seleccionar un avatar'] : ['Debes seleccionar un avatar'])
        if(errors) return
        console.log('sin errores')
        const res = await axios.post('/api/auth/profiles', {
            name,
            isKid,
            age : !isKid ? null : age,
            avatar
        })
        console.log(res)
        if(res.status === 201) {
            router.push(process.env.NEXT_PUBLIC_DOMAIN_URL + '/profiles')
        }
        else {
            setErrors(err => err ? [...err, 'Error al crear el perfil'] : ['Error al crear el perfil'])
        }

    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col py-4 mb-2 max-w-lg gap-4">
                    <p className="">Escribe tu nombre</p>
                    <Input id="name" placeholder="Nombre" type="text"
                        onChange={(e) => setName(e.target.value)} value={name} />
                    <div className="flex items-center gap-3">
                        <label htmlFor="isKid" className="cursor-pointer">¿Es un perfil infaltil?</label>
                        <input id="isKid" type="checkbox" placeholder="¿Es un niñ@?" name="isKid" onChange={(e) => setIsKid(e.target.checked)} value="isKid" className="form-checkbox rounded w-5 h-5 text-red-500 bg-zinc-600
                    focus:ring-0 active:ring-0 focus:border-red-500 shadow-red-500 focus:ring-offset-red-500" />
                    </div>
                    <div>
                        <select disabled={!isKid} className="form-select bg-zinc-800 rounded-md " name="age" id="age" defaultValue={"0"} onChange={(e) => setAge(+e.target.value)}>
                            <option value="0">Todos los públicos</option>
                            <option value="7"> Mayores de 6</option>
                            <option value="13">Mayores de 12</option>
                        </select>
                    </div>

                    <p className="mt-2">Selecciona un avatar</p>
                    {avatars.map((avatar) => (
                        <div key={avatar.name} className="overflow-x-auto">
                            <div className="flex flex-nowrap space-x-2 items-center overflow-x-scroll md:scrollbar-thin scrollbar-thumb-zinc-600 md:pb-2">
                                {avatar.images.map((img: string) => (
                                    <div onClick={() => setAvatar(img)} key={img} className="box-content w-24 h-24 flex-shrink-0 bg-zinc-800 hover:border-4 hover:border-red-300  cursor-pointer">
                                        <img className="w-24 h-24 object-cover" src={img} alt={img} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                    }
                    {errors && errors.map((error) => (
                        <p key={error} className="text-red-500">{error}</p>
                    ))}
                    <button type="submit" className="bg-red-500 rounded-md px-4 py-2">Enviar</button>
                </div>
            </form>
        </div>

    )
}
export default FormClient