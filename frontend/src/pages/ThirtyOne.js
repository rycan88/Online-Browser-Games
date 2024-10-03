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
import { ThirtyOneMovingCard } from "../components/thirty-one/ThirtyOneMovingCard";
import CardBacking from "../components/card/CardBacking";
import { Pile } from "../components/thirty-one/Pile";


// TODO
// Add animation for pick up and discard
// Add jumping card animation when it is a players turn
// Display current number of cards in deck
// Bonus: Show cards being dealt, first card being flipped

const socket = getSocket();

const MIDDLE_CARD_WIDTH = 150;

export const ThirtyOne = ({roomCode}) => {
    const navigate = useNavigate();

    const [myCards, setMyCards] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [movingCardIndex, setMovingCardIndex] = useState(0);
    const [shouldMove, setShouldMove] = useState(false);
    const [dataInitialized, setDataInitialized] = useState(false);
    const [turn, setTurn] = useState(0);
    const [currentPlayers, setCurrentPlayers] = useState(null);
    const [knockPlayer, setKnockPlayer] = useState(null); // index of the player who knocked
    const [shouldShowResults, setShouldShowResults] = useState(false);
    const [playersData, setPlayersData] = useState({});
    const hasPicked = myCards.length === 4;
    const middleRef = useRef(null);

    const [remainingCardCount, setRemainingCardCount] = useState(52);

    const deckCount = 52;
    
    const playCard = (card) => {
        setMyCards(myCards.filter((item) => item !== card))
        setDiscardPile([...discardPile, card])
    }

    useEffect(() => {
        socket.on('receive_own_cards', (cardArray) => {
            setMyCards(cardArray);
            setDataInitialized(true);
        });

        socket.on('receive_discard_pile', (discardPile) => {
            setDiscardPile(discardPile);
        });

        socket.on('receive_picked_card', (newCard) => {
            setMyCards((prevCards) => [...prevCards, newCard])
        });

        socket.on("receive_turn", (turn) => {
            setTurn(turn);
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
            console.log("SHOW", shouldShowResults);
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
            socket.off('receive_players_data');
            socket.off('receive_picked_card');
            socket.off('receive_roundEnd');
            socket.off('player_knocked');
            socket.off('start_new_round');
            socket.off('room_error');
        };
    }, []);

    if (!dataInitialized || !currentPlayers) {
        return <LoadingScreen roomCode={roomCode} playersData={playersData}/>;
    }

    const playerCount = currentPlayers.length;
    const selfIndex = currentPlayers.findIndex((player) => player.nameData.userId === socket.userId);
    const playerTurn = turn % playerCount;
    const isMyTurn = playerTurn === selfIndex;
    
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

    if (shouldShowResults && !shouldMove) {
        return <ThirtyOneResultsScreen roomCode={roomCode} playersData={playersData}/>
    }

    const canKnock = isMyTurn && !hasPicked && turn >= playerCount && knockPlayer === null;

    return (
        <div className="thirtyOnePage entirePage">
            <ThirtyOnePlayerDisplay selfIndex={selfIndex} currentPlayers={currentPlayers} playerTurn={playerTurn} knockPlayer={knockPlayer}/>

            <div className="flex flex-col absolute top-[20%] items-center justify-center w-full gap-5">
                <div className="text-white text-3xl">{isMyTurn ? (hasPicked ? "Discard a card" : `Draw a card ${canKnock ? "or knock" : ""}`) : `${currentPlayers[playerTurn].nameData.nickname}'s turn`}</div>

                <div ref={middleRef} className="middleCards flex gap-6 w-full justify-center">
                    <Pile 
                        name="thirtyOneDeck"
                        pile={[...Array(Number(remainingCardCount))]}
                        canPick={isMyTurn && !hasPicked}
                        clickEvent={() => {                  
                            socket.emit("thirty_one_pick_up_deck_card", roomCode);
                            setRemainingCardCount(remainingCardCount - 1);
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
                    <ThirtyOnePlayer name={socket.nickname} lives={currentPlayers[selfIndex].lives} isTurn={isMyTurn} didKnock={selfIndex === knockPlayer}/>
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
                            onClick={() => { 
                                if (!(isMyTurn && hasPicked)) { return; }
                                socket.emit("thirty_one_discard_card", roomCode, card);
                                playCard(myCards[index]); 
                            }} 
                        >
                            
                            <Card number={card.number} 
                                    suit={card.suit}
                                    width={180}
                            />
                        </div>
                    );
                })}
            </div>

            <ThirtyOneMovingCard element={<CardBacking width={150}/>} 
                                isMoving={hasPicked} 
                                playerCount={playerCount} 
                                index={0} selfIndex={selfIndex} 
                                middleRef={middleRef} 
            />
            
        </div>
    );
}