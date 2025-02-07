import { useDroppable } from "@dnd-kit/core"
import CardOutline from "../card/CardOutline"
import { DropZone } from "./DropZone"
import { getHanabiColours, HanabiCard } from "./HanabiCard"
import getSocket from "../../socket"

const socket = getSocket();

const borderColors = {"red": "border-red-500", "yellow": "border-yellow-500", "green": "border-green-500", "blue": "border-blue-500", "purple": "border-purple-500", "pink": "border-pink-500"}
export const HanabiPlayPile = ({playPile, turnPlayer, cardWidth}) => {
    const id = "playPileArea";
    const { active, isOver, setNodeRef } = useDroppable({ id })
    const shouldHighlight = isOver && active && active.data.current.type === "card" && turnPlayer === socket.userId;
    const cardHeight = cardWidth * 1.4;

    return (
        <div ref={setNodeRef} 
             className={`flex w-[35%] h-full border-[#F8C8DC]/80 border-[4px] rounded-[10px] ${shouldHighlight && "playPileHighlight"}`}
        >
            {
                Object.keys(playPile).map((colour) => {
                    const num = playPile[colour];
                    let borderColor = borderColors[colour];
                    
                    return (
                        <div className="relative flex flex-col pt-[15px] w-[20%] items-center"
                             style={{paddingTop: cardWidth * 0.15}}
                        >
                            { num === 0 ?
                                <CardOutline width={cardWidth} borderColor={borderColor}/>
                                :
                                [...Array(Number(num))].map((_, index) => {
                                    return (
                                        <div style={{marginTop: index !== 0 && -cardHeight * 0.78}}
                                        >
                                            <HanabiCard number={index + 1} 
                                                        suit={colour}
                                                        width={cardWidth} 
                                            />   
                                        </div>
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