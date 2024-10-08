
import CardOutline from "./CardOutline";
import getSocket from "../../socket";

const socket = getSocket();
export const Pile = ({canPick, clickEvent, pile, pileElement, name, cardOutline=<CardOutline width={150}/>, width=150}, ) => {
    const borderWidth = `${width * (0.6 / 150)}px`
    const cardOffset = width * (0.25 / 150)
    return (
        <div className={`${name} relative ${canPick && "hover:cursor-pointer"}`}
            onClick={() => { 
                if (canPick) {
                    clickEvent()
                }
            }}>
            
            {cardOutline}
            
            { pile.map((card, index) => {
                const isLastCard = index === pile.length - 1;
                return (
                    <div className={`absolute rounded-[5%] ${(isLastCard && canPick) && "hover:translate-x-[2%] hover:-translate-y-[2%]"}`}
                        style={{
                            top: `-${index * cardOffset}px`, // Slight Y-axis offset
                            left: `${index * cardOffset}px`, // Optional: slight X offset for depth effect
                            borderStyle: 'solid',
                            borderColor: `${isLastCard ? "#000000" : "#cbd5e1"}`,
                            borderRightWidth: `${isLastCard ? borderWidth : '0px'}`,
                            borderTopWidth: `${isLastCard ? borderWidth : '0px'}`,
                            borderLeftWidth: borderWidth,
                            borderBottomWidth: borderWidth,
                        }}
                        key={index}
                    >
                        {pileElement(card, index)}
                    </div>
                );
            })}  

        </div>
    );

}