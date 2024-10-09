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

const socket = getSocket();

export const ThirtyOneResultsScreen = ({roomCode, playersData}) => {
    if (!playersData) {return <></>}

    const CARD_WIDTH = (window.innerHeight * 0.05) * (2/3);
    let wasOut = false;
    const playersAlive = Object.values(playersData).filter(data => data.lives > 0).map((data) => {
        return {nameData: data.nameData, lives: data.lives};
    });

    return (
        <div className="thirtyOnePage entirePage flex items-center justify-center text-slate-200 text-[2vh]">
            <div className="relative flex flex-col w-[calc(min(700px,80%))] h-[80%] mt-[6vh] justify-start gap-[4px] pt-[5vh] px-[4vh] pb-[75px] items-center text-slate-200 bg-gradient-to-tr from-sky-950 to-sky-900 border-2 border-slate-400 rounded-xl shadow-xl">
                <div className="absolute flex justify-center items-center w-[20vh] h-[8vh] text-[3vh] text-slate-200 p-4 -top-[4vh] bg-sky-800 shadow-xl rounded-xl border-[1px] border-slate-400">
                    Results
                </div>
                <div className={`flex w-full gap-2 items-center justify-center py-2 px-[calc(48px+1vh)]`}>
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

                <div className="flex flex-col w-full h-[80%] justify-start gap-[4px] px-[4vh] items-center overflow-y-auto overflow-x-visible"> 
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
                                {breakPoint && <div className="w-[120%] h-[0.25vh] -mx-[2vh] my-[1vh] bg-red-800"></div>}
                                <div className={`flex w-full gap-2 px-[1vh] items-center justify-center ${isOut && "text-slate-500"} ${isMyData ? (isOut ? "bg-yellow-500/20" : "bg-yellow-500/40") : (isOut ? "bg-sky-800/10" : "bg-sky-800/30")} py-[1vh] shadow-xl rounded-lg border-[1px] border-sky-700`}>
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
                                            {playersAlive <= 1 && index === 0 && <div className="absolute z-[10] bottom-[2vh] text-[4vh] animate-myBounce">👑</div>}
                                            {playerData.nameData.nickname}
                                        </div>


                                        <div className="flex text-red-700 text-[0.8em] gap-[0.2vh] w-[30%]">

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
                                        </div>

                                    </div>
                                    <div className="flex place-content-center gap-[1vh] w-[25%]">
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