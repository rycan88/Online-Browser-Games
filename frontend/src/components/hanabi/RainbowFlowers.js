import { GiFlowers } from "react-icons/gi";
import { PiButterflyFill } from "react-icons/pi";

export const RainbowFlowers = () => {
    return (
        <>
            <svg width={0} height={0}>
                <defs>
                <linearGradient id="rainbow-gradient" x1="40%" y1="0%" x2="80%" y2="100%" spreadMethod="pad">
                    <stop offset="0%" stopColor="#6e0f0f" />
                    <stop offset="22.5%" stopColor="#a3430b" />                    
                    <stop offset="30%" stopColor="#d97706" />
                    <stop offset="35%" stopColor="#d18d05" />  
                    <stop offset="40%" stopColor="#c8ab04" />
                    <stop offset="47.5%" stopColor="#97a20a" />  
                    <stop offset="50%" stopColor="#138636" />
                    <stop offset="55%" stopColor="#186a87" />  
                    <stop offset="60%" stopColor="#1d4ed8" />
                    <stop offset="70%" stopColor="#503fb3" />  
                    <stop offset="75%" stopColor="#6630bd" />
                    <stop offset="95%" stopColor="#7c1bc7" />  
                    <stop offset="100%" stopColor="#c425aa" />
                </linearGradient>
                </defs>
            </svg>
            <PiButterflyFill fill="url(#rainbow-gradient)" />
        </>
    );
}