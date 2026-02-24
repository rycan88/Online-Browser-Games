import { useState } from "react";
import { DropZone } from "../hanabi/DropZone";
import { Zoomable } from "../Zoomable";
import { CrossBattleGridSpace } from "./CrossBattleGridSpace";
import { CrossBattleHandSpace } from "./CrossBattleHandSpace";

export const CrossBattleHand = ({tileSize, spaceToTile, letters}) => {
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
        <div className='flex flex-col flex-wrap items-center justify-center'
                style={{height: tileSize * 11.5, width: tileSize * 3}}
        >
            {tiles}
        </div>
    );
}