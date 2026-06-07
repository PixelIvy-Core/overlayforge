import { useEffect, useRef, useState } from "react";
import { useSSE } from "../hooks/useSSE";

export function MusicBox(){  
    const API = import.meta.env.VITE_FASTAPI_URL;

    const [currentID, setCurrentID] = useState("");
    const [trackInfo, setTrackInfo] = useState(null);
    const audioRef = useRef(null);

    const sseURL = `${API}/music/getTrackInfo?curr_id=${currentID}`;
    const stateURL = `${API}/music/getState`;

    const { data: newTrack, error, isConnected } = useSSE(sseURL);
    const { data: playData, playError, playIsConnected } = useSSE(stateURL);

    useEffect(() => {
        console.log('SSE connection status:', isConnected, error);
    }, [isConnected, error]);

    useEffect(() => {
        console.log('SSE connection status:', playIsConnected, playError);
    }, [playIsConnected, playError]);

    useEffect(() => {
        if (newTrack && newTrack.id !== currentID) {
            console.log('New track from SSE:', newTrack);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentID(newTrack.id);
            setTrackInfo(newTrack);
        }
    }, [newTrack, currentID]);

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
            } else if (playData == "True"){
                audio.play().catch(e => console.log("play blocked:", e));
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
            <div className="bg-surface text-text text-4xl w-fit max-w-[35%] h-auto border-edge border-3 bottom-0">
                <p>{trackInfo.title} by {trackInfo.artist}</p>
                <p>provided by {trackInfo.source}</p>
            </div>
        </div>
    );
}