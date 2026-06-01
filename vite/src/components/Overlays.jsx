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
        <div className='fixed w-full h-full bg-back overflow-hidden'>
            <Particle s="40" x="10" t={5}/>
            <Particle s="30" x="95" t={19} />
            <Particle s="15" x="30" t={12} />
            <Particle s="10" x="80" t={10} />
            <Particle s="20" x="50" t={2} />
            <Particle s="25" x="80" t={6} />
            <Particle s="8" x="23" t={8} />
            <Particle s="35" x="40" t={3} />
            <Particle s="12" x="5" t={11} />
            <Particle s="18" x="15" t={7} />
            <Particle s="22" x="22" t={9} />
            <Particle s="14" x="38" t={4} />
            <Particle s="28" x="58" t={13} />
            <Particle s="16" x="67" t={5} />
            <Particle s="24" x="73" t={15} />
            <Particle s="9" x="86" t={6} />
            <Particle s="19" x="91" t={8} />
            <Particle s="26" x="47" t={10} />
        </div>
    )
}

export function Footer(){
    return(
        <div className='fixed bottom-0 w-full h-8 bg-surface border-edge'></div>
    )
}

function Particle({s, t, x}){

    return (
        <motion.div
            className='absolute bg-surface border-2 border-edge'
            style={{
                width: `${s}px`,
                height: `${s}px`,
                left: `${x}vw`,
                bottom: 0,
            }}
            initial={{ y: '100vh', opacity: 1 }}
            animate={{ y: '-100vh', opacity: 0 }}
            transition={{
                duration: t,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'loop',
            }}
        />
    )
}