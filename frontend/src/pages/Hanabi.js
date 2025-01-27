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
import { useEffect, useState } from "react";
import { HanabiSelfCards } from "../components/hanabi/HanabiSelfCards";
import { HanabiDiscardPile } from "../components/hanabi/HanabiDiscardPile";
import { HanabiTokenArea } from "../components/hanabi/HanabiTokenArea";
import getSocket from "../socket";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { set } from "react-hook-form";
import { Overlay } from "../components/Overlay";
import { HanabiGiveClueOverlay } from "../components/hanabi/HanabiGiveClueOverlay";
import { HanabiShowClueOverlay } from "../components/hanabi/HanabiShowClueOverlay";
import { HanabiHistoryLog } from "../components/hanabi/HanabiHistoryLog";
import { HanabiSettings } from "../components/hanabi/HanabiSettings";
import { InfoButton } from "../components/InfoButton";

// TODO
/*
Animation to know whos turn it is (hourglass thing)

Add endgame and play again screen
Animation for playing and discarding cards
Better swap card animation


Write rules


*/

const socket = getSocket();

const tokenSize = 45;
const discardCardWidth = 80;
const selfCardWidth = 100;
export const Hanabi = ({roomCode}) => {
    const [rerender, setRerender] = useState(false);

    const triggerRerender = () => {
        setRerender(!rerender);
    }

    const [dataInitialized, setDataInitialized] = useState(false);

    const navigate = useNavigate();

    const [lives, setLives] = useState(3);
    const [tokenCount, setTokenCount] = useState(8);
    const [cluePlayer, setCluePlayer] = useState(null);
    const [currentClue, setCurrentClue] = useState(null);
    const [history, setHistory] = useState([]);
    const [turn, setTurn] = useState(0);

    const maxClueTokens = 8;

    const [cardsRemaining, setCardsRemaining] = useState(50);

    const [playersData, setPlayersData] = useState({})
    const [playersDataArray, setPlayersDataArray] = useState([])
    const [playPile, setPlayPile] = useState({"red": 0, "yellow": 0, "green": 0, "blue": 0, "purple": 0});
    const [discardPileCards, setDiscardPileCards] = useState([]);
    const playerCount = playersDataArray.length;
    const selfIndex = playersDataArray.findIndex((player) => player.nameData.userId === socket.userId);

    const adjustedIndex = (index) => {
        return (selfIndex + index) % playerCount
    }

    const [myCards, setMyCards] = useState([])
    const [selfCardIds, setSelfCardIds] = useState([]);

    useEffect(() => {
        socket.on('receive_players_data', (playersData) => {
            setPlayersData(playersData);
            setPlayersDataArray(Object.values(playersData));
            const myCards = playersData[socket.userId].cards
            setMyCards(myCards);
            setSelfCardIds(myCards.map((card) => `Card${card.id}`))

            setDataInitialized(true);
        });

        socket.on('receive_token_count', (tokenCount) => {
            setTokenCount(tokenCount);
        });

        socket.on('receive_discard_pile', (discardPile) => {
            setDiscardPileCards(discardPile);
        });

        socket.on('receive_play_pile', (playPile) => {
            setPlayPile(playPile);
        });

        socket.on('receive_deck_count', (deckCount) => {
            setCardsRemaining(deckCount);
        });

        socket.on('receive_lives', (lives) => {
            setLives(lives);
        });

        socket.on('receive_history', (history) => {
            setHistory(history);
        });

        socket.on('receive_turn', (turn) => {
            setTurn(turn);
        });

        socket.on('receive_clue', (sender, receiver, chosenClue) => { // Sender is the senders nickname while receiver is the receivers userId
            setCurrentClue({sender, receiver, chosenClue})
        })

        socket.on('room_error', (errorMessage) => {
            navigate(`/hana/lobby`, { state: {error: errorMessage}});
        });

        socket.emit('join_room', roomCode);
        socket.emit('get_all_hanabi_data', roomCode);

        return () => {
            socket.off('receive_own_cards');
            socket.off('room_error');
            socket.off('receive_players_data');
            socket.off('receive_token_count');
            socket.off('receive_discard_pile');
            socket.off('receive_play_pile');
            socket.off('receive_lives');
            socket.off('receive_clue');
            socket.off('receive_turn');
            socket.off('receive_history');
        }
    }, [])

    const [activeId, setActiveId] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const [draggingStyle, setDraggingStyle] = useState({});

    /*
    let draggingCard = null;
    if (activeId && indeces.includes(activeId)) {
        draggingCard = myCards[indeces.indexOf(activeId)];
    }
    */

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
                const sortableContainers = droppableContainers.filter((item) => {
                    return item.data.current && item.data.current.type === "card";
                });

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
        if (event.active.data.current.type) {
            setActiveType(event.active.data.current.type);
            if (event.active.data.current.type === "card") {
                const card = myCards.find((card) => `Card${card.id}` === event.active.id);
                setActiveCard(card);
            }
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

        const overType = over.data.current ? over.data.current.type : null;

        if (activeType === "card" && overType === "card") { // Change card order
            setSelfCardIds((prev) => {
                const oldIndex = prev.findIndex((id) => activeId === id);
                const newIndex = prev.findIndex((id) => over.id ===  id);
                if (oldIndex === newIndex) {
                    return prev;
                }

                socket.emit("hanabi_change_card_order", roomCode, oldIndex, newIndex, prev[oldIndex]);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }

        if (activeType === "card" && over.id === "discardPileArea" && isMyTurn) { // Discard card
            setSelfCardIds(selfCardIds.filter((id) => id !== activeId));
            socket.emit("hanabi_discard_card", roomCode, activeId);
        }

        if (activeType === "card" && over.id === "playPileArea" && isMyTurn) { // PLay card
            setSelfCardIds(selfCardIds.filter((id) => id !== activeId));
            socket.emit("hanabi_play_card", roomCode, activeId);
        }

        if (activeType === "token" && overType === "player" && isMyTurn) { // Give Clue
            setCluePlayer(over.id);
        }

        setDraggingStyle({});
        setActiveId(null);
        setActiveType(null);
        setActiveCard(null)
    }

    if (!dataInitialized) {
        return <LoadingScreen />;
    }

    const turnPlayer = playersDataArray[turn].nameData.userId;
    const isMyTurn = turn === selfIndex;

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
                { cluePlayer &&
                    <HanabiGiveClueOverlay roomCode={roomCode}
                                           cluePlayer={cluePlayer} 
                                           setCluePlayer={setCluePlayer} 
                                           playersDataArray={playersDataArray} 
                    />
                }

                { currentClue &&
                    <HanabiShowClueOverlay currentClue={currentClue}  
                                           setCurrentClue={setCurrentClue}
                                           playersDataArray={playersDataArray} 
                    />
                }


                <div className="absolute flex flex-col left-[3%] gap-[2%] h-[30%]">
                    <div className="flex h-full items-center gap-[10px] text-[30px]">
                        <FaHeart className="text-red-500"/>
                        <div>{lives}</div>
                    </div>
                    <div className="flex h-full items-center gap-[10px] text-[30px]">
                        <HanabiClueToken />

                        <div>{tokenCount}/{maxClueTokens}</div>
                    </div>
                    <div className="flex h-full items-center gap-[10px] text-[30px]">
                        <CardBacking width={30}/>
                        <div>{cardsRemaining}</div>
                    </div>
                </div>

                <div className="topTaskBar">
                    <InfoButton buttonType="settings">
                        <HanabiSettings triggerRerender={triggerRerender}/>
                    </InfoButton>
                </div>

                <div className="flex justify-evenly items-center w-full h-[30vh]">
                    <HanabiPlayer playerData={playerCount >= 4 ? playersDataArray[adjustedIndex(2)] : playersDataArray[adjustedIndex(1)]} turnPlayer={turnPlayer}/>
                    { (playerCount === 3 || playerCount === 5) &&
                        <HanabiPlayer playerData={playerCount === 3 ? playersDataArray[adjustedIndex(2)] : playersDataArray[adjustedIndex(3)]} turnPlayer={turnPlayer}/>
                    }               
                </div>
                <div className="flex justify-evenly items-center w-full h-[38vh]">
                    { playerCount >= 4 &&
                        <HanabiPlayer playerData={playersDataArray[adjustedIndex(1)]} turnPlayer={turnPlayer}/>
                    }

                    <HanabiPlayPile playPile={playPile} turnPlayer={turnPlayer}/>

                    { playerCount >= 4 &&
                        <HanabiPlayer playerData={playersDataArray[adjustedIndex(playerCount - 1)]} turnPlayer={turnPlayer}/>
                    }
                </div>

                <div className="flex items-center h-[32%] w-full">
                    <div className="flex flex-col gap-[30px] w-[30vw] h-full">

                        <HanabiTokenArea tokenCount={tokenCount}
                                        tokenSize={tokenSize}
                        />
                        <HanabiDiscardPile cards={discardPileCards} 
                                            cardWidth={discardCardWidth}
                                            turnPlayer={turnPlayer} 
                        />
                    </div>


                    <HanabiSelfCards cardWidth={selfCardWidth}
                                     cards={myCards}
                                     selfCardIds={selfCardIds}
                                     isMyTurn={isMyTurn}
                    />
                    <div className="flex w-[30vw] h-full items-center justify-center">
                        <HanabiHistoryLog history={history} playersData={playersData}/>
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
                            (activeType === "card" && activeCard) ?
                                <HanabiCard number={!(activeCard.numberVisible || activeCard.suitVisible) ? "" : (activeCard.numberVisible ? activeCard.number : "unknown")} 
                                        suit={!(activeCard.numberVisible || activeCard.suitVisible) ? "" : (activeCard.suitVisible ? activeCard.suit : "unknown")}
                                        width={selfCardWidth}
                                />
                            : activeType === "token" ?
                                <HanabiClueToken size={tokenSize}/>
                            :
                            <div>TESTING</div>
                            }
                        </div>
                    ) : null}
                </DragOverlay>

                <div className="entirePage bg-black/80 z-[-10]"></div>

            </div>

        </DndContext>
        
    )
}