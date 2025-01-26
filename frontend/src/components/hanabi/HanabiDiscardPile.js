import { useDroppable } from "@dnd-kit/core";
import { HanabiCard } from "./HanabiCard"
import getSocket from "../../socket";

const socket = getSocket();
export const HanabiDiscardPile = ({cards, turnPlayer, cardWidth}) => { 
    const id = "discardPileArea";
    const { active, isOver, setNodeRef } = useDroppable({ id })
    const shouldHighlight = isOver && active && active.data.current.type === "card" && turnPlayer === socket.userId;
    return (
        <div ref={setNodeRef}
             className={`relative px-5 mx-[3.75vw] -mt-[10px] mb-[10px] border-slate-400 border-[2px]  w-[25vw] h-[60%] ${shouldHighlight && "dropZoneHighlight"}`}
        >
            <div className="absolute inset-0 flex items-enter justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[50px] opacity-40">
                DISCARD PILE
            </div>
            <div className="flex items-center justify-start h-full -space-x-[60px]">
                {
                    cards.map((card) => {
                        return (
                            <HanabiCard number={card.number} 
                                        suit={card.suit}
                                        width={cardWidth} 
                            />    
                        )
                    })
                }
            </div>

      

        </div>
    )
}