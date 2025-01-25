import { RiFlowerFill } from "react-icons/ri";
import { GiFlowerEmblem, GiFlowers, GiLotusFlower, GiTwirlyFlower } from "react-icons/gi";
import { BsFlower1 } from "react-icons/bs";
import { IoFlowerSharp } from "react-icons/io5";
import { Card } from "../card/Card";

export const hanabiSuitIcons = {"red": <RiFlowerFill />, "yellow": <GiFlowerEmblem />, "green": <GiLotusFlower />, "purple": <GiTwirlyFlower />, "blue": <BsFlower1 />}
export const hanabiSuitColours = {"red": "#991b1b", "yellow": "#d97706", "green": "#16a34a", "purple": "#7e22ce", "blue": "#1d4ed8"} // red-800

export const HanabiCard = ({number, suit, width = 200, withBorder=true}) => {
    const cardNumber = number === "unknown" ? "?" : number;
    const suitColour = suit === "unknown" ? "black" : hanabiSuitColours[suit]

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