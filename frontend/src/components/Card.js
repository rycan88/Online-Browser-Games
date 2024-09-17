import "../css/Card.css"
import { CardMiddle } from "./CardMiddle";

export const Card = ({number, suitIcon, colour}) => {
    return (
        <div className={`standardCard ${colour === "red" && "text-red-800"}`}>
            <div className="cardCornerContainer mb-auto">
                <h1 className="">{number}</h1>
                <div>{suitIcon}</div>
            </div>
            <div className={`cardMiddleContainer my-auto`}>
                <CardMiddle number={number} suitIcon={suitIcon}/>
            </div>
            <div className="cardCornerContainer mt-auto rotate-180">
                <h1 className="">{number}</h1>
                <div className="">{suitIcon}</div>
            </div>
        </div>
    );
}
