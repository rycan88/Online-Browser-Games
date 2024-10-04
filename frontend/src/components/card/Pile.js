
import CardOutline from "./CardOutline";
import getSocket from "../../socket";

const socket = getSocket();
export const Pile = ({canPick, clickEvent, pile, pileElement, name, cardOutline=<CardOutline width={150}/>}) => {
    return (
        <div className={`${name} relative ${canPick && "hover:cursor-pointer"}`}
            onClick={() => { 
                if (canPick) {
                    clickEvent()
                }
            }}>
            
            {cardOutline}
            
            { pile.map((card, index) => {
                    return (
                        <div className={`absolute ${(index === pile.length - 1) ? "rounded-lg border-[0.5px] border-black" : "rounded-lg border-l-[0.5px] border-b-[0.5px]"} ${(index === pile.length - 1 && canPick) && "hover:translate-x-[4px] hover:-translate-y-[4px]"}`}
                            style={{
                                top: `-${index * 0.25}px`, // Slight Y-axis offset
                                left: `${index * 0.25}px`, // Optional: slight X offset for depth effect
                            }}
                        >
                            {pileElement(card, index)}
                        </div>
                    );
                })

            }  

        </div>
    );

}