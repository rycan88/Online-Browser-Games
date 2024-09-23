import { useState } from "react";
import CardOutline from "../card/CardOutline";
import CardBacking from "../card/CardBacking";
import getSocket from "../../socket";

const socket = getSocket();
export const ThirtyOneDeck = ({roomCode, canPick}) => {
    const [remainingCardCount, setRemainingCardCount] = useState(52);
    return (
            <div className={`relative middleDeck ${canPick && "hover:cursor-pointer"}`} 
            onClick={() => { 
                if (canPick) {
                    socket.emit("thirty_one_pick_up_deck_card", roomCode);
                    setRemainingCardCount(remainingCardCount - 1);
                } 
            }}>
            <CardOutline/>
            { remainingCardCount > 0 && 
                [...Array(Number(remainingCardCount))].map((_sym, index) => {
                    return (
                        <div className={`absolute ${(index === remainingCardCount - 1) ? "border-[0.5px] border-black" : "border-l-[0.5px] border-b-[0.5px]"} ${(index === remainingCardCount - 1 && canPick) && "hover:translate-x-[4px] hover:-translate-y-[4px]"}`}
                            style={{
                                top: `-${index * 0.25}px`, // Slight Y-axis offset
                                left: `${index * 0.25}px`, // Optional: slight X offset for depth effect
                            }}
                        >
                            <CardBacking />
                        </div>
                    );
                })

            }  

        </div>
    );

}