import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CrossBattleGrid } from '../components/cross-battle/CrossBattleGrid';
import { CrossBattleTile } from '../components/cross-battle/CrossBattleTile';
import { DraggableItem } from '../components/hanabi/DraggableItem';
import '../css/CrossBattle.css';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useState } from 'react';

export const CrossBattle = ({}) => {
    const letters = "EVERYONEISGOODEXCEPTME";

    const tileSize = 48;
    const gridSize = 43;
    const viewTiles = 11;

    const viewportSize = tileSize * viewTiles;
    const centerTile = Math.floor(gridSize / 2);

    const initialX = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;
    const initialY = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;
    const [transform, setTransform] = useState({offsetX: initialX, offsetY: initialY, scale: 1});

    const [spaceToTile, setSpaceToTile] = useState({});

    const moveTile = (startId, endId, tileIndex) => {
        setSpaceToTile(prev => {
            const next = { ...prev };

            delete next[startId];
            next[endId] = tileIndex;
            return next;
        });
    }

    // Tile index to space Id
    const tileToSpace = (tileIndex) => {
        return Object.entries(spaceToTile).find(([, value]) => value === tileIndex)?.[0];
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeType, setActiveType] = useState(null);
    const [activeData, setActiveData] = useState({});
    const [draggingStyle, setDraggingStyle] = useState({});
    const [hoveredSpaceId, setHoveredSpaceId] = useState(null);

    const handleDragMove = (event) => {
        const { over, delta } = event;
    }

    const handleDragStart = (event) => {
        if (event.active.data.current.type) {
            setActiveData({letter: event.active.data.current.letter, tileIndex: event.active.data.current.tileIndex});
        } else {
            setActiveType(null);
        }
    }
    
    const handleDragOver = (event) => {
        const { over } = event;

        if (over) {
            setDraggingStyle({});
            console.log(over.id, "HAHAHAH")
            setHoveredSpaceId(over.id);
        }
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!active || !over) {
            return;
        }

        if (!spaceToTile[over.id]) {
            moveTile(tileToSpace(active.data.current.tileIndex), over.id, active.data.current.tileIndex);
            console.log(tileToSpace(active.data.current.tileIndex), over.id, active.data.current.tileIndex);
        }

        setDraggingStyle({});
        setActiveType(null);
        setActiveData({})
        setHoveredSpaceId(null);
    }

    if (hoveredSpaceId) {
        console.log(hoveredSpaceId)
    } else {
        console.log('lol')
    }

    return (
        <DndContext
            modifiers={[restrictToWindowEdges]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
        >
            <div className="crossBattlePage entirePage">
                <div className='flex flex-col items-center justify-around h-full'>
                    <CrossBattleGrid 
                        tileSize={tileSize} 
                        gridSize={gridSize} 
                        viewTiles={viewTiles}
                        transform={transform}
                        setTransform={setTransform}
                        spaceToTile={spaceToTile}
                        letters={letters}
                        hoverData={{spaceId: hoveredSpaceId, tileIndex: activeData.tileIndex, letter: activeData.letter}}

                    >
                    </CrossBattleGrid>
                        
                    
                    <div className='flex flex-wrap justify-center h-[20vh] w-[50vh] bg-red-800'>
                        {[...letters].map((letter, index) => {
                            if (tileToSpace(index)) { return <></> }
                            return (
                                <DraggableItem id={`${letter}-${String(index)}`} data={{type: "crossBattleTile", letter: letter, tileIndex: index}}>
                                    <CrossBattleTile tileSize={tileSize} 
                                                    tileLetter={letter}
                                    />
                                </DraggableItem>

                            )
                        })}
                    </div>
                </div>

                <DragOverlay>
                    {draggingStyle ? (
                        <div
                            style={{
                                position: 'absolute',
                                left: draggingStyle.transform ? `${draggingStyle.transform.split(' ')[0]}` : '0px',
                                top: draggingStyle.transform ? `${draggingStyle.transform.split(' ')[1]}` : '0px',
                                pointerEvents: 'none', // Prevent interaction with the overlay
                                zIndex: 9999, // Ensure the overlay is on top
                                opacity: 1
                            }}
                        >
                            {
                                <CrossBattleTile tileSize={tileSize * 1.1} tileLetter={activeData.letter} />
                            }
                        </div>
                    ) : null}
                </DragOverlay>
                <div className="entirePage bg-black/70 z-[-10]"></div>
            </div>

        </DndContext>

    )
}