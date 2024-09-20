import JackOfClub from "./images/JackOfClub";
import JackOfDiamond from "./images/JackOfDiamond";
import JackOfHeart from "./images/JackOfHeart";
import JackOfSpade from "./images/JackOfSpade";
import KingOfClub from "./images/KingOfClub";
import KingOfDiamond from "./images/KingOfDiamond";
import KingOfHeart from "./images/KingOfHeart";
import KingOfSpade from "./images/KingOfSpade";
import QueenOfClub from "./images/QueenOfClub";
import QuennOfDiamond from "./images/QueenOfDiamond";
import QueenOfHeart from "./images/QueenOfHeart";
import QueenOfSpade from "./images/QueenOfSpade";

export const CardFigureContent = ({number, suit}) => {
    switch (number) {
        case 11:
        if (suit === "spades") {
            return <JackOfSpade />;
        }
        if (suit === "clubs") {
            return <JackOfClub />;
        }
        if (suit === "hearts") {
            return <JackOfHeart />;
        }
        if (suit === "diamonds") {
            return <JackOfDiamond />;
        }
        break;
        case 12:
        if (suit === "spades") {
            return <QueenOfSpade />;
        }
        if (suit === "clubs") {
            return <QueenOfClub />;
        }
        if (suit === "hearts") {
            return <QueenOfHeart />;
        }
        if (suit === "diamonds") {
            return <QuennOfDiamond />;
        }
        break;
        case 13:
        if (suit === "spades") {
            return <KingOfSpade />;
        }
        if (suit === "clubs") {
            return <KingOfClub />;
        }
        if (suit === "hearts") {
            return <KingOfHeart />;
        }
        if (suit === "diamonds") {
            return <KingOfDiamond />;
        }
        break;
        default:
        break;
    }
}