import { FaRegCopyright } from 'react-icons/fa6'

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-zinc-950 p-4 mt-4">
      <div className="relative">
        <img className="h-8 md:h-10" src="/images/logoTFX.png" alt="logo Topflix" />
      </div>
      <p className="text-xs flex items-center
       gap-2">Topflix {new Date().getFullYear()} <FaRegCopyright /> Todos los derechos reservados</p>

    </div>
  )
}
export default Footer