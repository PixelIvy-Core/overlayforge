import {Button} from '@base-ui/react/button'
import { gonic_password, gonic_username, MusicContext } from '../context/contexts'
import { useEffect, useState } from 'react'

export function Dashboard(){
    const [tracks, setTracks] = useState(null);

    return(
        <div className="bg-back w-screen h-screen">
            <div className="absolute bg-surface size-[80%] m-8 rounded-4xl">
                <Button className="flex h-8 m-7 items-center justify-center gap-2 rounded-sm border-2 border-edge bg-primary px-3 text-sm leading-none whitespace-nowrap font-normal text-text select-none hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 data-disabled:border-neutral-500 data-disabled:text-neutral-500">test</Button>
            </div>
        </div>
    );
}