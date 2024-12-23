import { FaHeart } from "react-icons/fa6";
import "../css/Hanabi.css";
import { IoMdFlower } from "react-icons/io";
import { GiFlowerEmblem } from "react-icons/gi";
import { RiFlowerFill } from "react-icons/ri";
import { Card } from "../components/card/Card";
import CardOutline from "../components/card/CardOutline";
import { HanabiCard } from "../components/hanabi/HanabiCard";
import { StandardCard } from "../components/card/StandardCard";
import { HanabiPlayer } from "../components/hanabi/HanabiPlayer";
import { HanabiPlayPile } from "../components/hanabi/HanabiPlayPile";
import CardBacking from "../components/card/CardBacking";

export const Hanabi = ({roomCode}) => {
    const lives = 3;
    const clueTokens = 8;
    const maxClueTokens = 8;
    const nameCardWidth = 100;
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
                    <div className="flex justify-center items-center h-[40px] w-[40px] rounded-full bg-sky-700 border-[2px] border-slate-200">
                        <RiFlowerFill  className="text-[25px]"/>
                    </div>

                    <div>{clueTokens}/{maxClueTokens}</div>
                </div>
                <div className="flex h-full items-center gap-[10px] text-[30px]">
                    <CardBacking width={30}/>
                    <div>{cardsRemaining}</div>
                </div>
            </div>

            <div className="flex justify-evenly items-center w-full h-[30%]">
                <HanabiPlayer />
                <HanabiPlayer />               
            </div>
            <div className="flex justify-evenly items-center w-full h-[38%]">
                <HanabiPlayer />
                <HanabiPlayPile />
                <HanabiPlayer />
            </div>
            { false &&
                <div className="flex justify-evenly w-full h-[30%]">
                    <div className="flex w-[30%] border-slate-400 border-[2px]">
                        <div className="middleVerticalPile"> 
                            <CardOutline width={100} borderColor="border-red-500"/>
                        </div>
                        <div className="middleVerticalPile"> 
                            <CardOutline width={100} borderColor="border-yellow-500"/>
                        </div>
                        <div className="middleVerticalPile"> 
                            <CardOutline width={100} borderColor="border-green-500"/>
                        </div>
                        <div className="middleVerticalPile"> 
                            <CardOutline width={100} borderColor="border-blue-500"/>
                        </div>
                        <div className="middleVerticalPile"> 
                            <CardOutline width={100} borderColor="border-purple-500"/>
                        </div>
                    </div>               
                </div>
            }


            <div className="selfCards gap-[30px] flex justify-center items-center w-full h-[35%]">
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
            <div className="entirePage bg-black/80 z-[-10]"></div>
        </div>
        
    )
}