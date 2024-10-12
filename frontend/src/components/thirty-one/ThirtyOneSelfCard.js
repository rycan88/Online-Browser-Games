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
        <div className={`${isHovered && "cursor-pointer"} rounded-[5%] border-[0.5px] border-black/15 shadow-lg md:shadow-xl`} 
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
                transition: "transform 0.1s ease-in-out"
            }}>
                <Card number={card.number} 
                        suit={card.suit}
                        width={cardWidth}
                />
            </div>
        </div>
    );
}