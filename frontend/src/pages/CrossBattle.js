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
    const things = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeId, setActiveId] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const [activeTile, setActiveTile] = useState(null);
    const [draggingStyle, setDraggingStyle] = useState({});

    const handleDragMove = (event) => {
        const { delta } = event;
        if (activeId) {
            setDraggingStyle({
                transform: `translate(${delta.x}px, ${delta.y}px)`,
            });
        }
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        if (event.active.data.current.type) {
            setActiveTile(event.active.id[0]);
        } else {
            setActiveType(null);
        }
    }
    
    const handleDragOver = (event) => {
        const { over } = event;

        if (over) {
            //console.log(`Dragging over: ${over.id}`);
        }
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!active || !over) {
            return;
        }

        setDraggingStyle({});
        setActiveId(null);
        setActiveType(null);
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
                    <CrossBattleGrid />
                    <div className='flex flex-wrap justify-center h-[20vh] w-[50vh] bg-red-800'>
                        {[...letters].map((letter, index) => {
                            return (
                                <DraggableItem id={letter + String(index)} type="crossBattleTile">
                                    <CrossBattleTile tileSize={50} 
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
                                <CrossBattleTile tileSize={50} tileLetter={activeTile} />
                            }
                        </div>
                    ) : null}
                </DragOverlay>
                <div className="entirePage bg-black/70 z-[-10]"></div>
            </div>

        </DndContext>

    )
}