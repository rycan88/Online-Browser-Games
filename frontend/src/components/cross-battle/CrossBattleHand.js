import { useState } from "react";
import { DropZone } from "../hanabi/DropZone";
import { Zoomable } from "../Zoomable";
import { CrossBattleGridSpace } from "./CrossBattleGridSpace";
import { CrossBattleHandSpace } from "./CrossBattleHandSpace";
import { IoShuffle } from "react-icons/io5";
import getSocket from "../../socket";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";

const socket = getSocket();

export const CrossBattleHand = ({tileSize, spaceToTile, letters, orientation, tileToSpace, setTileToSpace, roomCode}) => {
    const [isShuffling, setIsShuffling] = useState(false);
    const registerTile = useFlipAnimation([tileToSpace], isShuffling)


    let handArray = [];
    const filledSpaces = [] // Indeces of tiles that are in hand
    for (let index = 0; index < letters.length; index++) {
        const id = `handSpace-${String(index)}`;

        const tileIndex = spaceToTile(id);
        const num = tileIndex == null ? null : Number(tileIndex);

        if (num != null) {
            filledSpaces.push(num);
        }

        handArray.push(num);
    }

    const shuffleTiles = () => {
        setIsShuffling(true);

        const tileCount = filledSpaces.length;
        for (let i = tileCount - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filledSpaces[i], filledSpaces[j]] = [filledSpaces[j], filledSpaces[i]];
        }

        setTileToSpace((prev) => {
            const next = { ...prev }
            for (let i = 0; i < filledSpaces.length; i++) {
                const id = `handSpace-${String(i)}`;
                const tileIndex = filledSpaces[i]; 

                if (tileIndex != null) {
                    next[tileIndex] = id;
                }
            }
            
            socket.emit("cross_battle_send_tile_to_space_data", roomCode, next);
            return next;
        }) 

        setTimeout(() => {
            setIsShuffling(false);
        }, 300)
    }

    return (
        <div className="relative flex flex-col">
            <button className="absolute hover:scale-110"
                    style={{fontSize: tileSize * 0.75, 
                            top: orientation === "landscape" && -tileSize * 0.75, 
                            right: orientation === "portrait" ? tileSize * 0.25 : -tileSize * 0.75, 
                            bottom: orientation === "portrait" && -tileSize * 0.75}}
                    onClick={shuffleTiles} 
            >
                <IoShuffle />
            </button>
            <div className={`flex ${orientation === "landscape" ? "flex-col" : "mt-[2vh]"} flex-wrap items-center justify-center`}
                    style={{height: orientation === "landscape" ? tileSize * 11.5 : tileSize * 4, width: orientation === "landscape" ? tileSize * 3 : tileSize * 8.5}}
            >
                { 
                    handArray.map((tileIndex, i) => {
                        const id = `handSpace-${String(i)}`;
                        let letter = tileIndex != null ? letters[tileIndex] : null;

                        return <CrossBattleHandSpace 
                                key={id} 
                                id={id} 
                                tileSize={tileSize} 
                                tileData={{letter, tileIndex}}
                                registerTile={registerTile}
                            />          
                    })
                }
            </div>
        </div>

    );
}