import { useEffect, useState, useRef, useContext } from "react";
import getSocket from "../../socket";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { TeamList } from "./TeamList";
import { ToggleSwitch } from "../ToggleSwitch";
import { PlayerList } from "./PlayerList";
import { CopyLinkButton } from "../CopyLinkButton";
import { InfoButton } from "../InfoButton";
import { ThirtyOneRules } from "../thirty-one/ThirtyOneRules";
import { TelepathRules } from "../telepath/TelepathRules";
import { RPSMeleeSettings } from "../rps-melee/RPSMeleeSettings";

const socket = getSocket();

const Titles = {"telepath": "Telepath", "thirty_one": "31", "rock_paper_scissors_melee": "RPS Melee"}
const Rules = {"telepath": <TelepathRules />, "thirty_one": <ThirtyOneRules />}
// roomCode: string
// gameName: string
export const Room = (props) => {
    const gameName = props.gameName;
    const roomCode = props.roomCode;
    const navigate = useNavigate();
    
    const [players, setPlayers] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [teamMode, setTeamMode] = useState(false);

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
        });

        socket.on('room_error', (errorMessage) => {
            navigate(`/${gameName}/lobby`, { state: {error: errorMessage}});
        });

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
        setTeamMode(true);
        socket.emit('set_team_mode', roomCode, true);
    }

    const offAction = () => {
        setTeamMode(false);
        socket.emit('set_team_mode', roomCode, false);
    }

    return (
        <div className="lobbyPage entirePage justify-center items-center">
            <div className="topTaskBar">
                <InfoButton buttonType="info">
                    {Rules[gameName]}
                </InfoButton>
                { gameName === "rock_paper_scissors_melee" &&
                    <InfoButton buttonType="settings">
                        <RPSMeleeSettings roomCode={roomCode}/>
                    </InfoButton>  
                } 
            </div>

            <div className="lobbyBox">
                { gameName === "telepath" &&
                    <div className="absolute right-3 top-3 sm:right-5 sm:top-5 flex flex-col">
                        <h6 className="text-lg">Teams</h6>
                        <ToggleSwitch className="fixed right-1 top-1" onAction={onAction} offAction={offAction} isOn={teamMode}/>
                    </div>
                }
                <div className="absolute left-1 top-3 sm:left-3 sm:top-3">
                    <CopyLinkButton/>
                </div>
                <h1 className="text-2xl sm:text-3xl">{Titles[gameName]}</h1>                    
                <h2 className="text-6xl sm:text-8xl py-3 my-auto">{roomCode}</h2>
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
            <div className="entirePage bg-black/70 z-[-10]"></div>
        </div>
    )

}