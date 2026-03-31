import { useState } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { CrossBattleHandSpace } from "./CrossBattleHandSpace";
import { IoShuffle } from "react-icons/io5";
import getSocket from "../../socket";
import { useFlipAnimation } from "../../hooks/useFlipAnimation";
import { ConfirmOverlay } from "../ConfirmOverlay";

const socket = getSocket();

export const CrossBattleHand = ({tileSize, spaceToTile, letters, orientation, tileToSpace, setTileToSpace, roomCode, setShowReturnToRackOverlay}) => {
    const [isShuffling, setIsShuffling] = useState(false);
    const registerTile = useFlipAnimation([tileToSpace], isShuffling)


    let handArray = [];
    const filledSpaces = [] // Indeces of tiles that are in hand

    for (let index = 0; index < 22; index++) {
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

    const landscapeDisteMult = 0.65;


    return (
        <div className="relative flex flex-col">
            <button className="absolute hover:scale-110"
                    style={{fontSize: tileSize * 0.75, 
                            top: orientation === "landscape" && -tileSize * landscapeDisteMult, 
                            right: orientation === "portrait" ? tileSize * 0.25 : -tileSize * landscapeDisteMult, 
                            bottom: orientation === "portrait" && -tileSize * 0.75}}
                    onClick={shuffleTiles} 
            >
                <IoShuffle />
            </button>
            <button className="absolute hover:scale-110"
                    style={{fontSize: tileSize * 0.65, 
                            right: orientation === "landscape" && -tileSize * landscapeDisteMult,
                            left: orientation === "portrait" && tileSize * 0.25, 
                            bottom: orientation === "landscape" ? -tileSize * landscapeDisteMult : -tileSize * 0.75, 
                            }}
                    onClick={() => {
                        setShowReturnToRackOverlay(true);
                    }} 
            >
                <VscDebugRestart />
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