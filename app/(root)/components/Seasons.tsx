"use client"

import { Episode, TVShow } from "@prisma/client"
import { useEffect, useState } from "react"
import Select from 'react-select'
import Player from "./Player"
import PlayButton from "./PlayButton"

interface SeasonsProps {
    tv: TVShow
}
const Seasons = ({tv}: SeasonsProps) => {
    const [value, setValue] = useState<number>(0)
    const [showPlayer, setShowPlayer] = useState(false)
    const [episode, setEpisode] = useState(tv?.seasons[0].episodes[0])
   
  return (
    <div>
        <Player media={episode as Episode} show={showPlayer} setShow={setShowPlayer}/>

        <Select className="w-full md:w-1/4" classNames={{
            control: (state) => "bg-transparent text-zinc-200 border border-zinc-200 rounded-md py-1 px-2 my-3",
            menu: (state) => "bg-zinc-800 text-zinc-200 border border-zinc-200 rounded-md mt-1 py-2 px-2",
            option: (state) => " py-1",
        }}
        onChange={(value) => {
            setValue(value?.value!)
        }}
        unstyled
        isSearchable={false}
        placeholder="Temporada..."
        options={tv?.seasons.filter((season) => season.season_number !== 0).map((season) => ({value: season.season_number, label: `Temporada ${season.season_number}`}))}/>
            {tv?.seasons.filter(s=>s.season_number === value).map((season) => (
                    season.season_number === 0 ? null :
                    <div key={season.id_season} className="flex flex-col md:flex-row flex-wrap">
                        {season.episodes.map((episode) => (
                            <div tabIndex={episode.episode_number} key={episode.id_episode} className="p-2 md:w-1/2 lg:w-1/3 xl:w-1/4">
                                <div className="flex space-x-2">
                                    <div className="w-36 overflow-hidden rounded-md">
                                        <img className={`${episode.videoUrl ? 'brightness-100': 'brightness-50'} aspect-[16/9] h-full object-cover` } src={episode?.still_path!} alt="" />
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <p>{episode.episode_number}- {episode.name}</p>
                                        <p className="text-zinc-400 text-xs">{episode.runtime} min.</p>
                                        {episode.videoUrl && <PlayButton action={() => {
                                            setEpisode(tv?.seasons[0].season_number === 0 ? tv?.seasons[+season.season_number].episodes[+episode.episode_number - 1] : tv?.seasons[+season.season_number - 1].episodes[+episode.episode_number - 1])    
                                            setShowPlayer(true)
                                        }} />}
                                    </div>


                                </div>
                            </div>
                        ))}
                    </div>
                ))}
    </div>
  )
}
export default Seasons