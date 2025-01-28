import { useDroppable } from "@dnd-kit/core"
import CardOutline from "../card/CardOutline"
import { DropZone } from "./DropZone"
import { HanabiCard } from "./HanabiCard"
import getSocket from "../../socket"

const socket = getSocket();
let cardWidth = 100
cardWidth = Math.min((window.innerHeight * 0.16) * (2/3), window.innerWidth * 0.053);

const borderColors = {"red": "border-red-500", "yellow": "border-yellow-500", "green": "border-green-500", "blue": "border-blue-500", "purple": "border-purple-500"}
export const HanabiPlayPile = ({playPile, turnPlayer}) => {
    const id = "playPileArea";
    const { active, isOver, setNodeRef } = useDroppable({ id })
    const shouldHighlight = isOver && active && active.data.current.type === "card" && turnPlayer === socket.userId;

    return (
        <div ref={setNodeRef} 
             className={`flex w-[35%] h-full border-[#F8C8DC]/80 border-[4px] rounded-[10px] ${shouldHighlight && "dropZoneHighlight"}`}
        >
            {
                Object.keys(playPile).map((colour) => {
                    const num = playPile[colour];
                    let borderColor = borderColors[colour];
                    
                    return (
                        <div className="flex flex-col pt-[15px] -space-y-[85%] w-[20%] items-center">
                            { num === 0 ?
                                <CardOutline width={cardWidth} borderColor={borderColor}/>
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