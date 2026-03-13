import { BsStarFill } from "react-icons/bs";
import { CrossBattleDropZone } from "./CrossBattleDropZone";
import { useDroppable } from "@dnd-kit/core";
import { CrossBattleTile } from "./CrossBattleTile";
import { DraggableItem } from "../hanabi/DraggableItem";
import getSocket from "../../socket";

const socket = getSocket()
export const CrossBattleHandSpace = ({tileSize, id, tileData, registerTile}) => {
    const { active, isOver, setNodeRef } = useDroppable({ id });

    const {letter, tileIndex} = tileData;

    const tileId = tileIndex != null ? `${letter}-${String(tileIndex)}` : null

    return (
        <div className={`flex items-center justify-center border border-dashed bg-[rgba(182,188,226,0.3)] border-[rgb(182,188,226)] text-black rounded-[10%]`} 
             style={{height: tileSize, width: tileSize, fontSize: tileSize / 1.5}}
             ref={setNodeRef}
        >
            {tileIndex != null && 
                <div className={`z-[10]`}
                     ref={registerTile(tileId)}
                >
                    <DraggableItem key={tileId} 
                                   id={tileId} 
                                   data={{type: "crossBattleTile", letter: letter, tileIndex: tileIndex}}>
                        <CrossBattleTile tileSize={tileSize} 
                                        tileLetter={letter}
                        />
                    </DraggableItem>
                </div>
            }
        </div>
    )
}