import { BsStarFill } from "react-icons/bs";
import { CrossBattleDropZone } from "./CrossBattleDropZone";
import { useDroppable } from "@dnd-kit/core";
import { CrossBattleTile } from "./CrossBattleTile";
import { DraggableItem } from "../hanabi/DraggableItem";

export const CrossBattleGridSpace = ({tileSize, isMiddle, offset, id, tileData}) => {
    const { active, isOver, setNodeRef } = useDroppable({ id });

    const {letter, tileIndex} = tileData;

    return (
        <div className={`absolute flex items-center justify-center bg-gradient-to-br ${isMiddle ? "bg-slate-100" : "bg-slate-700"}  border-none text-black rounded-[10%] touch-none`} 
             style={{height: tileSize, width: tileSize, fontSize: tileSize / 1.5, left: offset.x, top: offset.y, boxShadow: `inset 0 0 0 ${tileSize / 24}px rgb(182,188,226)`}}
             ref={setNodeRef}
        >
            {tileIndex != null && (
                <div className={`z-[10]`}>
                    <DraggableItem id={`${letter}-${String(tileIndex)}`} data={{type: "crossBattleTile", letter: letter, tileIndex: tileIndex}}>
                        <CrossBattleTile tileSize={tileSize} 
                                        tileLetter={letter}
                        />
                    </DraggableItem>
                </div>
            )}
            <div className="absolute">{isMiddle && <BsStarFill />}</div>
        </div>
    )
}