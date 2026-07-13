import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import getSocket from "../../socket";
import LoadingScreen from "../LoadingScreen";
import { CrossBattle } from "../../pages/CrossBattle";
import { getPSTDate } from "../../utils";
import { CrossBattleDailyResultsOverlay } from "./CrossBattleDailyResultsOverlay";

const socket = getSocket(); 

const gameName = "cross_battle";
const isDaily = true;

export const CrossBattleDaily = () => {
    const { rooms } = useContext(AppContext);
    const roomsArray = Object.keys(rooms);
    
    const dateString = getPSTDate();
    const roomCode = socket.userId + dateString;
    const [hasPlayedDaily, setHasPlayedDaily] = useState(null);
    const [dataInitialized, setDataInitialized] = useState(false);

    useEffect(() => {
        socket.on("room_created", (gameName, verifyRoomCode) => {
            if (verifyRoomCode === roomCode) {
                socket.emit('start_game', roomCode); 
                setDataInitialized(true);   
            }
        })

        socket.on("has_played_daily", (hasPlayedDaily) => {
            setHasPlayedDaily(hasPlayedDaily);
        })

        if (!roomsArray.includes(roomCode)) {
            socket.emit("create_room", gameName, isDaily);
        } else {
            socket.emit("has_cross_battle_daily_been_played", roomCode);
            setDataInitialized(true); 
        }

        return () => {
            socket.off('room_created');
            socket.off('has_played_daily');
        };
    }, []);

    if (hasPlayedDaily === null || !dataInitialized) {
        return <LoadingScreen />;
    }

    if (hasPlayedDaily) {
        return (
            <CrossBattleDailyResultsOverlay
                roomCode={roomCode} 
                isOpen={true} 
            />
        )
    } else {
        console.log("Has not played daily yet!");
        return <CrossBattle roomCode={roomCode} isDaily={true} />
    }


}