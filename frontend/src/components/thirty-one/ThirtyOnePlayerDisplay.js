import { useEffect, useState } from "react";
import { getPlayerCoords } from "../../utils";
import { ThirtyOnePlayer } from "./ThirtyOnePlayer";

export const ThirtyOnePlayerDisplay = ({selfIndex, currentPlayers, playerTurn, knockPlayer, hasPicked}) => {
    const wholePage = document.querySelector(".thirtyOnePage");
    const [viewportWidth, setViewportWidth] = useState(wholePage ? wholePage.clientWidth : window.innerWidth);
    const [viewportHeight, setViewportHeight] = useState(wholePage ? wholePage.clientHeight : window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(wholePage ? wholePage.clientWidth : window.innerWidth);
            setViewportHeight(wholePage ? wholePage.clientHeight : window.innerHeight);
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])


    if (!currentPlayers) { return <></> }


    const playerCount = currentPlayers.length;

    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const width = viewportWidth * 0.85;
    const height = viewportHeight * 0.85;
    
    const coords = getPlayerCoords(playerCount, width, height, centerX, centerY);

    return currentPlayers.map((player, index) => {
        if (index === selfIndex) { return <></> }

        const adjustedIndex = selfIndex >= 0 ? (index + playerCount - selfIndex) % playerCount : index; 

        return (
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2"                         
                style={{
                    left: `${coords[adjustedIndex][0]}px`, 
                    top: `${coords[adjustedIndex][1]}px`,
                }}
            >
                <ThirtyOnePlayer name={player.nameData.nickname} 
                                    lives={player.lives} 
                                    isTurn={index === playerTurn} 
                                    didKnock={index === knockPlayer}
                                    hasPicked={hasPicked}
                />
            </div>
        );

    });

}