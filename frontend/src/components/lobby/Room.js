import React, { createContext, useEffect, useState} from "react";
import getSocket from "../../socket";
import { useNavigate } from "react-router-dom";
import { TeamList } from "./TeamList";
import { ToggleSwitch } from "../ToggleSwitch";
import { PlayerList } from "./PlayerList";
import { CopyLinkButton } from "../CopyLinkButton";
import { InfoButton } from "../InfoButton";
import { ThirtyOneRules } from "../thirty-one/ThirtyOneRules";
import { TelepathRules } from "../telepath/TelepathRules";
import { RPSMeleeSettings } from "../rps-melee/RPSMeleeSettings";
import { RPSMeleeRules } from "../rps-melee/RPSMeleeRules";
import { TelepathSettings } from "../telepath/TelepathSettings";
import { RoomCodeWords } from "./RoomCodeWords";
import { HanabiSettings } from "../hanabi/HanabiSettings";
import { HanabiRules } from "../hanabi/HanabiRules";
import { FullscreenButton } from "../FullscreenButton";
import useFullscreen from "../../hooks/useFullscreen";

const socket = getSocket();

const Titles = {"telepath": "Telepath", "thirty_one": "31", "rock_paper_scissors_melee": "RPS Melee"}
const Rules = {"telepath": <TelepathRules />, "thirty_one": <ThirtyOneRules />, "rock_paper_scissors_melee": <RPSMeleeRules />, "hana": <HanabiRules />}
const Settings = {"telepath": <TelepathSettings />, "rock_paper_scissors_melee": <RPSMeleeSettings />, "hana": <HanabiSettings />}

// roomCode: string
// gameName: string

export const Room = (props) => {
    const gameName = props.gameName;
    const roomCode = props.roomCode;
    const navigate = useNavigate();
    const isFullscreen = useFullscreen();
    
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
            setTeamMode(teamMode);
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
        };
    }, []);

    const startGame = () => {
        socket.emit('start_game', roomCode);
    };

    const goBack = () => {
        socket.emit('leave_room', roomCode);
        navigate(`/${gameName}/lobby`);
    }

    const getPhrase = (roomCode) => {
        let string = "(";
        for (let i = 0; i < roomCode.length; i++) {
            string += RoomCodeWords[roomCode[i]][i];
            if (i != roomCode.length - 1) {
                string += " ";
            }
        }
        string += ")"
        return string;
    }

    return (
        <div className={`lobbyPage entirePage justify-center items-center ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}>
            <div className="topTaskBar">
                <InfoButton buttonType="info">
                    {Rules[gameName]}
                </InfoButton>
                { Settings[gameName] &&
                    <InfoButton buttonType="settings">
                        {React.cloneElement(Settings[gameName], { roomCode: roomCode})}
                    </InfoButton>  
                } 
                <div className="text-slate-200">
                    <FullscreenButton shouldRotate={false}/>
                </div>
            </div>

            <div className="lobbyBox">
                <div className="absolute left-1 top-3 sm:left-3 sm:top-3">
                    <CopyLinkButton/>
                </div>
                <h1 className="text-2xl sm:text-3xl -mt-1 mb-1">{Titles[gameName]}</h1> 
                    
                <h2 className="text-6xl sm:text-8xl my-auto">{roomCode}</h2>
                <h1 className="text-xl sm:text-2xl text-sky-700 pb-3">{getPhrase(roomCode)}</h1>

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
            <div className={`entirePage bg-black/70 z-[-10] ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}></div>
        </div>
    )

}