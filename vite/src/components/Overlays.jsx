import {motion} from 'motion/react'

export function CamFrame(){
    return(
        <div>
            <div className='border-4 border-primary fixed w-150 h-100 bottom-0 right-0 m-1'></div>
        </div>
    )
}

export function Background(){
    return(
        <div className='fixed w-full h-full bg-back'>
            <Particle />
        </div>
    )
}

export function Footer(){
    return(
        <div className='fixed bottom-0 w-full h-8 bg-surface border-edge'></div>
    )
}

function Particle(s, t, x){

    return (
        <motion.div
            className='relative bg-surface border-2 border-edge size-6 max-w-3xs max-h-3xs m-1'  
        />
    )
}