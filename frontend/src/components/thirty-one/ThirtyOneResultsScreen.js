import getSocket from "../../socket";
import { Card } from "../card/Card";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosHeart } from "react-icons/io";
import { FaSkull } from "react-icons/fa";
import { FaHandBackFist } from "react-icons/fa6";

const socket = getSocket();

export const ThirtyOneResultsScreen = ({roomCode, playersData}) => {
    if (!playersData) {return <></>}

    const playersAlive = Object.values(playersData).filter(data => data.lives > 0).map((data) => {
        return {nameData: data.nameData, lives: data.lives};
    });

    return (
        <div className="thirtyOnePage entirePage">
            <div className="flex flex-col flex-wrap w-full h-full justify-center items-center overflow-scroll">
                { 
                    Object.values(playersData).sort((a, b) => a.ranking - b.ranking).map((playerData) => {
                        const isOut = playerData.cards.length === 0;
                        return (
                            <div className={`flex h-[200px] w-[50%] gap-2 items-center justify-start ${isOut ? "text-slate-400" : (playerData.gotStrike ? "text-red-600" : "text-green-400")}`}>
                                <div className="flex gap-2 w-[30%] items-center justify-end p-6">
                                    {playerData.didKnock && <FaHandBackFist />}
                                    {playerData.nameData.nickname}
                                    <div className="flex items-center justify-center">
                                        <IoIosHeart/>
                                        {playerData.lives}
                                    </div>
                                    { (playerData.lives > 0 || playersAlive.length <= 1) ?
                                        <>
                                            {playerData.isReady ? <FaCheck className="icons text-green-400"/> : <AiOutlineLoading3Quarters className="icons animate-spin text-red-600"/>}
                                        </>
                                        :
                                        <FaSkull className=""/>

                                    }
                                </div>
                                { !isOut &&
                                    <>
                                    <div className="flex gap-1">
                                        {
                                            playerData.cards.map((card) => {
                                                return <Card number={card.number} suit={card.suit} width={100}/>
                                            })
                                        }
                                    </div>
                                    <div className="w-[30%] text-2xl">
                                        {playerData.score === 30.5 ? "30 ½" : playerData.score}
                                    </div> 
                                    </>  
                                }                      
                            </div>
                        );
                    })
                }
                <button className={"gradientButton absolute bottom-4 left-1/2 -translate-x-1/2 text-white w-[200px] h-[75px] text-lg rounded-lg"} 
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