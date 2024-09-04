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

        socket.on('room_error', (errorMessage) => {
            navigate(`/${gameName}/lobby`, { state: {error: errorMessage}});
        });

        socket.emit('join_room', roomCode);
        socket.emit("get_all_players", roomCode);

        return () => {
            socket.off('update_players');
            socket.off('game_started');
            socket.off('room_error');
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
        navigate(`/${gameName}/lobby`);
    }

    return (
        <div className="lobbyPage entirePage place-content-center items-center">
            <div className="lobbyBox">
                <h1>{props.gameName}</h1>
                <h2 className="text-[100px]">{props.roomCode}</h2>
                <h2>Players</h2>
                <div className="flex flex-col h-[45%] w-full overflow-y-scroll">
                    {players.map((player) => {
                        return <h2>{player}</h2>
                    })}
                </div>
                <div className="flex flex-row w-full place-content-between">
                    <button className="redGradientButton" onClick={goBack}>Leave</button>
                    <button className="gradientButton" onClick={startGame}>Start Game</button>
                </div>

            </div>
        </div>
    )

}