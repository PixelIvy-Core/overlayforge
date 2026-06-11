import {Button} from '@base-ui/react/button'
import { useState, useEffect, useCallback } from 'react'
import {FaPlay, FaPause, FaForward, FaPlusCircle} from 'react-icons/fa'
import { useSSE } from '../hooks/useSSE';

export function Dashboard(){
    const API = import.meta.env.VITE_FASTAPI_URL;
    const [queue, setQueue] = useState([]);

    const refreshQueue = useCallback(() => {
        fetch(`${API}/music/getQueue`)
            .then(res => res.json())
            .then(data => setQueue(data));
    }, [API]);

    useEffect(() => {
        refreshQueue();
    }, [refreshQueue]);

    const queueItems = queue.map(song => 
        <tr key={song.id}>
            <td className="py-2 pr-4">{song.artist}</td>
            <td className="py-2 pr-4">{song.title}</td>
        </tr>);

    return(
        <div className="grid h-screen w-screen grid-rows-[auto_1fr_auto] gap-4 bg-back p-4">
            <header className="rounded-lg border-2 border-edge bg-surface px-4 py-3">
                <h1 className="text-lg font-semibold text-text">OverlayForge Dashboard</h1>
                <p className="text-sm text-text/70">Manage the current queue, browse tracks, and control playback.</p>
            </header>

            <main className="grid min-h-0 gap-4 lg:grid-cols-[1fr_1.2fr]">
                <MusicQueue queue={queueItems} className='min-h-0 overflow-auto rounded-lg border-2 border-edge bg-surface p-4'/>
                <TrackList onAdd={refreshQueue} className='min-h-0 overflow-auto rounded-lg border-2 border-edge bg-surface p-4 scrollbar-none'/>
            </main>

            <footer className="rounded-lg border-2 border-edge bg-surface p-4">
                <MusicControls onSkip={refreshQueue} className='w-full'/>
            </footer>
         </div>
    );
}

function TrackList({onAdd, className = ''}){
    const API = import.meta.env.VITE_FASTAPI_URL;
    const [availableTracks, setAvailableTracks] = useState([]);

    useEffect(() => {
        fetch(`${API}/music/getAllTracks`)
            .then(res => res.json())
            .then(data => setAvailableTracks(data));
    }, [API]);

    const trackItems = availableTracks.map(song => 
        <tr key={song.id}>
            <td className="py-2 pr-4">{song.artist}</td>
            <td className="py-2 pr-4">{song.title}</td>
            <td className="py-2">
                <Button className="flex size-10 m-1 items-center justify-center rounded-sm border-2 border-edge bg-primary font-normal text-text select-none hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 data-disabled:border-neutral-500 data-disabled:text-neutral-500"
                onClick={()=> {
                    fetch(`${API}/music/addToQueue?id=${song.id}`, {method: "POST"});
                    onAdd();
                }}>
                    <FaPlusCircle/>
                </Button>
            </td>
        </tr>);

    return (<div className={className}>
        <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text">Track List</h2>
            <span className="text-sm text-text/70">{availableTracks.length} tracks</span>
        </div>
        <table className="w-full text-left text-sm text-text">
            <thead className="border-b border-edge text-text/70">
                <tr>
                    <th className="py-2 pr-4 font-medium">artist</th>
                    <th className="py-2 pr-4 font-medium">title</th>
                    <th className="py-2 font-medium">add to queue</th>
                </tr>
            </thead>
            <tbody>
            {trackItems}
            </tbody>
        </table>
    </div>)
}

function MusicControls({onSkip, className = ''}){
    const API = import.meta.env.VITE_FASTAPI_URL;
    const [playing, setPlaying] = useState(false);
    const {data: currentTrack} = useSSE(`${API}/music/nowPlaying`)

    return (<div className={`${className} h-full`}>
        <div className="flex h-full min-h-0 items-stretch gap-4">
            <div className="flex min-w-0 flex-1 flex-col justify-center border-r border-edge pr-4">
                <p className="text-sm uppercase tracking-wide text-text/60">Now Playing</p>
                {currentTrack ?  <p className="truncate text-lg font-medium text-text">{currentTrack.title} - {currentTrack.artist}</p> : <p className="text-lg font-medium text-text">loading</p>}
            </div>
            <div className='flex items-center gap-4 pl-2' >
                <Button className="flex size-12 items-center justify-center rounded-md border-2 border-edge bg-primary text-text transition-transform select-none hover:scale-105 hover:not-data-disabled:bg-neutral-100 active:scale-95 active:not-data-disabled:bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 data-disabled:border-neutral-500 data-disabled:text-neutral-500"
            onClick={() => {
                if (playing){
                    setPlaying(false);
                    fetch(`${API}/music/setState?new_state=${playing}`, {method: "POST"});
                }
                else {
                    setPlaying(true);
                    fetch(`${API}/music/setState?new_state=${playing}`, {method: "POST"});
                }
            }}>
                {playing ? <FaPlay className="text-lg"/> : <FaPause className="text-lg"/>}
            </Button>
            <Button className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-edge bg-primary text-text transition-transform select-none hover:scale-105 hover:not-data-disabled:bg-neutral-100 active:scale-95 active:not-data-disabled:bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 data-disabled:border-neutral-500 data-disabled:text-neutral-500"
                onClick={() => {
                    fetch(`${API}/music/next`, {method: "POST"});
                    onSkip()
            }}>
                <FaForward className="text-lg"/>
            </Button>
            </div>
        </div>
    </div>)
}

function MusicQueue({queue, className = ''}){
    return(
        <div className={className}>
        <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-text">Queue</h2>
        </div>
            <table className="w-full text-left text-sm text-text">
            <thead className="border-b border-edge text-text/70">
                <tr>
                    <th className="py-2 pr-4 font-medium">artist</th>
                    <th className="py-2 pr-4 font-medium">title</th>
                </tr>
            </thead>
            <tbody>
            {queue}
            </tbody>
        </table>
        </div>
    )
}