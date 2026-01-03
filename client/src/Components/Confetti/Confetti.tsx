import React from 'react'
import ConfettiExplosion from 'react-confetti-explosion'


const Confetti = () => {
    return (
        <>
            <div className="h-100 w-100  bg-slate-500 ">
                <ConfettiExplosion
                    width={window.innerWidth}
                    height={window.innerHeight}
                    className='absolute  top-0 left-2/4 translate-x-1/4 translate-y-1/4'
                />
            </div>
        </>
    )
}

export default Confetti