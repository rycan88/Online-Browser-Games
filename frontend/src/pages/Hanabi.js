import { FaHeart } from "react-icons/fa6";
import "../css/Hanabi.css";
import { HanabiCard } from "../components/hanabi/HanabiCard";
import { HanabiPlayer } from "../components/hanabi/HanabiPlayer";
import { HanabiPlayPile } from "../components/hanabi/HanabiPlayPile";
import CardBacking from "../components/card/CardBacking";
import { HanabiClueToken } from "../components/hanabi/HanabiClueToken";
import { GiNotebook } from "react-icons/gi";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, MouseSensor, PointerSensor, pointerWithin, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { createContext, useEffect, useState } from "react";
import { HanabiSelfCards } from "../components/hanabi/HanabiSelfCards";
import { HanabiDiscardPile } from "../components/hanabi/HanabiDiscardPile";
import { HanabiTokenArea } from "../components/hanabi/HanabiTokenArea";
import getSocket from "../socket";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { Overlay } from "../components/Overlay";
import { HanabiGiveClueOverlay } from "../components/hanabi/HanabiGiveClueOverlay";
import { HanabiShowClueOverlay } from "../components/hanabi/HanabiShowClueOverlay";
import { HanabiHistoryLog } from "../components/hanabi/HanabiHistoryLog";
import { HanabiSettings } from "../components/hanabi/HanabiSettings";
import { InfoButton } from "../components/InfoButton";
import { MdVisibility } from "react-icons/md";
import { HanabiHintVisibilityButton } from "../components/hanabi/HanabiHintVisibilityButton";
import { HanabiEndOverlay } from "../components/hanabi/HanabiEndOverlay";
import { FullscreenButton } from "../components/FullscreenButton";
import useFullscreen from "../hooks/useFullscreen";
import { NotLandscapeWarningPage } from "../components/NotLandscapeWarningPage";
import { useOrientation } from "../hooks/useOrientation";
import { HanabiNewGameButton } from "../components/hanabi/HanabiNewGameButton";
import { HanabiSurrenderDisplay } from "../components/hanabi/HanabiSurrenderDisplay";

// TODO
/*
End game if no more points can be gotten
Add lose life animation
Add sound effects
ADd restart button

Pop up for if trying to discard and there are 8 tokens
History rewind

Animation for playing and discarding cards
Better swap card animation


Write rules
BUGS:
Correct sizing for mobile not fullscreen
Bottom cards and history moves when history is filled
History scroll bar position doesnt move to the bottom when a new action is made
*/

const socket = getSocket();
export const HanabiContext = createContext();

export const Hanabi = ({roomCode}) => {
    const [rerender, setRerender] = useState(false);
    const orientation = useOrientation();

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
    const [gameInProgress, setGameInProgress] = useState(true);
    const [turn, setTurn] = useState(0);
    const [endScore, setEndScore] = useState(null);
    const [finalPlayer, setFinalPlayer] = useState(null);
    const [gameMode, setGameMode] = useState("standard");

    const maxClueTokens = 8;

    const [cardsRemaining, setCardsRemaining] = useState(50);

    const [playersData, setPlayersData] = useState({})
    const [playersDataArray, setPlayersDataArray] = useState([])
    const [playPile, setPlayPile] = useState({"red": 0, "yellow": 0, "green": 0, "blue": 0, "purple": 0});
    const [discardPileCards, setDiscardPileCards] = useState([]);
    const playerCount = playersDataArray.length;
    const selfIndex = playersDataArray.findIndex((player) => player.nameData.userId === socket.userId);

    const [showTeammateHints, setShowTeammateHints] = useState(false);

    const adjustedIndex = (index) => {
        return (selfIndex + index) % playerCount
    }

    const [myCards, setMyCards] = useState([])
    const [selfCardIds, setSelfCardIds] = useState([]);

    // Sizing
    const [selfCardWidth, setSelfCardWidth] = useState(Math.min((window.innerHeight * 0.157) * (2/3), window.innerWidth * 0.05)) //100px
    const [playCardWidth, setPlayCardWidth] = useState(Math.min((window.innerHeight * 0.157) * (2/3), window.innerWidth * 0.05)) //100px
    const [discardCardWidth, setDiscardCardWidth] = useState(Math.min((window.innerHeight * 0.126) * (2/3), window.innerWidth * 0.041)) //80px
    const [clueCardWidth, setClueCardWidth] = useState(Math.min((window.innerHeight * 0.236) * (2/3), window.innerWidth * 0.078)) //150px
    const [tokenSize, setTokenSizeWidth] = useState(Math.min((window.innerHeight * 0.075) * (2/3), window.innerWidth * 0.025)); // 50px

    useEffect(() => {
        const handleResize = () => {
            setSelfCardWidth(Math.min((window.innerHeight * 0.157) * (2/3), window.innerWidth * 0.05));
            setPlayCardWidth(Math.min((window.innerHeight * 0.157) * (2/3), window.innerWidth * 0.05));
            setDiscardCardWidth(Math.min((window.innerHeight * 0.126) * (2/3), window.innerWidth * 0.041));
            setClueCardWidth(Math.min((window.innerHeight * 0.236) * (2/3), window.innerWidth * 0.078));
            setTokenSizeWidth(Math.min((window.innerHeight * 0.075) * (2/3), window.innerWidth * 0.025));
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])

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

        socket.on('receive_final_player', (finalPlayer) => {
            setFinalPlayer(finalPlayer);
        });

        socket.on('receive_game_mode', (gameMode) => {
            setGameMode(gameMode);
        });

        socket.on('receive_clue', (sender, receiver, chosenClue) => { // Sender is the senders nickname while receiver is the receivers userId
            setCurrentClue({sender, receiver, chosenClue})
        })

        socket.on('receive_game_in_progress', (gameInProgress) => {
            setGameInProgress(gameInProgress);
        });

        socket.on('game_has_ended', (totalPoints) => {
            setGameInProgress(false);
            setEndScore(totalPoints);
            setTimeout(() => {
                setEndScore(null);
            }, 3000);
        });

        socket.on('start_new_round', () => {
            socket.emit('get_all_hanabi_data', roomCode);
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
            socket.off('receive_game_mode');
            socket.off('receive_token_count');
            socket.off('receive_discard_pile');
            socket.off('receive_play_pile');
            socket.off('receive_lives');
            socket.off('receive_clue');
            socket.off('receive_turn');
            socket.off('receive__final_turn');
            socket.off('receive_history');
            socket.off('receive_game_in_progress');
            socket.off('game_has_ended');
            socket.off('start_new_round');
        }
    }, [])

    const [activeId, setActiveId] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const [draggingStyle, setDraggingStyle] = useState({});
    const [storedDiscardCard, setStoredDiscardCard] = useState(null);

    const discardStoredCard = () => {
        setSelfCardIds(selfCardIds.filter((id) => id !== storedDiscardCard));
        socket.emit("hanabi_discard_card", roomCode, storedDiscardCard);
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
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
            if (tokenCount < maxClueTokens) {
                setSelfCardIds(selfCardIds.filter((id) => id !== activeId));
                socket.emit("hanabi_discard_card", roomCode, activeId);
            } else {
                setStoredDiscardCard(activeId);
            }
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

    const isFullscreen = useFullscreen();

    if (!dataInitialized) {
        return <LoadingScreen />;
    }

    if (orientation !== "landscape") {
        return <NotLandscapeWarningPage />
    }

    const turnPlayer = playersDataArray[turn].nameData.userId;
    const isMyTurn = turn === selfIndex;

    if (!isMyTurn && storedDiscardCard) {
        setStoredDiscardCard(null);
    }

    return (
        <HanabiContext.Provider value={{ turnPlayer, showTeammateHints, finalPlayer, gameInProgress }}>
            <DndContext
                modifiers={[restrictToWindowEdges]}
                sensors={sensors}
                collisionDetection={customCollisionDetectionAlgorithm}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragMove={handleDragMove}
            >
                <div className={`hanabiPage entirePage select-none z-[0] text-slate-200 ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}>
                    { cluePlayer &&
                        <HanabiGiveClueOverlay roomCode={roomCode}
                                            cluePlayer={cluePlayer} 
                                            setCluePlayer={setCluePlayer} 
                                            playersDataArray={playersDataArray} 
                                            cardWidth={clueCardWidth}
                                            gameMode={gameMode}
                                            isFullscreen={isFullscreen}
                        />
                    }

                    { currentClue &&
                        <HanabiShowClueOverlay currentClue={currentClue}  
                                            setCurrentClue={setCurrentClue}
                                            playersDataArray={playersDataArray}
                                            cardWidth={clueCardWidth} 
                                            isFullscreen={isFullscreen}
                        />
                    }
                    {
                        (endScore !== null) && 
                            <HanabiEndOverlay endScore={endScore}
                                              isFullscreen={isFullscreen}
                            />
                    }
                    
                    <div className="absolute flex flex-col gap-[2%] left-[3%] h-[20%] w-[min(120px,6vw)]">
                        <div className="flex h-full w-full items-center gap-[10px] text-[3vh]">
                            <div className="flex w-[40%] justify-center items-center text-[3.5vh]"><FaHeart className="text-red-500"/></div>
                            <div className={lives <= 1 && "text-red-600"}>{lives}</div>
                        </div>

                        <div className="flex h-full w-full items-center gap-[10px] text-[3vh]">
                            <div className="flex w-[40%] justify-center items-center"><CardBacking width={tokenSize * 0.8}/></div>
                            <div className={cardsRemaining <= 3 && "text-red-600"}>{cardsRemaining}</div>
                        </div>
                        { 0 < cardsRemaining && cardsRemaining <= 3 &&
                            <div className="absolute w-full text-left -bottom-[5vh] text-[1.5vh] ">Only {cardsRemaining} card{cardsRemaining !== 1 && "s"} remaining!</div>
                        }
                    </div>
                    <div className={"absolute flex items-center justify-center w-[30vh] h-[12vh]"}
                         style={{top: "8vh", right: (playerCount === 2 || playerCount === 4) && "5vw"}} 
                    >
                        { !gameInProgress ?
                            <HanabiNewGameButton roomCode={roomCode} playersData={playersData}/>
                        :
                            <HanabiSurrenderDisplay roomCode={roomCode} playersDataArray={playersDataArray} selfIndex={selfIndex}/>
                        }
                    </div>

                    <div className="topTaskBar">
                        <HanabiHintVisibilityButton showTeammateHints={showTeammateHints} setShowTeammateHints={setShowTeammateHints}/>
                        <InfoButton buttonType="settings" fullScreen={isFullscreen}>
                            <HanabiSettings triggerRerender={triggerRerender} roomCode={roomCode}/>
                        </InfoButton>
                        <FullscreenButton shouldRotate={true}/>
                    </div>

                    <div className="flex justify-evenly items-center w-full h-[30vh]">
                        <HanabiPlayer playerData={playerCount >= 4 ? playersDataArray[adjustedIndex(2)] : playersDataArray[adjustedIndex(1)]} />
                        { (playerCount === 3 || playerCount === 5) &&
                            <HanabiPlayer playerData={playerCount === 3 ? playersDataArray[adjustedIndex(2)] : playersDataArray[adjustedIndex(3)]} />
                        }               
                    </div>
                    <div className="flex justify-evenly items-center w-full h-[38vh]">
                        { playerCount >= 4 &&
                            <HanabiPlayer playerData={playersDataArray[adjustedIndex(1)]} />
                        }

                        <HanabiPlayPile playPile={playPile} turnPlayer={turnPlayer} cardWidth={playCardWidth} gameMode={gameMode}/>

                        { playerCount >= 4 &&
                            <HanabiPlayer playerData={playersDataArray[adjustedIndex(playerCount - 1)]} />
                        }
                    </div>

                    <div className="flex items-center h-[32%] w-full">
                        <div className="flex flex-col w-[30vw] h-full" 
                            style={{gap: Math.max(tokenSize * 0.8, 20)}}
                        >

                            <HanabiTokenArea tokenCount={tokenCount}
                                            tokenSize={tokenSize}
                            />
                            <HanabiDiscardPile cards={discardPileCards} 
                                                cardWidth={discardCardWidth}
                                                turnPlayer={turnPlayer} 
                                                storedDiscardCard={storedDiscardCard}
                                                setStoredDiscardCard={setStoredDiscardCard}
                                                discardStoredCard={discardStoredCard}
                            />
                        </div>


                        <HanabiSelfCards cardWidth={selfCardWidth}
                                        myData={playersData[socket.userId]}
                                        selfCardIds={selfCardIds}
                                        isMyTurn={isMyTurn}
                                        isFinalPlayer={finalPlayer === socket.userId}
                                        gameInProgress={gameInProgress}
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
                                            suit={!(activeCard.numberVisible || activeCard.suitVisible) ? "" : (activeCard.suitVisible ? (activeCard.suit === "rainbow" ? activeCard.suitVisible : activeCard.suit) : "unknown")}
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

                    <div className={`entirePage bg-black/80 z-[-10] h-[100vh] ${!isFullscreen && "md:h-[calc(100vh-60px)]"}`}></div>

                </div>

            </DndContext>
        </HanabiContext.Provider>
        
    )
}