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
import CardOutline from "../components/card/CardOutline";
import { BsInfoCircleFill } from "react-icons/bs";
import { InfoButton } from "../components/InfoButton";
import { ThirtyOneRules } from "../components/thirty-one/ThirtyOneRules";
import { ThirtyOneSelfCard } from "../components/thirty-one/ThirtyOneSelfCard";
import { ThirtyOneKnockOverlay } from "../components/thirty-one/ThirtyOneKnockOverlay";

// TODO
// Allow users to drag cards
// Add settings to change #lives and rulesets such as starting turn 
// Bonus: Show cards being dealt, first card being flipped

const socket = getSocket();

const NAVBAR_HEIGHT = 60;

export const ThirtyOne = ({roomCode}) => {
    const MIDDLE_CARD_WIDTH = (window.innerHeight * 0.20) * (2/3);
    const MY_CARD_WIDTH = (window.innerHeight * 0.25) * (2/3);
    const PICK_UP_DURATION = 300;
    const DISCARD_DURATION = 600;
    
    const navigate = useNavigate();

    const [myCards, setMyCards] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [dataInitialized, setDataInitialized] = useState(false);
    const [turn, setTurn] = useState(0);
    const [startTurn, setStartTurn] = useState(0);
    const [currentPlayers, setCurrentPlayers] = useState([]);
    const [knockPlayer, setKnockPlayer] = useState(null); // index of the player who knocked
    const [shouldShowResults, setShouldShowResults] = useState(false);
    const [playersData, setPlayersData] = useState({});
    const [deckCount, setDeckCount] = useState(52);

    // Knock animation
    const [knockAnimationPlayer, setKnockAnimationPlayer] = useState(null); // Animation plays only on the turn the player knocks

    // Card Animation
    const [arrayOfElements, setArrayOfElements] = useState([]);
    const playerCount = currentPlayers.length;
    const selfIndex = currentPlayers.findIndex((player) => player.nameData.userId === socket.userId);
    const playerTurn = Math.floor(turn) % playerCount;
    const isMyTurn = playerTurn === selfIndex;
    const hasPicked = turn % 1 !== 0;
    
    const [landscapeMode, setLandscapeMode] = useState(false);

    function checkOrientation() {
        if (window.innerHeight > window.innerWidth) {
          // Device is in portrait mode
          setLandscapeMode(false);
        } else {
            setLandscapeMode(true);
        }
    }

    const removeMovingElement = (cardId) => { // cardId is the timestamp of when the movingCard was created
        if (!cardId) {return; }
        const timeDiff = Date.now() - cardId;
        if (process.env.NODE_ENV === 'production' && timeDiff < 70) { 
            console.log("TOO SHORT", timeDiff); 
            return; 
        }
        setArrayOfElements((prevCards) => prevCards.filter((card) => card.props.id !== cardId));
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
            position.left += elementWidth / 2;
        }

        return position;
    }

    useEffect(() => {
        window.scrollTo(0, NAVBAR_HEIGHT);
    }, [landscapeMode]);

    useEffect(() => {
        socket.on('receive_own_cards', (cardArray, cardId) => {
            setMyCards(cardArray);
            removeMovingElement(cardId);
            setDataInitialized(true);
        });

        socket.on('receive_discard_pile', (discardPile, cardId) => {
            setDiscardPile(discardPile);
            removeMovingElement(cardId);
        });

        socket.on("receive_turn", (turn) => {
            setTurn(turn);
        });

        socket.on("receive_start_turn", (turn) => {
            setStartTurn(turn);
        });

        socket.on("receive_deck_count", (count) => {
            setDeckCount(count);
        });

        socket.on("receive_players", (currentPlayers) => {
            setCurrentPlayers(currentPlayers);
            setDataInitialized(true);
        });

        socket.on("receive_knock_player", (knockPlayer) => {
            setKnockPlayer(knockPlayer);
        });

        socket.on("player_knocked", (nickname) => {
            setKnockAnimationPlayer(nickname);
            console.log(nickname)
            setTimeout(() => {
                setKnockAnimationPlayer(null);
            }, 3000);
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
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('load', checkOrientation);
        checkOrientation();

        return () => {
            socket.off('receive_own_cards');
            socket.off('receive_discard_pile');
            socket.off('receive_turn');
            socket.off('receive_start_turn');
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
    }, [shouldShowResults]);


    useEffect(() => {
        if (!currentPlayers) { return; }

        socket.on("deck_pick_up", () => {
            const cardWidth = isMyTurn ? MY_CARD_WIDTH : MIDDLE_CARD_WIDTH;
            const selfCardsPosition = getSelfCardsPosition(cardWidth, cardWidth * 1.5);

            const cardId = Date.now();
            const element = <MovingElement id={cardId} 
                                            element={<CardBacking width={cardWidth}/>} 
                                            startPosition={getLastElementPosition(".thirtyOneDeck")}
                                            animationEndPosition={selfCardsPosition} 
                                            animationEndCall={() => {
                                                socket.emit('thirty_one_get_own_cards', roomCode, cardId);
                                                !isMyTurn && socket.emit('thirty_one_get_turn', roomCode);
                                            }}
                                            removeMovingElement={removeMovingElement}
                                            transitionDuration={isMyTurn ? PICK_UP_DURATION : DISCARD_DURATION}
            />

            addMovingElement(element);
            socket.emit('thirty_one_get_deck_count', roomCode);
            isMyTurn && socket.emit('thirty_one_get_turn', roomCode);
        });

        socket.on("discard_pile_pick_up", (card) => {
            const cardWidth = isMyTurn ? MY_CARD_WIDTH : MIDDLE_CARD_WIDTH;
            const selfCardsPosition = getSelfCardsPosition(cardWidth, cardWidth * 1.5);

            const cardId = Date.now();
            const element = <MovingElement id={cardId} 
                                            element={<Card number={card.number} suit={card.suit} width={cardWidth}/>} 
                                            startPosition={getLastElementPosition(".thirtyOneDiscardPile")}
                                            animationEndPosition={selfCardsPosition} 
                                            animationEndCall={() => {
                                                socket.emit('thirty_one_get_own_cards', roomCode, cardId);
                                                !isMyTurn && socket.emit('thirty_one_get_turn', roomCode);
                                            }}
                                            removeMovingElement={removeMovingElement}
                                            transitionDuration={isMyTurn ? PICK_UP_DURATION : DISCARD_DURATION}
            />
            addMovingElement(element);
            socket.emit('thirty_one_get_discard_pile', roomCode);
            isMyTurn && socket.emit('thirty_one_get_turn', roomCode);
        });

        socket.on("card_discarded", (card) => {
            if (isMyTurn) { return; } 
            const cardWidth = MIDDLE_CARD_WIDTH;
            const selfCardsPosition = getSelfCardsPosition(cardWidth, cardWidth * 1.5);

            const cardId = Date.now();
            const element = <MovingElement id={cardId} 
                                            element={<Card number={card.number} suit={card.suit} width={cardWidth}/>} 
                                            startPosition={selfCardsPosition}
                                            animationEndPosition={getLastElementPosition(".thirtyOneDiscardPile")} 
                                            animationEndCall={() => {
                                                socket.emit('thirty_one_get_discard_pile', roomCode, cardId);
                                                socket.emit('thirty_one_get_turn', roomCode);
                                            }}
                                            removeMovingElement={removeMovingElement}
                                            transitionDuration={DISCARD_DURATION}
            />
            addMovingElement(element);
        });

        return () => {
            socket.off("deck_pick_up");
            socket.off("discard_pile_pick_up");
            socket.off("card_discarded");
        };
    }, [arrayOfElements, roomCode, currentPlayers, turn]);

    if (!dataInitialized || currentPlayers.length === 0 ) {
        return <LoadingScreen />;
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

    if (shouldShowResults && arrayOfElements.length === 0 && playersData) {
        return <ThirtyOneResultsScreen roomCode={roomCode} playersData={playersData}/>
    }

    const canKnock = isMyTurn && !hasPicked && turn - startTurn >= playerCount && knockPlayer === null;



    if (!landscapeMode) {
        return (
            <div className="rotate-notice">
                Please rotate your device to landscape mode.
            </div>
        );
    }

    return (
        <div className="thirtyOnePage entirePage h-[100vh] md:h-[calc(100vh-60px)]">   
            { knockAnimationPlayer &&
                <ThirtyOneKnockOverlay knockPlayer={knockAnimationPlayer} />
            }

            <InfoButton buttonStyle={"absolute top-[2%] right-[2%]"}>
                <ThirtyOneRules />
            </InfoButton>    

            <ThirtyOnePlayerDisplay selfIndex={selfIndex} currentPlayers={currentPlayers} playerTurn={playerTurn} knockPlayer={knockPlayer} hasPicked={hasPicked}/>

            <div className="flex flex-col absolute bottom-[48%] items-center justify-center w-full gap-5">
                <div className="text-white text-[3vh]">
                    {isMyTurn ? (hasPicked ? "Discard a card" : `Draw a card ${canKnock ? "or knock" : ""}`) : `${currentPlayers[playerTurn].nameData.nickname}'s turn`}
                </div>

                <div className="middleCards flex gap-5 md:gap-6 w-full justify-center">
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
                        cardOutline={<CardOutline width={MIDDLE_CARD_WIDTH}/>}
                        width={MIDDLE_CARD_WIDTH}
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
                        cardOutline={<CardOutline width={MIDDLE_CARD_WIDTH}/>}
                        width={MIDDLE_CARD_WIDTH}
                    />
                </div>
 
            </div>

            <div className="flex absolute bottom-[35%] items-center justify-center w-full">
                { selfIndex >= 0 &&
                    <ThirtyOnePlayer name={socket.nickname} lives={currentPlayers[selfIndex].lives} isTurn={isMyTurn} didKnock={selfIndex === knockPlayer} hasPicked={hasPicked}/>
                }                 
            </div>
            
            { isMyTurn && !hasPicked &&
                <div className="absolute group bottom-[8%] left-[75%] rounded-full">
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
                    return <ThirtyOneSelfCard handLength={myCards.length}
                        card={card}
                        index={index}
                        cardWidth={MY_CARD_WIDTH}
                        canBeHovered={isMyTurn && hasPicked}
                        onClickEvent={ (e) => {
                            if (!(isMyTurn && hasPicked)) { return; }

                            socket.emit("thirty_one_discard_card", roomCode, card);
            
                            const cardWidth = MIDDLE_CARD_WIDTH;
            
                            const rect = e.target.getBoundingClientRect();
                            const cardId = Date.now();
                            const element = <MovingElement id={cardId} 
                                                            element={<Card number={card.number} suit={card.suit} width={cardWidth}/>} 
                                                            startPosition={{left: rect.left, top: rect.top}}
                                                            animationEndPosition={getLastElementPosition(".thirtyOneDiscardPile")} 
                                                            animationEndCall={() => {
                                                                socket.emit('thirty_one_get_discard_pile', roomCode, cardId);
                                                            }}
                                                            removeMovingElement={removeMovingElement}
                                                            transitionDuration={DISCARD_DURATION}/>
                            addMovingElement(element);
            
                            setMyCards(myCards.filter((element) => element.id !== card.id));
                            socket.emit('thirty_one_get_turn', roomCode);
                        }}
                    />
                })}
            </div>

            {arrayOfElements.map((element, index) => {
                return element;
            })}
        </div>
    );
}