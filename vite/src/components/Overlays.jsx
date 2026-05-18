import '../styles/overlays.css'
import {motion} from 'motion/react'

export function CamFrame(){
    return(
        <div>
            <div id="camframe"></div>
        </div>
    )
}

export function Background(){
    return(
        <div id="base">
            <Particle/>
        </div>
    )
}

export function Footer(){
    return(
        <div id="footer"></div>
    )
}

export function Particle(){
    return (
        <motion.div
            style={{
                width: "200px",
                height: "200px",
                borderBottom: 'solid',
                borderRight: 'solid',
                backgroundColor: "var(--accent-col)",
                borderColor: "var(--border-col)"
            }}
            
        />
    )
}