import getSocket from "../../socket";
import { Card } from "../card/Card";
import { FaCheck, FaHeart } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosHeart } from "react-icons/io";
import { FaHeartBroken, FaSkull } from "react-icons/fa";
import { FaHandBackFist } from "react-icons/fa6";
import { cardChars, suitIcons, suitColours } from "../card/CardUtils";
import { IoIosHeartEmpty } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { SimplifiedCard } from "../card/SimplifiedCard";
import { AnimatedBreakingHeart } from "../AnimatedBreakingHeart";
import { InfoButton } from "../InfoButton";
import { ThirtyOneRules } from "./ThirtyOneRules";
import { useEffect } from "react";

const socket = getSocket();
const NAVBAR_HEIGHT = 60;
export const ThirtyOneResultsScreen = ({roomCode, playersData}) => {
    useEffect(() => {
        window.scrollTo(0, NAVBAR_HEIGHT);
    }, []);

    if (!playersData) {return <></>}

    const CARD_WIDTH = (window.innerHeight * 0.05) * (2/3);
    let wasOut = false;
    const playersAlive = Object.values(playersData).filter(data => data.lives > 0).map((data) => {
        return {nameData: data.nameData, lives: data.lives};
    });

    return (
        <div className="thirtyOnePage entirePage h-[100vh] md:h-[calc(100vh-60px)] flex items-center justify-center text-slate-200 text-[2vh]">
            <div className="absolute top-[2%] right-[2%]">
                <InfoButton>
                    <ThirtyOneRules />
                </InfoButton>
            
            </div>
            <div className="myContainerCard pb-[75px]">
                <div className="myContainerCardTitle">
                    Results
                </div>
                
                <div className={`flex w-[90%] px-[0.5vw] gap-2 items-center justify-center py-2`}>
                    <div className="flex w-[8%] items-center justify-center">
                        Ready Status
                    </div>
                    
                    <div className="flex gap-2 w-[40%] items-center justify-center">

                        <div className="flex items-center justify-center w-[70%]">
                            Username
                        </div>


                        <div className="w-[30%] items-center justify-start">
                            Lives
                        </div>

                    </div>

                    <div className="flex w-[25%] items-center justify-center">
                        Cards
                    </div>
                    <div className="w-[10%]">
                        Score
                    </div>

                                     
                </div>

                <div className="flex flex-col w-full h-[80%] justify-start gap-[4px] items-center overflow-y-auto overflow-x-visible"> 
                { 
                    Object.values(playersData).sort((a, b) => a.ranking - b.ranking).map((playerData, index) => {
                        const isMyData = socket.userId === playerData.nameData.userId;
                        const isOut = playerData.cards.length === 0;

                        const heartsLost = playerData.gotStrike ? (playerData.didKnock ? 2 : 1) : 0
                        const grayHearts = 3 - playerData.lives - heartsLost;
                        const breakPoint = !wasOut && heartsLost > 0;
                        wasOut = heartsLost > 0;
                        return (
                            <>
                                {breakPoint && <div className="w-full h-[0.25vh] -mx-[2vh] my-[1vh] bg-red-800"></div>}
                                <div className={`myContainerCardInnerBox w-[90%] flex items-center justify-center gap-2 px-[0.5vw] py-[1vh] ${isOut && "text-slate-500"} ${isMyData ? (isOut ? "bg-yellow-500/20" : "bg-yellow-500/40") : (isOut ? "bg-sky-800/10" : "bg-sky-800/30")}`}>
                                    <div className="flex w-[8%] justify-center"> 
                                        { (playerData.lives > 0 || playersAlive.length <= 1) ?
                                            <>
                                                {playerData.isReady ? <FaCheck className="icons text-green-600"/> : <AiOutlineLoading3Quarters className="icons animate-spin text-red-500"/>}
                                            </>
                                            :
                                            <FaSkull className="text-slate-500"/>

                                        }    
                                    </div>    
                                    
                                    <div className="flex gap-2 w-[40%] items-center justify-end">
                                        <div className={`flex relative items-center justify-center w-[70%] ${isMyData && ""}`}>
                                            {playersAlive <= 1 && index === 0 && <div className="absolute bottom-[2vh] text-[4vh] animate-myBounce">👑</div>}
                                            {playerData.nameData.nickname}
                                        </div>


                                        <div className="flex relative text-red-700 text-[0.8em] gap-[0.13vw] w-[30%] justify-center">

                                            {playerData.lives > 0 && 
                                                [...Array(playerData.lives)].map((_, index) => (
                                                <FaHeart/>
                                                ))
                                            }        

                                            {
                                                [...Array(heartsLost)].map((_, index) => (
                                                    <AnimatedBreakingHeart />
                                                )) 
                                            }  
                                            {
                                                [...Array(grayHearts)].map((_, index) => (
                                                    <div className="text-slate-500"><FaHeartBroken /></div>
                                                ))
                                            }  
                                            { heartsLost > 0 &&
                                                <div className="absolute font-bold bottom-[90%] left-[90%] text-[1em] text-red-700">-{heartsLost}</div>
                                            }
                                        </div>

                                    </div>
                                    <div className="flex place-content-center gap-[0.5vw] w-[25%]">
                                        { !isOut &&  
                                            playerData.cards.map((card) => {
                                                return (
                                                    <div className="flex" style={{color: suitColours[card.suit]}}>
                                                        <SimplifiedCard number={card.number} suit={card.suit} width={CARD_WIDTH}/>
                                                    </div>
                                                )
                                            })
                                        }  
                                    </div> 
                                    <div className="text-[1.5em] w-[10%]">
                                        {!isOut &&
                                            playerData.score
                                        }
                                    </div>
            
                                </div>
                            </>
                        );
                    })
                }
                </div>
                <button className={"gradientButton absolute bottom-4 left-1/2 -translate-x-1/2 text-white w-[20vh] h-[8vh] text-[2vh] rounded-lg shadow-xl"} 
                        onClick={() => {
                            socket.emit("thirty_one_ready", roomCode);
                        }}
                        disabled={playersData[socket.userId].isReady || (playersData[socket.userId].lives === 0 && playersAlive.length > 1)}
                >
                    {(playersData[socket.userId].isReady || (playersData[socket.userId].lives === 0 && playersAlive.length > 1)) 
                        ? "Waiting for others" 
                        : (playersAlive.length > 1) ? "Next Round" : "New Game"
                    }
                </button>
            </div>
        </div>
    );
}