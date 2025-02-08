import { useDroppable } from "@dnd-kit/core";
import { getVisibleCardData, HanabiCard } from "./HanabiCard";
import getSocket from "../../socket";
import { FaFlagCheckered, FaHourglass } from "react-icons/fa6";
import { HanabiContext } from "../../pages/Hanabi";
import { useContext } from "react";
import { ReadyStatusIcon } from "../ReadyStatusIcon";

const socket = getSocket();
export const HanabiPlayer = ({playerData}) => {
    const { turnPlayer, showTeammateHints, finalPlayer, gameInProgress } = useContext(HanabiContext);

    const id = playerData.nameData.userId;
    const { active, isOver, setNodeRef } = useDroppable({ id, data: {type: "player"} });
    
    if (!playerData) { return <></> }


    const shouldHighlight = isOver && active && active.data.current.type === "token" && turnPlayer === socket.userId;

    const nameCardWidth = Math.min((window.innerHeight * 0.12) * (2/3), window.innerWidth * 0.04); // 75px
    const username = playerData.nameData.nickname;
    const cards = playerData.cards;
    const cardCount = cards.length;
    const isTurn = turnPlayer === playerData.nameData.userId;

    return (
        <div ref={setNodeRef}
            className={`flex flex-col border-[2px] h-[20vh] border-slate-400 ${cardCount >= 5 ? "w-[30vw]" : "w-[25vw]"} ${shouldHighlight && "dropZoneHighlight"} ${isTurn && "bg-sky-600/20"}`}
        >
            <div className="flex flex-col items-center justify-center gap-[10%] h-full">
                <div className={`flex gap-[10px] items-center justify-center w-full text-[1.9vh]`}>
                    <div className="flex w-[5%] justify-center items-center">
                        { finalPlayer === playerData.nameData.userId &&
                            <FaFlagCheckered />
                        }
                    </div>
                    <div>{username}</div>
                    <div className="flex w-[5%] justify-center items-center">
                        { !gameInProgress &&
                            <ReadyStatusIcon isReady={playerData.isReady}/>
                        }
                    </div>
                </div>
                <div className="flex items-center justify-center gap-[5%] w-full">
                    {
                        cards.map((card) => {
                            const cardData = getVisibleCardData(card);
                            const number = cardData.number;
                            const suit = cardData.suit;
                            
                            return <HanabiCard number={showTeammateHints ? number : card.number} 
                                suit={showTeammateHints ? suit : card.suit}
                                width={nameCardWidth} 
                            />   
                        })
                    }
                </div>
            </div>
        </div>
    );
}