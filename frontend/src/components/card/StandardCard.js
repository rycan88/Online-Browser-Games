
import { GiClubs, GiDiamonds, GiSpades } from "react-icons/gi";
import "../../css/Card.css"

import { IoIosHeart } from "react-icons/io";
import { StandardCardMiddle } from "./CardMiddle";
import { Card } from "./Card";


const suitIcons = {"spades": <GiSpades />, "hearts": <IoIosHeart />, "clubs": <GiClubs />, "diamonds": <GiDiamonds />}
const suitColours = {"spades": "black", "hearts": "#991b1b", "clubs": "black", "diamonds": "#991b1b"} // red-800
const cardChars = {1: "A", 11: "J", 12: "Q", 13: "K"}

export const StandardCard = ({number, suit, width = 200, withBorder=true}) => {
    const cardNumber = cardChars[number] ?? number;
    return <Card number={cardNumber} 
                suitIcon={suitIcons[suit]}
                suitColour={suitColours[suit]} 
                width={width} 
                withBorder={withBorder}
                cornerWidth={"15%"}
                cornerFontSize={"50%"}
                cardMiddle={<StandardCardMiddle number={number} suit={suit}/>}
            />
}


