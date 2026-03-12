import { useState } from "react";
import { DropZone } from "../hanabi/DropZone";
import { Zoomable } from "../Zoomable";
import { CrossBattleGridSpace } from "./CrossBattleGridSpace";
import { CrossBattleHandSpace } from "./CrossBattleHandSpace";
import { IoShuffle } from "react-icons/io5";
import getSocket from "../../socket";

const socket = getSocket();

export const CrossBattleHand = ({tileSize, spaceToTile, letters, orientation, tileToSpace, setTileToSpace, roomCode}) => {
    const [handOpacity, setHandOpacity] = useState(1);

    let handArray = [];
    const filledSpaces = []
    for (let index = 0; index < letters.length; index++) {
        const id = `handSpace-${String(index)}`;

        const tileIndex = spaceToTile(id);
        const num = tileIndex == null ? null : Number(tileIndex);

        if (num != null) {
            filledSpaces.push(index);
        }

        handArray.push(num);
    }

    const shuffleTiles = () => {
        setHandOpacity(0);

        setTimeout(() => {
            const tileCount = filledSpaces.length;
            for (let i = tileCount - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [handArray[filledSpaces[i]], handArray[filledSpaces[j]]] = [handArray[filledSpaces[j]], handArray[filledSpaces[i]]]
            }

            setTileToSpace((prev) => {
                const next = { ...prev }
                for (let i = 0; i < handArray.length; i++) {
                    const id = `handSpace-${String(i)}`;
                    const tileIndex = handArray[i]; 

                    if (tileIndex != null) {
                        next[tileIndex] = id;
                    }
                }
                
                socket.emit("cross_battle_send_tile_to_space_data", roomCode, next);
                return next;
            })

            setTimeout(() => {
                setHandOpacity(1);
            }, 100);
 
        }, 300);
    }

    const tiles = [];
        
    for (let index = 0; index < letters.length; index++) {
        const id = `handSpace-${String(index)}`;

        let tileIndex = spaceToTile(id);
        let letter = tileIndex != null ? letters[tileIndex] : null;

        tiles.push(
            <CrossBattleHandSpace 
                key={id} 
                id={id} 
                tileSize={tileSize} 
                tileData={{letter, tileIndex}}
                handOpacity={handOpacity}
            />
        )
    }

    return (
        <div className="relative flex flex-col">
            <button className="absolute hover:scale-110"
                    style={{fontSize: tileSize * 0.5, top: orientation === "landscape" && -tileSize * 0.5, right: -tileSize * 0.5, bottom: orientation === "portrait" && tileSize * 0.5}}
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
                                handOpacity={handOpacity}
                            />          
                    })
                }
            </div>
        </div>

    );
}