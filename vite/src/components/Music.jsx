import { useEffect, useRef, useState } from "react";
import { useSSE } from "../hooks/useSSE";
import { useAnimate } from "motion/react";
import { motion } from "motion/react";

export function MusicBox(){  
    const API = import.meta.env.VITE_FASTAPI_URL;

    const [scope, animate] = useAnimate()
    const [trackInfo, setTrackInfo] = useState(null);
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const sseURL = `${API}/music/getTrackInfo?curr_id=`;
    const stateURL = `${API}/music/getState`;

    const { data: newTrack } = useSSE(sseURL);
    const { data: playData } = useSSE(stateURL);

    useEffect(() => {
        const run = async () => {
            await animate(scope.current, {opacity : 1}, {duration: 1.5});
            await delay(20000);
            await animate(scope.current, {opacity : 0}, {duration: 1.5});
        }
        if (playing){
            run();
        }
    }, [trackInfo, playing]);

    useEffect(() => {
        if (newTrack) {
            console.log('New track from SSE:', newTrack);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTrackInfo(newTrack);
        }
    }, [newTrack]);

    useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !trackInfo) return;

    const handleCanPlay = () => {
        audio.play().catch(e => console.log('Playback failed:', e));
        audio.removeEventListener('canplay', handleCanPlay);
        };
    audio.addEventListener('canplay', handleCanPlay);

    if (audio.readyState >= 3) {
        handleCanPlay();
    }

    return () => {
        audio.removeEventListener('canplay', handleCanPlay);
    };
    }, [trackInfo]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playData){
            if (playData == "False"){
                audio.pause();
                animate(scope.current, {display: "none"});
                setPlaying(false);
            } else if (playData == "True"){
                audio.play().catch(e => console.log("play blocked:", e));
                animate(scope.current, {display: "flex"});
                setPlaying(true)
            }
        }
    }, [playData])

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !trackInfo) return;
        
        const handleEnded = () => {
            console.log('track ended, getting new track');
            fetch(`${API}/music/next`, {method: "POST"})
        }
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, [API, trackInfo]);

    if (!trackInfo) {
        return <div className="bg-surface text-text">Loading track...</div>;
    }
    
    return (
        <div className="bg-transparent">
            <audio key={trackInfo?.id} ref={audioRef} src={trackInfo.url}/>
            <motion.div ref={scope} initial={{"opacity": 0}} className="bg-surface text-text text-4xl w-fit max-w-[35%] h-auto border-edge border-3 bottom-0">
                <p>{trackInfo.title} by {trackInfo.artist}</p>
                <p>provided by {trackInfo.source}</p>
            </motion.div>
        </div>
    );
}