import { RiFlowerFill } from "react-icons/ri";
import { GiFlowerEmblem, GiFlowers, GiLotus, GiLotusFlower, GiSpotedFlower, GiTwirlyFlower, GiVanillaFlower, GiVineFlower } from "react-icons/gi";
import { IoFlower } from "react-icons/io5";
import { Card } from "../card/Card";
import { IoMdFlower } from "react-icons/io";
import { RainbowFlowers } from "./RainbowFlowers";

export const hanabiSuitIcons = {"red": <RiFlowerFill />, "yellow": <GiFlowerEmblem />, "green": <GiLotusFlower />, "purple": <GiSpotedFlower />, "blue": <GiLotus />, "pink": <GiVanillaFlower />, "rainbow": <RainbowFlowers/>}
export const hanabiSuitColours = {"red": "#991b1b", "yellow": "#d97706", "green": "#16a34a", "blue": "#1d4ed8", "purple": "#7e22ce", "pink": "#c425aa" } // red-800 "#FF69B4"
export const hanabiColours = ["red", "yellow", "green", "blue", "purple", "pink"];

export const getHanabiColours = (gameMode="standard") => {
    if (gameMode === "extraSuit") {
        return hanabiColours
    }

    return hanabiColours.filter(colour => colour !== "pink");
}

export const getVisibleCardData = (card) => {
    const isRainbow = card.suit === "rainbow";
    const hasData = card.numberVisible || card.suitVisible;
    const number = !hasData ? "" : (card.numberVisible ? card.number : "unknown");
    const suit = !hasData ? "" : (card.suitVisible ? (isRainbow ? card.suitVisible : card.suit) : "unknown");
    return {number: number, suit: suit};
}

export const HanabiCard = ({number, suit, width = 200, withBorder=true}) => {
    const cardNumber = number === "unknown" ? "?" : number;
    const suitColour = suit === "unknown" ? "black" : (suit === "rainbow") ? "rainbow" : hanabiSuitColours[suit]

    const cardMiddle = (
        <div className="flex w-full h-full justify-center items-center"
            style={{fontSize: width / 1.5}}>
                {cardNumber}
        </div>
    )
    
    return <Card number={cardNumber} 
                suitIcon={hanabiSuitIcons[suit]}
                suitColour={suitColour} 
                width={width} 
                withBorder={withBorder}
                cornerWidth={"20%"}
                cornerFontSize={"80%"}
                cardMiddle={cardMiddle}
            />
}