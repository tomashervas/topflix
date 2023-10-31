import {FaPlay} from 'react-icons/fa6'

interface PlayButtonProps {
    action: () => void
}
const PlayButton = ({action}: PlayButtonProps) => {
  return (
    <button onClick={action} className='flex items-center justify-center rounded-full self-start bg-slate-200 text-zinc-900 py-[2px] px-2 text-sm'><FaPlay size={16} className='mr-2'/>Ver</button>
  )
}
export default PlayButton