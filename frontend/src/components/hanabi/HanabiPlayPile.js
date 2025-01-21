import { useDroppable } from "@dnd-kit/core"
import CardOutline from "../card/CardOutline"
import { DropZone } from "./DropZone"
import { HanabiCard } from "./HanabiCard"

let cardWidth = 100
cardWidth = Math.min((window.innerHeight * 0.16) * (2/3), window.innerWidth * 0.053);
export const HanabiPlayPile = () => {
    const id = "playPile";
    const { active, isOver, setNodeRef } = useDroppable({ id })
    const shouldHighlight = isOver && active && active.data.current.type === "card";
    const cardPile = {"red": 3, "yellow": 5, "green": 0, "blue": 1, "purple": 2}

    return (
        <div ref={setNodeRef} 
             className={`flex w-[35%] h-full border-yellow-600/80 border-[8px] ${shouldHighlight && "dropZoneHighlight"}`}
        >
            {
                Object.keys(cardPile).map((colour) => {
                    const num = cardPile[colour];
                    
                    return (
                        <div className="flex flex-col pt-[10px] -space-y-[90%] w-[20%] items-center">
                            { num === 0 ?
                                <CardOutline width={cardWidth} borderColor="border-green-500"/>
                                :
                                [...Array(Number(num))].map((_, index) => {
                                    return (
                                        <HanabiCard number={index + 1} 
                                                    suit={colour}
                                                    width={cardWidth} 
                                        />   
                                    );   
                                })
                            }  
                        </div>
                    )
                })                
            }    
        </div>
    );
}