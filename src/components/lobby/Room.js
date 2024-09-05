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
    const [teamData, setTeamData] = useState([]);
    const gameName = props.gameName;
    const roomCode = props.roomCode;
    const canStart = teamData.length * 2 === players.length;
    useEffect(() => {
        socket.on('update_players', (players) => {
            setPlayers(players);
        });

        socket.on('update_team_data', (teamData) => {
            setTeamData(teamData);
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
            socket.off('update_team_data');
            socket.off('game_started');
            socket.off('room_error');
            socket.off('start_error');
        };
    }, []);

    const startGame = () => {
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
                    <TeamList roomCode={roomCode} teamData={teamData} canStart={canStart}/>
                    :
                    players.map((player) => {
                        return <h2>{player}</h2>
                    })
                    }
                </div>
                <h2 className="errorText">{canStart ? "" : "Needs 2 players on each team"}</h2>
                <div className="buttonsContainer">
                    <button className="redGradientButton" onClick={goBack}>Leave</button>
                    <button className="gradientButton" onClick={startGame} disabled={!canStart}>Start Game</button>
                </div>

            </div>
        </div>
    )

}