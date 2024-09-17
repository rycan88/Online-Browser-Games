import { Card } from "../components/Card";
import "../css/ThirtyOne.css"
import { GiDiamonds } from "react-icons/gi";
import { GiSpades } from "react-icons/gi";
import { GiHearts } from "react-icons/gi";
import { GiClubs } from "react-icons/gi";

export const ThirtyOne = () => {
    return (
        <div className="thirtyOnePage entirePage">
            <h1>Thirty One</h1>
            <div className="flex flex-wrap gap-2">
                <Card number={1} suitIcon={<GiDiamonds />} colour={"red"}/>
                <Card number={2} suitIcon={<GiSpades />}/>
                <Card number={3} suitIcon={<GiClubs />}/>
                <Card number={4} suitIcon={<GiHearts />} colour={"red"}/>
                <Card number={5} suitIcon={<GiDiamonds />} colour={"red"}/>
                <Card number={6} suitIcon={<GiSpades />}/>
                <Card number={7} suitIcon={<GiDiamonds />} colour={"red"}/>
                <Card number={8} suitIcon={<GiSpades />}/>
                <Card number={9} suitIcon={<GiDiamonds />} colour={"red"}/>
                <Card number={10} suitIcon={<GiSpades />}/>
            </div>
        </div>
    );
}