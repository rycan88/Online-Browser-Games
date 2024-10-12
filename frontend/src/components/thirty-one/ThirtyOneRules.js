import { FaHeart } from "react-icons/fa6"
import { SimplifiedCard } from "../card/SimplifiedCard"

export const ThirtyOneRules = () => {    
    const CARD_WIDTH = Math.min((window.innerHeight * 0.05) * (2/3), (window.innerWidth * 0.5));
    return (
        <div className="myContainerCard text-[2vh]">
            <div className="myContainerCardTitle">
                Rules
            </div>
            <div className="overflow-y-auto scrollbar-hide flex flex-col gap-2 text-start">
                <h1 className="w-full text-[1.5em] text-start pl-3 underline">Overview</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div className="indent">The goal of the game is to have a hand that totals 31 in cards of a single suit, or as close as possible to 31.</div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Gameplay</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div >Each player is dealt 3 cards. A card is also dealt face up into the discard pile. At the start of a players turn, they can choose to either:</div>
                    <ul className="pl-5 list-disc">
                        <li>Draw a card from the deck or discard pile, and then discard a card,</li>
                        <li>Knock to signal that everyone else has one last turn before the round is over<br/>(Note: You cannot knock until everyone has had at least 1 turn.)</li>
                    </ul>
                    <div>
                        The round ends either after everyone else has had a turn after a knock, or if a player reaches 31. 
                    </div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Scoring</h1>
                <div className="myContainerCardInnerBox flex-col gap-2 py-[1vh] px-[2vh]">
                    <div >Aces are worth 11 points, Face cards (J, Q, K) are worth 10 points, and the rest are worth their face values (7 of clubs would be worth 7 points). The value of your hand is the highest sum of the card values of a single suit.</div>
                    <div className="flex py-[1vh] justify-center items-center gap-1">
                        <SimplifiedCard number={12} suit={"hearts"} width={CARD_WIDTH}/>
                        <SimplifiedCard number={8} suit={"hearts"} width={CARD_WIDTH}/>
                        <SimplifiedCard number={1} suit={"clubs"} width={CARD_WIDTH}/>
                        = 18 POINTS
                    </div>
                    <div className="flex py-[1vh] justify-center items-center gap-1">
                        <SimplifiedCard number={7} suit={"diamonds"} width={CARD_WIDTH}/>
                        <SimplifiedCard number={13} suit={"hearts"} width={CARD_WIDTH}/>
                        <SimplifiedCard number={9} suit={"spades"} width={CARD_WIDTH}/>
                        = 10 POINTS
                    </div>
                    <div className="flex py-[1vh] justify-center items-center gap-1">
                        <SimplifiedCard number={1} suit={"spades"} width={CARD_WIDTH}/>
                        <SimplifiedCard number={10} suit={"spades"} width={CARD_WIDTH}/>
                        <SimplifiedCard number={11} suit={"spades"} width={CARD_WIDTH}/>
                        = 31 POINTS
                    </div>
                    <div>
                        Finally, there is an extra special rule. If a player has all cards of the same rank then they will score 30.5 points.
                    </div>
                    <div className="flex py-[1vh] justify-center items-center gap-1">
                        <SimplifiedCard number={5} suit={"spades"} width={CARD_WIDTH}/>
                        <SimplifiedCard number={5} suit={"clubs"} width={CARD_WIDTH}/>
                        <SimplifiedCard number={5} suit={"hearts"} width={CARD_WIDTH}/>
                        = 30.5 POINTS
                    </div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">End of Round</h1>
                <div className="myContainerCardInnerBox flex-col gap-2 py-[1vh] px-[2vh]">
                    <div >
                        At the end of the round, the bottom half of players (rounded down) will lose a life. If a player knocked and is in the bottom half, they will lose 2 lives instead. When a player loses all 3 lives, they will be eliminated and will be a spectator until the game is over.
                        In the case of players being tied to be in the bottom half, all of them will lose a life (or 2 if they knocked). Eg. P1=20 , P2=29, P3=20. 3/2 rounded down = 1. So only the bottom player is supposed to lose a life. But since P1 and P3 tied as the bottom player, they will both lose a life.
                        The last player standing will be the 31 King.
                    </div>
                </div>

            </div>

        </div>
    )
}