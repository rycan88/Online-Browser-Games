import { useDroppable } from "@dnd-kit/core";
import { HanabiCard } from "./HanabiCard";
import getSocket from "../../socket";
import { FaHourglass } from "react-icons/fa6";

const socket = getSocket();
export const HanabiPlayer = ({playerData, turnPlayer, showTeammateHints}) => {
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
                <div className={`flex gap-[10px] items-center justify-center w-full`}>
                    <div className="text-[1.9vh]">{username}</div>
                </div>
                <div className="flex items-center justify-center gap-[5%] w-full">
                    {
                        cards.map((card) => {
                            const hasData = card.numberVisible || card.suitVisible;
                            const number = !hasData ? "" : (card.numberVisible ? card.number : "unknown");
                            const suit = !hasData ? "" : (card.suitVisible ? card.suit : "unknown");
                            return <HanabiCard number={showTeammateHints ? card.number : number} 
                                suit={showTeammateHints ? card.suit : suit}
                                width={nameCardWidth} 
                            />   
                        })
                    }
                </div>
            </div>
        </div>
    );
}