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
             className={`relative flex items-center justify-start px-5 mx-[3.75vw] -mt-[10px] mb-[10px] border-slate-400 border-[2px] -space-x-[60px] w-[25vw] h-full ${shouldHighlight && "dropZoneHighlight"}`}
        >
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
      
            <div className="absolute right-[0] top-[0]">DISCARD</div>
        </div>
    )
}