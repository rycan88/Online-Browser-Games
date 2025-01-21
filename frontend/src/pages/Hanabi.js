import { FaHeart } from "react-icons/fa6";
import "../css/Hanabi.css";
import { HanabiCard } from "../components/hanabi/HanabiCard";
import { HanabiPlayer } from "../components/hanabi/HanabiPlayer";
import { HanabiPlayPile } from "../components/hanabi/HanabiPlayPile";
import CardBacking from "../components/card/CardBacking";
import { HanabiClueToken } from "../components/hanabi/HanabiClueToken";
import { GiNotebook } from "react-icons/gi";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, pointerWithin, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { HanabiSelfCards } from "../components/hanabi/HanabiSelfCards";
import { HanabiDiscardPile } from "../components/hanabi/HanabiDiscardPile";
import { HanabiTokenArea } from "../components/hanabi/HanabiTokenArea";

export const Hanabi = ({roomCode}) => {
    const lives = 3;
    const clueTokens = 8;
    const maxClueTokens = 8;
    const selfCardWidth = 100;
    const cardsRemaining = 12;

    const discardPileCards = [{suit: "red", number: 5}, {suit: "yellow", number: 2}, {suit: "blue", number: 2}]
    const discardCardWidth = 80;

    const tokenSize = 50;

    const playerCount = 5;
    const selfIndex = 0;
    const playersData = [
                            {username: "Rycan88", cards: [{suit: "green", number: 5}, {suit: "yellow", number: 1}, {suit: "blue", number: 3}, {suit: "red", number: 4}]},
                            {username: "Meeteehee", cards: [{suit: "purple", number: 3}, {suit: "blue", number: 5}, {suit: "blue", number: 2}, {suit: "blue", number: 1}]},
                            {username: "Cire365", cards: [{suit: "red", number: 1}, {suit: "green", number: 1}, {suit: "blue", number: 3}, {suit: "green", number: 3}]},
                            {username: "McPenquin", cards: [{suit: "red", number: 2}, {suit: "green", number: 3}, {suit: "purple", number: 2}, {suit: "green", number: 2}]},
                            {username: "Calix", cards: [{suit: "yellow", number: 1}, {suit: "red", number: 1}, {suit: "red", number: 3}, {suit: "red", number: 4}]},
                        ]



    const adjustedIndex = (index) => {
        return (selfIndex + index) % playerCount
    }

    const [selfCardIds, setSelfCardIds] = useState(["MyCard1", "MyCard2", "MyCard3", "MyCard4"])
    const indeces = ["MyCard1", "MyCard2", "MyCard3", "MyCard4"];
    const myCards = [{suit: "purple", number: 1}, {suit: "red", number: 2}, {suit: "blue", number: 3}, {suit: "green", number: 4}]
    const [activeId, setActiveId] = useState(null);
    const [draggingStyle, setDraggingStyle] = useState({})
    let draggingCard = null;
    if (activeId && indeces.includes(activeId)) {
        draggingCard = myCards[indeces.indexOf(activeId)];
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const customCollisionDetectionAlgorithm = ({droppableContainers, ...args}) => {
        const pointerCollisions = pointerWithin({droppableContainers, ...args});
        if (pointerCollisions.length > 0) {
            if (pointerCollisions.some(item => item.id === "selfCardsArea")) { // Uses closestCenter to sort when in the sortable area
                const sortableContainers = droppableContainers.filter(item => indeces.includes(item.id));
                return closestCenter({droppableContainers: sortableContainers, ...args});
            }
            return pointerCollisions;
        }

        return [];
    }


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

        const activeType = active.data.current.type;

        if (activeType === "card" && selfCardIds.includes(over.id)) {
            setSelfCardIds((prev) => {
                const oldIndex = prev.indexOf(activeId);
                const newIndex = prev.indexOf(over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }

        setDraggingStyle({});
        setActiveId(null);
    }

    return (
        <DndContext
            modifiers={[restrictToWindowEdges]}
            sensors={sensors}
            collisionDetection={customCollisionDetectionAlgorithm}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
        >
            <div className="hanabiPage entirePage select-none z-[0] text-slate-200">
                <div className="absolute flex flex-col left-[3%] gap-[2%] h-[30%]">
                    <div className="flex h-full items-center gap-[10px] text-[30px]">
                        <FaHeart className="text-red-500"/>
                        <div>{lives}</div>
                    </div>
                    <div className="flex h-full items-center gap-[10px] text-[30px]">
                        <HanabiClueToken />

                        <div>{clueTokens}/{maxClueTokens}</div>
                    </div>
                    <div className="flex h-full items-center gap-[10px] text-[30px]">
                        <CardBacking width={30}/>
                        <div>{cardsRemaining}</div>
                    </div>
                </div>

                <div className="absolute top-[2%] right-[2%]">
                    <GiNotebook className="text-[40px] text-slate-300"/>
                </div>

                <div className="flex justify-evenly items-center w-full h-[30vh]">
                    <HanabiPlayer playerData={playerCount >= 4 ? playersData[adjustedIndex(2)] : playersData[adjustedIndex(1)]}/>
                    { (playerCount === 3 || playerCount === 5) &&
                        <HanabiPlayer playerData={playerCount === 3 ? playersData[adjustedIndex(2)] : playersData[adjustedIndex(3)]}/>
                    }               
                </div>
                <div className="flex justify-evenly items-center w-full h-[38vh]">
                    { playerCount >= 4 &&
                        <HanabiPlayer playerData={playersData[adjustedIndex(1)]}/>
                    }

                    <HanabiPlayPile />

                    { playerCount >= 4 &&
                        <HanabiPlayer playerData={playersData[adjustedIndex(playerCount - 1)]}/>
                    }
                </div>

                <div className="flex items-center h-[32%] w-full">
                    <HanabiDiscardPile cards={discardPileCards} 
                                       cardWidth={discardCardWidth} 
                    />

                    <HanabiSelfCards selfCardIds={selfCardIds} 
                                     cardWidth={selfCardWidth}
                                     cards={myCards}
                                     indeces={indeces}
                    />
                    <HanabiTokenArea tokenSize={tokenSize}/>
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
                            draggingCard ?
                                <HanabiCard number={draggingCard.number} 
                                        suit={draggingCard.suit}
                                        width={selfCardWidth}
                                />
                            :
                                <HanabiClueToken size={tokenSize}/>
                            }
                        </div>
                    ) : null}
                </DragOverlay>

                <div className="entirePage bg-black/80 z-[-10]"></div>

            </div>

        </DndContext>
        
    )
}