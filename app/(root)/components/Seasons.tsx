"use client"

import { Episode, TVShow } from "@prisma/client"
import { useEffect, useState } from "react"
import Select from 'react-select'
import Player from "./Player"
import PlayButton from "./PlayButton"
import Image from "next/image"
import OpenWith from "./OpenWith"

interface SeasonsProps {
    tv: TVShow,
    token: string,
    isAdmin: boolean
}
const Seasons = ({ tv, token, isAdmin}: SeasonsProps) => {
    const [value, setValue] = useState<number>(0)
    const [showPlayer, setShowPlayer] = useState(false)
    const [episode, setEpisode] = useState(tv?.seasons[0].episodes[0])

    return (
        <div>
            {isAdmin && <Player media={episode as Episode} show={showPlayer} setShow={setShowPlayer} token={token}/>}

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
                options={tv?.seasons.filter((season) => season.season_number !== 0).map((season) => ({ value: season.season_number, label: `Temporada ${season.season_number}` }))} />
            {tv?.seasons.filter(s => s.season_number === value).map((season) => (
                season.season_number === 0 ? null :
                    <div key={season.id_season} className="flex flex-col md:flex-row flex-wrap">
                        {season.episodes.map((episode, index) => (
                            
                            <div key={index} className="p-2 md:w-1/2 lg:w-1/3 xl:w-1/4">
                                <div className="flex space-x-2">
                                    <div className="w-[100px] h-[60px] rounded-md overflow-hidden relative">
                                        <img className={`w-full h-full object-cover ${episode.videoUrl ? 'brightness-100' : 'brightness-50'} rounded-md`} src={episode?.still_path?.includes('null') ? tv?.backdropUrl?.replace('/original/', '/w300/') : episode?.still_path?.replace('/original/', '/w300/')} alt="" />
                                    </div>
                                    <div className="flex flex-col justify-between w-[200px]">
                                        <p>{episode.episode_number}- {episode.name}</p>
                                        {episode.runtime && <p className="text-zinc-400 text-xs">{episode.runtime} min.</p>}
                                        {isAdmin && episode.videoUrl && <div className="flex"> <PlayButton action={() => {
                                            setEpisode(tv?.seasons[0].season_number === 0 ? tv?.seasons[+season.season_number].episodes[+episode.episode_number! - 1] : tv?.seasons[+season.season_number - 1].episodes[+episode.episode_number! - 1])
                                            setShowPlayer(true)
                                        }} />
                                            <OpenWith url={episode.videoUrl} token={token} isTv/></div>
                                        }
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