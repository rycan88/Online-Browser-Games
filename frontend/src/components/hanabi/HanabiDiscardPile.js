import { useDroppable } from "@dnd-kit/core";
import { HanabiCard } from "./HanabiCard"
import getSocket from "../../socket";
import { getSortHanabiDiscardPileMode, setSortHanabiDiscardPileMode } from "./HanabiSettings";
import { UnsortedIcon } from "../UnsortedIcon";
import { useState } from "react";
import { TbSortAscendingNumbers, TbSortAscendingShapes} from "react-icons/tb";

const socket = getSocket();
export const HanabiDiscardPile = ({cards, turnPlayer, cardWidth, storedDiscardCard, setStoredDiscardCard, discardStoredCard}) => { 
    const [rerender, setRerender] = useState(false);
    const sortMode = getSortHanabiDiscardPileMode();

    const colourSort = (a, b) => {
        return a.id - b.id;
    }

    const numberSort = (a, b) => {
        if (a.number === b.number) {
            return a.id - b.id;
        }
        return a.number - b.number;
    }

    const discardPile = sortMode === 1 ? [...cards].sort(colourSort) : (sortMode === 2 ? [...cards].sort(numberSort) : cards); 

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
                            setSortHanabiDiscardPileMode(sortMode + 1);
                            setRerender(!rerender);
                        }}
                >
                    { sortMode === 1 ?
                        <TbSortAscendingShapes size={cardWidth * 0.35} />

                    : sortMode === 2 ?
                        <TbSortAscendingNumbers size={cardWidth * 0.35} />
                    :
                        <UnsortedIcon size={cardWidth * 0.35}/>
                    } 
                </button>
            }
            <div className="absolute inset-0 flex items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[min(4vh,2.6vw)] opacity-40">
                DISCARD PILE
            </div>
            { storedDiscardCard &&
                <div className="absolute inset-0 flex flex-col items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-[100] bg-slate-900/75 text-[1.7vh]">
                    <div className="flex items-center justify-center h-[60%] w-[80%]">
                        The maximum number of tokens (8) has been reached. A token will not be added by discarding this card. Do you still wish to discard it?
                    </div>
                    <div className="flex items-center justify-evenly h-[40%] w-[50%] text-[2vh]">
                        
                        <button className="gradientButton rounded-[5%] py-[1px] px-2"
                                onClick={() => {
                                    discardStoredCard();
                                }}>
                            Yes
                        </button>
                        

                        <button className="redGradientButton rounded-[5%] py-[1px] px-2"
                                onClick={() => {
                                    setStoredDiscardCard(null);
                                }}
                        >
                            No
                        </button>
                    </div>
                </div>
            }
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