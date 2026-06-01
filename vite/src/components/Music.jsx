import { useContext } from "react"
import { gonic_password, gonic_username, MusicContext } from "../context/contexts"


export function MusicBox(){
    const track = useContext(MusicContext);
    return (
        <div className="bg-transparent">
            <audio autoPlay={true} src={`http://localhost/rest/stream?u=${gonic_username}&p=${gonic_password}&id=${track.id}&c=overlayforge`}/>
            <div className="bg-surface text-text w-screen h-screen border-edge border-3">
                <h1>{track.title} by {track.artist}</h1>
                <h2>{track.album}</h2>
            </div>
        </div>
    );
}