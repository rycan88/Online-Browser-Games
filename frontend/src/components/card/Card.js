import "../../css/Card.css"
import { CardMiddle } from "./CardMiddle";
import { suitIcons, suitColours, cardChars } from "./CardUtils";

export const Card = ({number, suit, width = 200}) => {
    const cardNumber = cardChars[number] ?? number;
    const suitIcon = suitIcons[suit];

    return (
        <div className={`standardCard`} 
            style={{color: suitColours[suit], width: `${width}px`, height: `${width * 1.5}px`, fontSize: `${width/4}px`}}>
            <div className="cardCornerContainer mb-auto">
                <h1 className="font-semibold">{cardNumber}</h1>
                <div>{suitIcon}</div>
            </div>
            <div className={`cardMiddleContainer my-auto`}>
                <CardMiddle number={number} suit={suit}/>
            </div>
            <div className="cardCornerContainer mt-auto rotate-180">
                <h1 className="font-semibold">{cardNumber}</h1>
                <div className="">{suitIcon}</div>
            </div>
        </div>
    );
}
