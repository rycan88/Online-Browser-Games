import { FaHeart } from "react-icons/fa6"
import { SimplifiedCard } from "../card/SimplifiedCard"

export const HanabiRules = () => {    
    const CARD_WIDTH = Math.min((window.innerHeight * 0.05) * (2/3), (window.innerWidth * 0.5));
    return (
        <div className="myContainerCard text-[2vh]">
            <div className="myContainerCardTitle">
                Rules
            </div>
            <div className="overflow-y-auto scrollbar-hide flex flex-col gap-2 text-start">
                <h1 className="w-full text-[1.5em] text-start pl-3 underline">Overview</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div className="indent">This is a cooperative game. As a team, place the flowers into the center in the correct order. But there's a catch: you can see your teammates cards, but not your own. Together, place as many flowers into the center to score as many points as possible.</div>
                    <div>In a standard game (without variants), there will be 5 suits of flowers. Each suit will have three 1s, two 2's, two 3's, two 4's, and only one 5.</div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Gameplay</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div>On your turn you must do exactly one of the following: </div>
                    <ul className="pl-5 list-disc">
                        <li>Play a card into the center,</li>
                        <li>Discard a card,</li>
                        <li>Give a clue to a teammate</li>
                    </ul>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Playing a Card</h1>
                <div className="myContainerCardInnerBox flex-col gap-2 py-[1vh] px-[2vh]">
                    Drag a card to the center to play the card. When you play a card into the center, it must be in order within its given suit. So we must play a green 1 into the center before playing a green 2. If it is in order it will be played into the middle. Otherwise, your team will lose a life and the card will be put into the discard pile. 
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Discarding a Card</h1>
                <div className="myContainerCardInnerBox flex-col gap-2 py-[1vh] px-[2vh]">
                    Drag a card to the discard pile to discard it. The card will remain in the discard pile, but your team will get a clue token back. Your team can only have a maximum of 8 clue tokens at a time.
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Giving a clue</h1>
                <div className="myContainerCardInnerBox flex-col gap-2 py-[1vh] px-[2vh]">
                    Drag the clue token to the teammate's cards to give them a clue. This will use up a clue token. You will either give a number or colour to clue. This will tell your teammate which cards the clue refers to. So if you clue "blue", then your teammate will know which of their cards are blue. They must have at least one card that your clue is referring to. If they don't have any blue cards, you cannot clue "blue".
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">End of Game</h1>
                <div className="myContainerCardInnerBox flex-col gap-2 py-[1vh] px-[2vh]">
                    <div >
                        When the last card is drawn from the deck, each player (including the player that picked up the card) will get an additional turn before the game is over. So the last player to play will be the player that picked up the last card. The game will also end if all 3 lives are lost, or if no more flowers can be placed into the center.
                    </div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Variants</h1>
                <div className="myContainerCardInnerBox flex-col gap-2 py-[1vh] px-[2vh]">
                    <div >
                        If the game becomes too easy, go to the settings to change the game mode. These variants will pose a very interesting and fun challenge.
                    </div>
                </div>
            </div>

        </div>
    )
}