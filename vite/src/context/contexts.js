import { createContext} from "react";

export const gonic_username = import.meta.env.VITE_GONIC_USER
export const gonic_password = import.meta.env.VITE_GONIC_PASSWORD

export const MusicContext = createContext({
    "id": "tr-1",
    "title": "none",
    "artist": "none",
    "album": "none"
})