import { GiDiamonds } from "react-icons/gi";
import { GiSpades } from "react-icons/gi";
import { GiClubs } from "react-icons/gi";
import { IoIosHeart } from "react-icons/io";

export const suitIcons = {"spades": <GiSpades />, "hearts": <IoIosHeart />, "clubs": <GiClubs />, "diamonds": <GiDiamonds />}
export const suitColours = {"spades": "black", "hearts": "#991b1b", "clubs": "black", "diamonds": "#991b1b"} // red-800
export const cardValues = {1: 11, 11: 10, 12: 10, 13: 10}
export const cardChars = {1: "A", 11: "J", 12: "Q", 13: "K"}

