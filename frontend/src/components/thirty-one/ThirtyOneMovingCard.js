import { useState } from "react";
import { getPlayerCoords } from "../../utils";

const NAVBAR_HEIGHT = 60;
export const ThirtyOneMovingCard = ({element, playerCount, index, selfIndex, isMoving}) => {
    const [shouldShow, setShouldShow] = useState(true);
    

    
    const thirtyOneDeck = document.querySelector(".thirtyOneDeck");

    if (!thirtyOneDeck) { console.log("NOPE"); return; }
    
    const deckRect = thirtyOneDeck.firstElementChild.getBoundingClientRect();
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - NAVBAR_HEIGHT;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const width = viewportWidth * 0.70;
    const height = viewportHeight * 0.70;
    
    const coords = getPlayerCoords(playerCount, width, height, centerX, centerY);



    const adjustedIndex = selfIndex >= 0 ? (index + playerCount - selfIndex) % playerCount : index;

    return (
        <div className={`absolute transition-all duration-700 ease-in-out ${isMoving && "-translate-x-1/2 -translate-y-1/2"}`}
            style={{left: !isMoving ? `${deckRect.left}px` : `${coords[adjustedIndex][0]}px`, top: !isMoving ? `${deckRect.top - NAVBAR_HEIGHT}px` : `${coords[adjustedIndex][1]}px`}}
            onTransitionEnd={() => {
                setShouldShow(false);
            }}
        >
            {element}
        </div>
    );
}