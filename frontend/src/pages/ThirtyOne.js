import { useEffect, useState } from "react";
import { Card } from "../components/card/Card";
import "../css/ThirtyOne.css"

import { ThirtyOneDeck } from "../components/thirty-one/ThirtyOneDeck";
import { ThirtyOneDiscardPile } from "../components/thirty-one/ThirtyOneDiscardPile";
import getSocket from "../socket";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

// TODO
// Make good cards for face cards
// Display cards
// Pick up cards
// Discard cards

const socket = getSocket();

export const ThirtyOne = ({roomCode}) => {
    const navigate = useNavigate();

    const [myCards, setMyCards] = useState([{id:-1, number:10, suit:"spades"}]);
    const [hasPicked, setHasPicked] = useState(false);
    const [discardPile, setDiscardPile] = useState([]);
    const [movingCardIndex, setMovingCardIndex] = useState(0);
    const [shouldMove, setShouldMove] = useState(false);
    const [dataInitialized, setDataInitialized] = useState(false);

    const playCard = (card) => {
        setMyCards(myCards.filter((item) => item !== card))
        setDiscardPile([...discardPile, card])
        setHasPicked(false);
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
            setHasPicked(true); 
        });

        socket.on("receive_game_data", (data) => {

        });

        socket.on('room_error', (errorMessage) => {
            navigate(`/thirty_one/lobby`, { state: {error: errorMessage}});
        });

        socket.emit('join_room', roomCode);
        socket.emit('get_all_thirty_one_data', roomCode);

        return () => {
            socket.off('receive_own_cards');
            socket.off('receive_discard_pile');
            socket.off('receive_picked_card');
            socket.off('receive_game_data');
            socket.off('receive_players_data');
            socket.off('room_error');
        };
    }, []);

    if (!dataInitialized) {
        return <LoadingScreen />;
    }

    return (
        <div className="thirtyOnePage entirePage">

            <div className="middleCards flex gap-6 h-[500px] w-[700px] justify-center">
                <ThirtyOneDeck roomCode={roomCode} hasPicked={hasPicked} />

                <ThirtyOneDiscardPile roomCode={roomCode} hasPicked={hasPicked} discardPile={discardPile} setDiscardPile={setDiscardPile}/>
    
            </div>
            <div className="selfCards">
                {myCards.map((card, index) => {
                    return (
                        <div className={`${hasPicked && "hover:hoverAnimation"} 
                                        ${(shouldMove && index === movingCardIndex) ? "transition-all duration-500 ease-in-out absolute -top-[500px] left-[200px]" : "relative top-[0] left-[0]"}`} 
                            onClick={() => { 
                                if (!hasPicked) { return; }
                                setHasPicked(false);
                                setMovingCardIndex(index);
                                setShouldMove(true);
                                socket.emit("thirty_one_discard_card", roomCode, card);
                            }} 
                            onTransitionEnd={() => {
                                if (!shouldMove || index !== movingCardIndex) { return; }
                                setShouldMove(false);
                                playCard(myCards[index]); 
                            }}>
                            
                            <Card number={card.number} 
                                    suit={card.suit}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}