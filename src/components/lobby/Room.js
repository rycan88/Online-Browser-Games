import { useEffect, useState, useRef, useContext } from "react";
import getSocket from "../../socket";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { TeamList } from "./TeamList";



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
        socket.emit('start_game', roomCode);
    };

    const goBack = () => {
        socket.emit('leave_room', roomCode);
        navigate(`/${gameName}/lobby`);
    }

    return (
        <div className="lobbyPage entirePage place-content-center items-center">
            <div className="lobbyBox">
                <h1 className="text-3xl">{gameName.toUpperCase()}</h1>
                <h2 className="text-8xl py-3 my-auto">{roomCode}</h2>
                <div className="flex flex-col h-[45%] w-full overflow-y-auto">
                    { gameName === "telepath" 
                    ?
                    <TeamList roomCode={roomCode}/>
                    :
                    players.map((player) => {
                        return <h2>{player}</h2>
                    })
                    }
                </div>
                <h2 className="errorText">Error</h2>
                <div className="buttonsContainer">
                    <button className="redGradientButton" onClick={goBack}>Leave</button>
                    <button className="gradientButton" onClick={startGame}>Start Game</button>
                </div>

            </div>
        </div>
    )

}