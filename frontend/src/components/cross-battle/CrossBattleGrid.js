import { useState } from "react";
import { DropZone } from "../hanabi/DropZone";
import { Zoomable } from "../Zoomable";
import { CrossBattleGridSpace } from "./CrossBattleGridSpace";

export const CrossBattleGrid = ({tileSize, gridSize, viewportSize, transform, setTransform, spaceToTile, letters, activeType}) => {
    const newTileSize = tileSize * transform.scale;
    const gridSizePx = tileSize * gridSize;

    const rowStart = Math.max(0, Math.floor((transform.offsetY) / newTileSize));
    const rowEnd = Math.min(gridSize, Math.ceil((transform.offsetY + viewportSize) / newTileSize));
    const colStart = Math.max(0, Math.floor(transform.offsetX / newTileSize));
    const colEnd = Math.min(gridSize, Math.ceil((transform.offsetX + viewportSize) / newTileSize));

    const tiles = [];
    for (let row = rowStart; row < rowEnd; row++) {
        for (let col = colStart; col < colEnd; col++) {
            const id = `gridSpace-${String(col)}-${String(row)}`;
            const isMiddle = row === (gridSize - 1) / 2 && col === (gridSize - 1) / 2;

            const offset = {x: col * tileSize, y: row * tileSize}

            let tileIndex = spaceToTile(id);
            let letter = tileIndex != null ? letters[tileIndex] : null;

            tiles.push(
                <CrossBattleGridSpace 
                    key={id} 
                    id={id} 
                    tileSize={tileSize} 
                    isMiddle={isMiddle} 
                    offset={offset}
                    tileData={{letter, tileIndex}}
                />
            )
        }
    }

    return(
        <Zoomable viewportSize={viewportSize} shouldLockTransform={activeType === "crossBattleTile"} transform={transform} setTransform={setTransform} gridSizePx={gridSizePx} zoomBounds={{min: 0.5, max: 1}}>
            <div className="bg-[rgb(182,188,226)] touch-none"
                style={{
                    width: gridSizePx,
                    height: gridSizePx,
                }}
            >
                {tiles}
            </div>
        </Zoomable>
    );
}