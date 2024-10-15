import { useState } from "react";
import { Card } from "../card/Card";

export const ThirtyOneSelfCard = ({handLength, card, index, onClickEvent, cardWidth, canBeHovered}) => {
    const [isHovered, setIsHovered] = useState(false);

    const middleIndex = (handLength) / 2;
    const rotation = (index - middleIndex) * 6;
    const translateY = isHovered ? -15 : 0//(index - middleIndex) * -2
    const translateX = (index - middleIndex) * -50

    if (!canBeHovered && isHovered) {
        setIsHovered(false);
    }

    return (
        <div className={`${isHovered && "cursor-pointer"} rounded-[5%]`} 
            style={{
                transform: `translateX(${translateX}%) rotate(${rotation}deg)`,
                transformOrigin: index > middleIndex ? "bottom left" : "bottom right",

            }}
            onClick={(e) => { 
                onClickEvent(e)
            }} 
            onMouseEnter={() => {
                if (!canBeHovered) { return; }
                setIsHovered(true)
            }}
            onMouseLeave={() => {
                setIsHovered(false)
            }}
        >
            <div style={{
                transform: `translateY(${translateY}%)`,
                transition: "transform 0.1s ease-in-out",
                border: "0.5px",
                borderColor: "rgb(0 0 0 / 0.15)", // border-black/15
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                '@media (minWidth: 768px)': {
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }
            }}>
                <Card number={card.number} 
                        suit={card.suit}
                        width={cardWidth}
                />
            </div>
        </div>
    );
}