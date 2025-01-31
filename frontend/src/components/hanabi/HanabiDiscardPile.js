import { useDroppable } from "@dnd-kit/core";
import { HanabiCard } from "./HanabiCard"
import getSocket from "../../socket";
import { getShouldSortHanabiDiscardPile, setShouldSortHanabiDiscardPile } from "./HanabiSettings";
import { UnsortedIcon } from "../UnsortedIcon";
import { HiSortAscending } from "react-icons/hi";
import { useState } from "react";

const socket = getSocket();
export const HanabiDiscardPile = ({cards, turnPlayer, cardWidth}) => { 
    const [rerender, setRerender] = useState(false);
    const shouldSort = getShouldSortHanabiDiscardPile();
    const discardPile = shouldSort ? [...cards].sort((a, b) => a.id - b.id) : cards

    const id = "discardPileArea";
    const { active, isOver, setNodeRef } = useDroppable({ id })
    const shouldHighlight = isOver && active && active.data.current.type === "card" && turnPlayer === socket.userId;

    return (
        <div ref={setNodeRef}
             className={`relative mx-[3.75vw] -mt-[10px] mb-[10px] border-slate-400 border-[2px] w-[25vw] h-[60%] ${shouldHighlight && "discardPileHighlight"}`}
        >
            {
                <button className="absolute top-[0] right-[0]"
                        onClick={() => {
                            setShouldSortHanabiDiscardPile(!shouldSort);
                            setRerender(!rerender);
                        }}
                >
                    { shouldSort ?
                        <HiSortAscending size={cardWidth * 0.35} />
                    :
                        <UnsortedIcon size={cardWidth * 0.35}/>
                    } 
                </button>
            }
            <div className="absolute inset-0 flex items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[min(4vh,2.6vw)] opacity-40">
                DISCARD PILE
            </div>
            <div className="hanabi-scrollbar flex overflow-x-auto items-center justify-start h-full">
                {
                    discardPile.map((card, index) => {
                        return (
                            <div style={{paddingLeft: index === 0 && cardWidth * 0.15, marginLeft: index !== 0 && -cardWidth * 0.78}}>
                                <HanabiCard number={card.number} 
                                            suit={card.suit}
                                            width={cardWidth} 
                                />   
                            </div> 
                        )
                    })
                }
            </div>

      

        </div>
    )
}