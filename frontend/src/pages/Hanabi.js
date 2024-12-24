import { FaHeart } from "react-icons/fa6";
import "../css/Hanabi.css";
import { Card } from "../components/card/Card";
import CardOutline from "../components/card/CardOutline";
import { HanabiCard } from "../components/hanabi/HanabiCard";
import { StandardCard } from "../components/card/StandardCard";
import { HanabiPlayer } from "../components/hanabi/HanabiPlayer";
import { HanabiPlayPile } from "../components/hanabi/HanabiPlayPile";
import CardBacking from "../components/card/CardBacking";
import { HanabiClueToken } from "../components/hanabi/HanabiClueToken";
import { GiNotebook } from "react-icons/gi";

export const Hanabi = ({roomCode}) => {
    const lives = 3;
    const clueTokens = 8;
    const maxClueTokens = 8;
    const selfCardWidth = 100;
    const cardsRemaining = 12;

    return (
        <div className="hanabiPage entirePage select-none z-[0] text-slate-200">
            <div className="absolute flex flex-col left-[3%] gap-[2%] w-full h-[30%]">
                <div className="flex h-full items-center gap-[10px] text-[30px]">
                    <FaHeart className="text-red-500"/>
                    <div>{lives}</div>
                </div>
                <div className="flex h-full items-center gap-[10px] text-[30px]">
                    <HanabiClueToken />

                    <div>{clueTokens}/{maxClueTokens}</div>
                </div>
                <div className="flex h-full items-center gap-[10px] text-[30px]">
                    <CardBacking width={30}/>
                    <div>{cardsRemaining}</div>
                </div>
            </div>

            <div className="absolute top-[2%] right-[2%]">
                <GiNotebook className="text-[40px] text-slate-300"/>
            </div>

            <div className="flex justify-evenly items-center w-full h-[30vh]">
                <HanabiPlayer />
                <HanabiPlayer />               
            </div>
            <div className="flex justify-evenly items-center w-full h-[38vh]">
                <HanabiPlayer />
                <HanabiPlayPile />
                <HanabiPlayer />
            </div>

            <div className="flex h-[32%] w-full">
                <div className="relative flex items-center justify-start px-5 mx-[3.75vw] -mt-[10px] mb-[10px] border-slate-400 border-[2px] -space-x-[72px] w-[25vw] h-full">

                    <HanabiCard number={5} 
                        suit={"red"}
                        width={100} 
                    />          
                    <HanabiCard number={2} 
                        suit={"yellow"}
                        width={100} 
                    />    
                    <HanabiCard number={2} 
                        suit={"blue"}
                        width={100} 
                    />    
                    <div className="absolute right-[0] top-[0]">DISCARD</div>
                </div>
                <div className="selfCards gap-[30px] flex justify-center items-center w-[35%] h-full">
                    <Card number={1} 
                            suit={"hearts"}
                            width={selfCardWidth}
                    />
                    <Card number={1} 
                            suit={"hearts"}
                            width={selfCardWidth}
                    />
                    <Card number={1} 
                            suit={"hearts"}
                            width={selfCardWidth}
                    />
                    <Card number={1} 
                            suit={"hearts"}
                            width={selfCardWidth}
                    />
                </div>
                <div className="relative flex items-center justify-start px-5 mx-[3.75vw] -mt-[10px] mb-[10px] w-[25vw] h-full">
                    <div className="absolute top-[55%] left-[65%]"><HanabiClueToken size={50}/></div>
                    <div className="absolute top-[55%] left-[20%]"><HanabiClueToken size={50}/></div>
                    <div className="absolute top-[55%] left-[35%]"><HanabiClueToken size={50}/></div>
                    <div className="absolute top-[55%] left-[50%]"><HanabiClueToken size={50}/></div>
                    <div className="absolute top-[30%] left-[65%]"><HanabiClueToken size={50}/></div>
                    <div className="absolute top-[30%] left-[20%]"><HanabiClueToken size={50}/></div>
                    <div className="absolute top-[30%] left-[35%]"><HanabiClueToken size={50}/></div>
                    <div className="absolute top-[30%] left-[50%]"><HanabiClueToken size={50}/></div>
                </div>
            </div>

            <div className="entirePage bg-black/80 z-[-10]"></div>
        </div>
        
    )
}