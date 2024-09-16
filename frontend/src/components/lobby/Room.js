import { useEffect, useState, useRef, useContext } from "react";
import getSocket from "../../socket";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { TeamList } from "./TeamList";
import { ToggleSwitch } from "../ToggleSwitch";
import { PlayerList } from "./PlayerList";

const socket = getSocket();

// roomCode: string
// gameName: string
export const Room = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [players, setPlayers] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [teamMode, setTeamMode] = useState(true);
    const gameName = props.gameName;
    const roomCode = props.roomCode;
    const canStart = teamMode ? teamData.length * 2 === players.length : players.length >= 2;
    useEffect(() => {
        socket.on('update_players', (players) => {
            setPlayers(players);
        });

        socket.on('update_team_data', (teamData) => {
            setTeamData(teamData);
        });

        socket.on('update_team_mode', (teamMode) => {
            setTeamMode(teamMode)
        });

        socket.on('game_started', () => {
            navigate(`/${gameName}/${roomCode}`);
            socket.emit('generate_telepath_prompt', props.roomCode);
        });

        socket.on('room_error', (errorMessage) => {
            navigate(`/${gameName}/lobby`, { state: {error: errorMessage}});
        });
        console.log(socket.nickname)
        socket.emit('join_room', roomCode);
        socket.emit("get_all_players", roomCode);

        return () => {
            socket.off('update_players');
            socket.off('update_team_data');
            socket.off('update_team_mode');
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

    const onAction = () => {
        console.log("ON");
        setTeamMode(true);
        socket.emit('set_team_mode', roomCode, true);
    }

    const offAction = () => {
        console.log("OFF")
        setTeamMode(false);
        socket.emit('set_team_mode', roomCode, false);
    }

    return (
        <div className="lobbyPage entirePage place-content-center items-center">
            <div className="lobbyBox">
                <div className="absolute right-5 top-5 flex flex-col">
                    <h6 className="text-lg">Teams</h6>
                    <ToggleSwitch className="fixed right-1 top-1" onAction={onAction} offAction={offAction} isOn={teamMode}/>
                </div>
                <h1 className="text-3xl">{gameName.toUpperCase()}</h1>                    
                <h2 className="text-8xl py-3 my-auto">{roomCode}</h2>
                <div className="flex flex-col h-[45%] w-full overflow-y-auto">
                    { teamMode 
                    ?
                    <TeamList roomCode={roomCode} teamData={teamData} canStart={canStart}/>
                    :
                    <PlayerList players={players}/>
                    }
                </div>
                <h2 className="errorText">{canStart ? "" : (teamMode ? "Needs 2 players on each team" : "Needs at least 2 players")}</h2>
                <div className="buttonsContainer">
                    <button className="redGradientButton" onClick={goBack}>Leave</button>
                    <button className="gradientButton" onClick={startGame} disabled={!canStart}>Start</button>
                </div>

            </div>
        </div>
    )

}