import { useState } from "react";
import { DropZone } from "../hanabi/DropZone";
import { Zoomable } from "../Zoomable";
import { CrossBattleGridSpace } from "./CrossBattleGridSpace";
import { CrossBattleHandSpace } from "./CrossBattleHandSpace";

export const CrossBattleHand = ({tileSize, spaceToTile, letters, orientation}) => {
    const tiles = [];
    for (let index = 0; index < letters.length; index++) {

            const id = `handSpace-${String(index)}`;

            let tileIndex = spaceToTile(id);
            let letter = tileIndex != null ? letters[tileIndex] : null;
            let isHovered = false;

            tiles.push(
                <CrossBattleHandSpace 
                    key={id} 
                    id={id} 
                    tileSize={tileSize} 
                    tileData={{letter, tileIndex, isHovered: isHovered}}
                />
            )
        }
    

    return (
        <div className={`flex ${orientation === "landscape" ? "flex-col" : "mt-[2vh]"} flex-wrap items-center justify-center`}
                style={{height: orientation === "landscape" ? tileSize * 11.5 : tileSize * 4, width: orientation === "landscape" ? tileSize * 3 : tileSize * 8.5}}
        >
            {tiles}
        </div>
    );
}