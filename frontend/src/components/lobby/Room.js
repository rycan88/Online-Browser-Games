import React, { useEffect, useState} from "react";
import getSocket from "../../socket";
import { useNavigate } from "react-router-dom";
import { TeamList } from "./TeamList";
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
import { CrossBattleSettings } from "../cross-battle/CrossBattleSettings";
import { CrossBattleRules } from "../cross-battle/CrossBattleRules";
import { refreshPage } from "../../utils";
import { ConfirmOverlay } from "../ConfirmOverlay";

const socket = getSocket();

const Titles = {"telepath": "Telepath", "thirty_one": "31", "rock_paper_scissors_melee": "RPS Melee", "hana": "Hana", "cross_battle": "Cross Battle"}
export const Rules = {"telepath": <TelepathRules />, "thirty_one": <ThirtyOneRules />, "rock_paper_scissors_melee": <RPSMeleeRules />, "hana": <HanabiRules />, "cross_battle": <CrossBattleRules />}
const Settings = {"telepath": <TelepathSettings />, "rock_paper_scissors_melee": <RPSMeleeSettings />, "hana": <HanabiSettings />, "cross_battle": <CrossBattleSettings />}

// roomCode: string
// gameName: string

export const Room = ({gameName, roomCode}) => {
    const navigate = useNavigate();
    const isFullscreen = useFullscreen();
    
    const [players, setPlayers] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [teamMode, setTeamMode] = useState(false);
    const [isRoomHost, setIsRoomHost] = useState(null);
    const [kickPlayer, setKickPlayer] = useState(null); // Namedata of player to kick

    const isEnoughPlayers = () => {
        if (gameName === "telepath" && teamMode) {
            return teamData.length * 2 === players.length;
        } else if (gameName === "cross_battle") {
            return true;
        } else {
            return players.length >= 2;
        }
    };
    
    const canStart = isEnoughPlayers() && isRoomHost;

    const resync = () => {
        if (!socket.connected) {
            refreshPage();
        }
        socket.emit("get_all_players", roomCode);
    }

    useEffect(() => {
        socket.on('receive_room_host_id', (roomHostId) => {
            const isRoomHost = socket.userId === roomHostId;
            setIsRoomHost(isRoomHost);
        });

        socket.on('update_players', (players) => {
            setPlayers(players);
        });

        socket.on('update_team_data', (teamData) => {
            setTeamData(teamData);
        });

        socket.on('update_team_mode', (teamMode) => {
            setTeamMode(teamMode);
        });

        socket.on('request_room_resync', () => {
            resync();
        })

        socket.on('game_started', () => {
            navigate(`/${gameName}/${roomCode}`);
        });

        socket.on('room_error', (errorMessage) => {
            navigate(`/${gameName}/lobby`, { state: {error: errorMessage}});
        });

        let hiddenTime = null;
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                hiddenTime = Date.now();
            }

            if (document.visibilityState === "visible") {
                if (hiddenTime && Date.now() - hiddenTime > 2 * 60 * 1000) { // Away longer than 2 min
                    refreshPage();
                }
            }
        }

        window.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", resync);
        window.addEventListener("pageshow", resync);

        socket.emit('join_room', roomCode);
        socket.emit("get_all_players", roomCode);

        return () => {
            socket.off('update_players');
            socket.off('update_team_data');
            socket.off('update_team_mode');
            socket.off('receive_room_host_id');
            socket.off('request_room_resync');
            socket.off('game_started');
            socket.off('room_error');
            socket.off('connect');
            socket.off('reconnect');
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", resync);
            window.removeEventListener("pageshow", resync);
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
            if (i !== roomCode.length - 1) {
                string += " ";
            }
        }
        string += ")"
        return string;
    }

    const confirmAction = () => {
        socket.emit("kick_player", roomCode, kickPlayer);
        setKickPlayer(null);
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
                <div className="flex justify-center items-center text-slate-200">
                    <FullscreenButton shouldRotate={false}/>
                </div>
            </div>

            <div className="lobbyBox">
                <div className="absolute left-1 top-3 sm:left-3 sm:top-3">
                    <CopyLinkButton/>
                </div>
                <h1 className="text-[3.5vh] -mt-1 -mb-1">{Titles[gameName]}</h1> 
                    
                <h2 className="text-[8vh] -my-[1vh]">{roomCode}</h2>
                <h1 className="text-[2.5vh] text-sky-700 pb-3">{getPhrase(roomCode)}</h1>

                <div className="flex flex-col h-[45%] w-full overflow-y-auto">
                    { teamMode 
                    ?
                    <TeamList roomCode={roomCode} teamData={teamData} canStart={canStart}/>
                    :
                    <PlayerList players={players} isRoomHost={isRoomHost} setKickPlayer={setKickPlayer}/>
                    }
                </div>
                <h2 className="errorText">{isEnoughPlayers() ? "" : (teamMode ? "Needs 2 players on each team" : "Needs at least 2 players")}</h2>
                <div className="buttonsContainer">
                    <button className="redGradientButton" onClick={goBack}>Leave</button>
                    <button className="gradientButton" onClick={startGame} disabled={!canStart}>{isRoomHost ? "Start" : <>Waiting for <br /> Host...</>}</button>
                </div>
            </div>

            <ConfirmOverlay isOpen={kickPlayer != null} 
                            onClose={() => {setKickPlayer(null)}} 
                            onConfirm={confirmAction} 
                            titleText="Kick Player?"
                            confirmText="Kick"
                            cancelText="Cancel"
            >
                <>
                Are you sure you want to kick<br/>
                <span className="font-bold uppercase">{kickPlayer?.nickname}</span>?
                </>
            </ConfirmOverlay>
            
            <div className={`entirePage bg-black/70 z-[-10] ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}></div>
        </div>
    )

}