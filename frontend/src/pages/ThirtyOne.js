import { useState } from "react";
import { Card } from "../components/card/Card";
import "../css/ThirtyOne.css"

import { ThirtyOneDeck } from "../components/thirty-one/ThirtyOneDeck";
import { ThirtyOneDiscardPile } from "../components/thirty-one/ThirtyOneDiscardPile";

// TODO
// Make good cards for face cards
// Display cards
// Pick up cards
// Discard cards

export const ThirtyOne = ({roomCode}) => {
    const [myCards, setMyCards] = useState([{number: 6, suit: "diamonds"}, {number: 8, suit: "clubs"}, {number: 3, suit: "spades"}]);
    const [hasPicked, setHasPicked] = useState(false);
    const [discardPile, setDiscardPile] = useState([{number: 2, suit: "hearts"}]);
    const [movingCardIndex, setMovingCardIndex] = useState(0);
    const [shouldMove, setShouldMove] = useState(false);

    const playCard = (card) => {
        setMyCards(myCards.filter((item) => item !== card))
        setDiscardPile([...discardPile, card])
        setHasPicked(false);
    }

    const pickUpCard = (card) => {
        setMyCards([...myCards, card])
        setHasPicked(true);        
    }

    return (
        <div className="thirtyOnePage entirePage">

            <div className="middleCards flex gap-6 h-[500px] w-[700px] justify-center">
                <ThirtyOneDeck hasPicked={hasPicked} pickUpCard={pickUpCard}/>

                <ThirtyOneDiscardPile hasPicked={hasPicked} pickUpCard={pickUpCard} discardPile={discardPile} setDiscardPile={setDiscardPile}/>
    
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