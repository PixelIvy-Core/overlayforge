import {Button} from '@base-ui/react/button'
import { useEffect, useState } from 'react'
import {FaPlay, FaPause, FaForward, FaBackward} from 'react-icons/fa'

export function Dashboard(){
    const API = import.meta.env.VITE_FASTAPI_URL;

    const [playing, setPlaying] = useState(false);
    const [queue, setQueue] = useState({});
    const [currentTrack, setCurrentTrack] = useState({});
    const [availableTracks, setAvailableTracks] = useState({});

    return(
        <div className="bg-back w-screen h-screen">
            <div className="flex absolute bg-surface size-[80%] m-8 rounded-4xl">
                <div className='flex flex-row items-center gap-4 h-20' >
                    <Button className="flex h-8 m-1 items-center justify-center rounded-sm border-2 border-edge bg-primary font-normal text-text select-none hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 data-disabled:border-neutral-500 data-disabled:text-neutral-500"
                    onClick={() => {
                        if (playing){
                            setPlaying(false);
                        }
                        else {
                            setPlaying(true);
                        }
                        fetch(`${API}/music/setState&new_state=${playing}`)
                    }}>
                        {!playing ? <FaPlay/> : <FaPause/>}
                    </Button>
                    <Button className="flex h-8 m-1 items-center justify-center rounded-sm border-2 border-edge bg-primary font-normal text-text select-none hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 data-disabled:border-neutral-500 data-disabled:text-neutral-500"
                    onClick={() => {
                        fetch(`${API}/music/next`, {method: "POST"});
                    }}>
                        <FaForward/>
                    </Button>
                </div>
            </div>
        </div>
    );
}