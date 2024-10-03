import getSocket from "../../socket";
import { Card } from "../card/Card";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosHeart } from "react-icons/io";
import { FaSkull } from "react-icons/fa";

const socket = getSocket();

export const ThirtyOneResultsScreen = ({roomCode, playersData}) => {
    if (!playersData) {return <></>}
    console.log(playersData)

    return (
        <div className="thirtyOnePage entirePage">
            <div className="flex flex-col w-full justify-center items-center">
                { 
                    Object.values(playersData).sort((a, b) => a.ranking - b.ranking).map((playerData) => {
                        const isOut = playerData.cards.length === 0;
                        return (
                            <div className={`flex h-[200px] w-full items-center justify-center ${isOut ? "text-slate-400" : (playerData.gotStrike ? "text-red-600" : "text-green-400")}`}>
                                <div className="w-[15%] flex gap-2 items-center justify-end">
                                    {playerData.nameData.nickname}
                                    <div className="flex items-center justify-center">
                                        <IoIosHeart/>
                                        {playerData.lives}
                                    </div>
                                    { playerData.lives > 0 ?
                                        <>
                                            {playerData.isReady ? <FaCheck className="icons text-green-400"/> : <AiOutlineLoading3Quarters className="icons animate-spin text-red-600"/>}
                                        </>
                                        :
                                        <FaSkull className=""/>

                                    }
                                </div>
                                { !isOut ?
                                    <>
                                    <div className="flex w-[75%]">
                                        {
                                            playerData.cards.map((card) => {
                                                return <div className="transform scale-[50%] -mr-[90px]"><Card number={card.number} suit={card.suit}/></div>
                                            })
                                        }
                                    </div>
                                    <div className="w-[10%]">
                                        {playerData.score}
                                    </div> 
                                    </>  
                                    :
                                    <div className="placeholder w-[85%]"></div>
                                }                      
                            </div>
                        );
                    })
                }
                <button className={"gradientButton absolute bottom-4 left-1/2 -translate-x-1/2 text-white w-[200px] h-[75px] text-lg rounded-lg"} 
                        onClick={() => {
                            socket.emit("thirty_one_ready", roomCode);
                        }}
                        disabled={playersData[socket.userId].isReady || playersData[socket.userId].lives === 0}
                >
                    {(playersData[socket.userId].isReady || playersData[socket.userId].lives === 0) ? "Waiting for others" : "Next Round"}
                </button>
            </div>
        </div>
    );
}