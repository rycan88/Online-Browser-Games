import "../css/ThirtyOne.css"

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHandBackFist } from "react-icons/fa6";

import getSocket from "../socket";

import { Card } from "../components/card/Card";
import LoadingScreen from "../components/LoadingScreen";
import { ThirtyOnePlayer } from "../components/thirty-one/ThirtyOnePlayer";
import { ThirtyOnePlayerDisplay } from "../components/thirty-one/ThirtyOnePlayerDisplay";
import { ThirtyOneResultsScreen } from "../components/thirty-one/ThirtyOneResultsScreen";
import CardBacking from "../components/card/CardBacking";
import { Pile } from "../components/card/Pile";
import { getLastElementPosition, getPlayerCoord } from "../components/thirty-one/ThirtyOneUtils";
import { MovingElement } from "../components/thirty-one/MovingElement";


// TODO
// Display current number of cards in deck
// Bonus: Show cards being dealt, first card being flipped

const socket = getSocket();

const MIDDLE_CARD_WIDTH = 150;
const MY_CARD_WIDTH = 180;
const PICK_UP_DURATION = 400;
const DISCARD_DURATION = 600;

export const ThirtyOne = ({roomCode}) => {
    const navigate = useNavigate();

    const [myCards, setMyCards] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [dataInitialized, setDataInitialized] = useState(false);
    const [turn, setTurn] = useState(0);
    const [currentPlayers, setCurrentPlayers] = useState([]);
    const [knockPlayer, setKnockPlayer] = useState(null); // index of the player who knocked
    const [shouldShowResults, setShouldShowResults] = useState(false);
    const [playersData, setPlayersData] = useState({});
    const [deckCount, setDeckCount] = useState(52);

    // Card Animation
    const [arrayOfElements, setArrayOfElements] = useState([]);
    const playerCount = currentPlayers.length;
    const selfIndex = currentPlayers.findIndex((player) => player.nameData.userId === socket.userId);
    const playerTurn = Math.floor(turn) % playerCount;
    const isMyTurn = playerTurn === selfIndex;
    const hasPicked = turn % 1 !== 0;
    
    const removeMovingElement = (id) => {
        setArrayOfElements((prevCards) => prevCards.filter((card) => card.props.id !== id));
    }

    const addMovingElement = (element) => {
        setArrayOfElements((prevCards) => [...prevCards, element]);
    }

    const getSelfCardsPosition = (elementWidth, elementHeight) => {
        if (!currentPlayers) { return; }

        let position = isMyTurn ? getLastElementPosition(".selfCards") : getPlayerCoord(playerCount, playerTurn, selfIndex);
        if (!isMyTurn) {
            position.left -= elementWidth / 2;
            position.top -= elementHeight / 2;
        } else {
            position.left -= 50;
        }
        return position;
    }


    useEffect(() => {
        socket.on('receive_own_cards', (cardArray) => {
            setMyCards(cardArray);
            setDataInitialized(true);
        });

        socket.on('receive_discard_pile', (discardPile, id) => {
            if (id && socket.id === id) {return; }
            setDiscardPile(discardPile);
        });

        socket.on("receive_turn", (turn) => {
            setTurn(turn);
        });

        socket.on("receive_deck_count", (count) => {
            setDeckCount(count);
        });

        socket.on("receive_players", (currentPlayers) => {
            setCurrentPlayers(currentPlayers);
        });

        socket.on("receive_knock_player", (knockPlayer) => {
            setKnockPlayer(knockPlayer);
        });

        socket.on("player_knocked", (nickname) => {
            //alert(`${nickname} has knocked. Everyone else gets 1 more turn`);
        });

        socket.on("receive_should_show_results", (shouldShowResults) => {
            setShouldShowResults(shouldShowResults);
        });

        socket.on("receive_players_data", (playersData) => {
            setPlayersData(playersData);
        })

        socket.on("start_new_round", () => {
            socket.emit('get_all_thirty_one_data', roomCode);
        })

        socket.on('room_error', (errorMessage) => {
            navigate(`/thirty_one/lobby`, { state: {error: errorMessage}});
        });

        socket.emit('join_room', roomCode);
        socket.emit('get_all_thirty_one_data', roomCode);

        return () => {
            socket.off('receive_own_cards');
            socket.off('receive_discard_pile');
            socket.off('receive_player_turn');
            socket.off('receive_players');
            socket.off('receive_deck_count');
            socket.off('receive_players_data');
            socket.off('receive_picked_card');
            socket.off('receive_roundEnd');
            socket.off('player_knocked');
            socket.off('start_new_round');
            socket.off('player_picked_up');
            socket.off('room_error');
        };
    }, []);


    useEffect(() => {
        if (!currentPlayers) { return; }

        socket.on("deck_pick_up", () => {
            const cardWidth = isMyTurn ? MY_CARD_WIDTH : 150;
            const selfCardsPosition = getSelfCardsPosition(cardWidth, cardWidth * 1.5);
            const element = <MovingElement id={Date.now()} 
                                            element={<CardBacking width={cardWidth}/>} 
                                            startPosition={getLastElementPosition(".thirtyOneDeck")}
                                            animationEndPosition={selfCardsPosition} 
                                            animationEndCall={() => {
                                                socket.emit('thirty_one_get_own_cards', roomCode);
                                                !isMyTurn && socket.emit('thirty_one_get_turn', roomCode);
                                            }}
                                            removeMovingElement={removeMovingElement}
                                            transitionDuration={isMyTurn ? PICK_UP_DURATION : DISCARD_DURATION}/>
            addMovingElement(element);
            socket.emit('thirty_one_get_deck_count', roomCode);
            isMyTurn && socket.emit('thirty_one_get_turn', roomCode);
        });

        socket.on("discard_pile_pick_up", (card) => {
            const cardWidth = isMyTurn ? MY_CARD_WIDTH : 150;
            const selfCardsPosition = getSelfCardsPosition(cardWidth, cardWidth * 1.5);

            const element = <MovingElement id={Date.now()} 
                                            element={<Card number={card.number} suit={card.suit} width={cardWidth}/>} 
                                            startPosition={getLastElementPosition(".thirtyOneDiscardPile")}
                                            animationEndPosition={selfCardsPosition} 
                                            animationEndCall={() => {
                                                socket.emit('thirty_one_get_own_cards', roomCode);
                                                !isMyTurn && socket.emit('thirty_one_get_turn', roomCode);
                                            }}
                                            removeMovingElement={removeMovingElement}
                                            transitionDuration={isMyTurn ? PICK_UP_DURATION : DISCARD_DURATION}/>
            addMovingElement(element);
            socket.emit('thirty_one_get_discard_pile', roomCode);
            isMyTurn && socket.emit('thirty_one_get_turn', roomCode);
        });

        socket.on("card_discarded", (card) => {
            if (isMyTurn) { return; } 
            const cardWidth = MIDDLE_CARD_WIDTH;
            const selfCardsPosition = getSelfCardsPosition(cardWidth, cardWidth * 1.5);

            const element = <MovingElement id={Date.now()} 
                                            element={<Card number={card.number} suit={card.suit} width={cardWidth}/>} 
                                            startPosition={selfCardsPosition}
                                            animationEndPosition={getLastElementPosition(".thirtyOneDiscardPile")} 
                                            animationEndCall={() => {
                                                socket.emit('thirty_one_get_discard_pile', roomCode);
                                                socket.emit('thirty_one_get_turn', roomCode);
                                            }}
                                            removeMovingElement={removeMovingElement}
                                            transitionDuration={DISCARD_DURATION}/>
            addMovingElement(element);
        });

        return () => {
            socket.off("deck_pick_up");
            socket.off("discard_pile_pick_up");
            socket.off("card_discarded");
        };
    }, [arrayOfElements, roomCode, currentPlayers, turn]);

    if (!dataInitialized || currentPlayers.length === 0) {
        return <LoadingScreen roomCode={roomCode} playersData={playersData}/>;
    }


    
    const getTooltip = () => {
        let text = "";
        if (knockPlayer != null) {
            text = "Another player has already knocked";
        } else if (turn < playerCount) {
            text = "Cannot knock before a full rotation.";
        } else {
            return <></>;
        }

        return (
            <span className="tooltip w-[150px]">
                {text}
            </span>
        )
    }

    const knock = () => {
        socket.emit('thirty_one_knock', roomCode);
    }

    if (shouldShowResults && arrayOfElements.length === 0) {
        return <ThirtyOneResultsScreen roomCode={roomCode} playersData={playersData}/>
    }

    const canKnock = isMyTurn && !hasPicked && turn >= playerCount && knockPlayer === null;



    return (
        <div className="thirtyOnePage entirePage">
            <ThirtyOnePlayerDisplay selfIndex={selfIndex} currentPlayers={currentPlayers} playerTurn={playerTurn} knockPlayer={knockPlayer} hasPicked={hasPicked}/>

            <div className="flex flex-col absolute top-[20%] items-center justify-center w-full gap-5">
                <div className="text-white text-3xl">{isMyTurn ? (hasPicked ? "Discard a card" : `Draw a card ${canKnock ? "or knock" : ""}`) : `${currentPlayers[playerTurn].nameData.nickname}'s turn`}</div>

                <div className="middleCards flex gap-6 w-full justify-center">
                    <Pile 
                        name="thirtyOneDeck"
                        pile={deckCount > 0 ? [...Array(Number(deckCount))] : []}
                        canPick={isMyTurn && !hasPicked}
                        clickEvent={() => {      
                            socket.emit("thirty_one_pick_up_deck_card", roomCode);
                        }}
                        pileElement={(card, index) => {
                            return <CardBacking width={MIDDLE_CARD_WIDTH}/>
                        }}
                    />

                    <Pile 
                        name="thirtyOneDiscardPile"
                        pile={discardPile}
                        canPick={isMyTurn && !hasPicked}
                        clickEvent={() => {                  
                            socket.emit("thirty_one_pick_up_discard_card", roomCode);
  

                        }}
                        pileElement={(card, index) => {
                            return <Card number={card.number} suit={card.suit} width={MIDDLE_CARD_WIDTH}/>
                        }}
                    />
                </div>
 
            </div>

            <div className="flex absolute bottom-[35%] items-center justify-center w-full">
                { selfIndex >= 0 &&
                    <ThirtyOnePlayer name={socket.nickname} lives={currentPlayers[selfIndex].lives} isTurn={isMyTurn} didKnock={selfIndex === knockPlayer} hasPicked={hasPicked}/>
                }                 
            </div>
            
            { isMyTurn && !hasPicked &&
                <div className="absolute group bottom-[60px] left-[75%] rounded-full">
                    <button className={`knockButton gradientButton`}
                            onClick={() => {
                                knock();
                            }}
                            disabled={!canKnock}
                    >
                        <FaHandBackFist />
                    </button>
                    { getTooltip() }

                </div>
            }

            <div className="selfCards">
                {myCards.map((card, index) => {
                    return (
                        <div className={`${isMyTurn && hasPicked && "hover:hoverAnimation"}`} 
                            onClick={(e) => { 
                                if (!(isMyTurn && hasPicked)) { return; }
                                socket.emit("thirty_one_discard_card", roomCode, card);

                                const cardWidth = MIDDLE_CARD_WIDTH;

                                const rect = e.target.getBoundingClientRect();
                                const element = <MovingElement id={Date.now()} 
                                                                element={<Card number={card.number} suit={card.suit} width={cardWidth}/>} 
                                                                startPosition={{left: rect.left, top: rect.top}}
                                                                animationEndPosition={getLastElementPosition(".thirtyOneDiscardPile")} 
                                                                animationEndCall={() => {
                                                                    socket.emit('thirty_one_get_discard_pile', roomCode);
                                                                }}
                                                                removeMovingElement={removeMovingElement}
                                                                transitionDuration={DISCARD_DURATION}/>
                                addMovingElement(element);
                                socket.emit('thirty_one_get_own_cards', roomCode);
                                socket.emit('thirty_one_get_turn', roomCode);
                            }} 
                        >
                            
                            <Card number={card.number} 
                                    suit={card.suit}
                                    width={MY_CARD_WIDTH}
                            />
                        </div>
                    );
                })}
            </div>

            {arrayOfElements.map((element, index) => {
                return element;
            })}
        </div>
    );
}