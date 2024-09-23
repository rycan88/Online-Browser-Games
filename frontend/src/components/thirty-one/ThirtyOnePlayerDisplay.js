import { getPlayerCoords } from "../../utils";
import { ThirtyOnePlayer } from "./ThirtyOnePlayer";

const NAVBAR_HEIGHT = 60;
export const ThirtyOnePlayerDisplay = ({selfIndex, players, playerTurn}) => {

    const playerCount = players.length;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - NAVBAR_HEIGHT;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    const width = viewportWidth * 0.85;
    const height = viewportHeight * 0.85;
    
    const coords = getPlayerCoords(playerCount, width, height, centerX, centerY);
    console.log(coords)
    return players.map((player, index) => {
        if (index === selfIndex) { return <></> }
        console.log(index, selfIndex, player)
        const adjustedIndex = (index + playerCount - selfIndex) % playerCount; 

        console.log("YE", index + playerCount - selfIndex, selfIndex)
        return (
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2"                         
                style={{
                    left: `${coords[adjustedIndex][0]}px`, 
                    top: `${coords[adjustedIndex][1]}px`,
                }}
            >
                <ThirtyOnePlayer name={player.nickname} lives={3} isTurn={index === playerTurn}/>
            </div>
        );

    });

}