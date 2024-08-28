import { useEffect, useState, useRef, useContext } from "react";
import getSocket from "../socket";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../App";



const socket = getSocket();

// roomCode: string
// gameName: string
export const Room = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [players, setPlayers] = useState([]);
    const gameName = props.gameName;
    const roomCode = props.roomCode;

    useEffect(() => {
        socket.on('update_players', (players) => {
            setPlayers(players);
        });

        socket.on('game_started', () => {
            navigate(`/${gameName}/${roomCode}`);
            socket.emit('generate_telepath_prompt', props.roomCode);
        });

        return () => {
            socket.off('update_players');
            socket.off('game_started');
        };
    }, []);

    const startGame = () => {
        if (gameName === "telepath" && players.length % 2 !== 0) {
            alert("Needs even # of players");
            return 
        }
        socket.emit('start_game', props.roomCode);
    };

    const goBack = () => {
        socket.emit('leave_room', props.roomCode);
        navigate(-1);
    }

    return (
        <div className="lobbyPage entirePage place-content-center items-center">
            <div className="flex flex-col w-[500px] h-[80%] place-content-around items-center">
                <h1>{props.gameName}</h1>
                <h2>{props.roomCode}</h2>
                <h2>Players</h2>
                {players.map((player) => {
                    return <h2>{player}</h2>
                })}
                <div className="flex">
                    <button onClick={goBack}>Back</button>
                    <button onClick={startGame}>Start Game</button>
                </div>

            </div>
        </div>
    )

}