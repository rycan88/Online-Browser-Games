import { Zoomable } from "../Zoomable";
import { CrossBattleGridSpace } from "./CrossBattleGridSpace";

export const CrossBattleGrid = () => {
    const tileSize = 48;
    const gridSize = 43;
    const viewTiles = 11;

    const viewportSize = tileSize * viewTiles;
    const gridSizePx = tileSize * gridSize;

    const centerTile = Math.floor(gridSize / 2);
    const initialX = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;
    const initialY = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;
    const initialScale = 1;
    const initialTransform = {x: initialX, y: initialY, scale: initialScale};
    
    return(
        <Zoomable viewportSize={viewportSize} initialTransform={initialTransform} gridSizePx={gridSizePx}>
            <div className="grid"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
                    width: gridSizePx,
                    height: gridSizePx,
                }}
            >
                {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                    <CrossBattleGridSpace key={i} tileSize={tileSize} isMiddle={i === ((gridSize * gridSize) - 1) / 2}/>
                ))}
            </div>
        </Zoomable>
    );
}