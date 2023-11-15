import { cookies } from 'next/headers'
import { FaRegCopyright } from 'react-icons/fa6'

const Footer = () => {

  const cookieStore = cookies()
  const limit = cookieStore.get('limitedAge')
  const limitedAge = (!limit || limit.value === 'null') ? 20 : Number(limit.value)

  return (
    <div className={`flex flex-col items-center justify-center ${limitedAge < 12 ? 'bg-blue-950' : 'bg-zinc-900'} p-4`}>
      <div className="relative">
        <img className="h-8 md:h-10" src="/images/logoTFX.png" alt="logo Topflix" />
      </div>
      <p className="text-xs flex items-center
       gap-2">Topflix {new Date().getFullYear()} <FaRegCopyright /> Todos los derechos reservados</p>

    </div>
  )
}
export default Footer