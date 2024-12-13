import { useState, useEffect, useRef } from "react";

import '../css/Telepath.css';

import getSocket from "../socket";

import { TelepathTeamScoresDisplay } from "../components/telepath/TelepathTeamScoresDisplay";
import { TelepathListContainers } from "../components/telepath/TelepathListContainers";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { TelepathRules } from "../components/telepath/TelepathRules";
import { InfoButton } from "../components/InfoButton";
import { TelepathSettings } from "../components/telepath/TelepathSettings";
import { RiTimerLine } from "react-icons/ri";

// TODO
// QoL changes
// - FREE FOR ALL MODE, COMPARE WITH EVERYONE

const socket = getSocket();

// props
// roomCode: string

const timeControls = {"15s": 15, "30s": 30, "45s": 45, "60s": 60, "90s": 90};
export const Telepath = (props) => {
    const roomCode = props.roomCode;
    const navigate = useNavigate();
    // typedWord is the text in the input
    // pickedWords are the words added to the list

    const [dataInitialized, setDataInitialized] = useState(false)
    const [prompt, setPrompt] = useState("");
    const [wordLimit, setWordLimit] = useState(0);

    const [shouldShowResults, setShouldShowResults] = useState(false);
    const [playersData, setPlayersData] = useState({});
    const [teamMode, setTeamMode] = useState(false);

    const [timeMode, setTimeMode] = useState("unlimited");
    const [timeRemaining, setTimeRemaining] = useState(0);
    
    const timerId = useRef(null);
    
    // List to show in middle
    const [mainUser, setMainUser] = useState({socketId:socket.id, userId:socket.userId, nickname:socket.nickname});

    useEffect(() => {
        socket.on('receive_players_data', (playersData) => {
            setPlayersData(playersData);
            playersData[socket.userId] && setDataInitialized(true);
        });

        socket.on("receive_game_data", (data) => {
            setPrompt(data.prompt);
            setWordLimit(data.wordLimit);
            setShouldShowResults(data.shouldShowResults);
            setTimeMode(data.timeLimit);

            if (!data.shouldShowResults && Object.keys(timeControls).includes(data.timeLimit)) {
                const diff = data.roundStartTime + timeControls[data.timeLimit] * 1000 - Date.now();
                const diffSec = Math.floor((diff) / 1000);
                const remaining = Math.min(Math.max(0, diffSec), timeControls[data.timeLimit]);

                setTimeRemaining(remaining);

                if (!timerId.current && remaining > 0) {
                    timerId.current = setInterval(() => {
                        setTimeRemaining((previous) => {
                            if (previous <= 1) {
                                clearInterval(timerId.current);
                                return 0;
                            } 
                            return previous - 1
                        });
                    }, 1000)
                }

            }

            !data.shouldShowResults && setMainUser({socketId:socket.id, userId:socket.userId, nickname:socket.nickname});
        });

        socket.on('room_error', (errorMessage) => {
            navigate(`/telepath/lobby`, { state: {error: errorMessage}});
        });

        socket.on('update_team_mode', (teamMode) => {
            setTeamMode(teamMode);                
        });

        socket.emit('join_room', roomCode);
        socket.emit('get_all_telepath_data', roomCode);

        return () => {
            socket.off('receive_game_data');
            socket.off('receive_players_data');
            socket.off('room_error');
        };
    }, []);

    useEffect(() => {
        if (!shouldShowResults) {
            return; 
        }

        if (timerId.current) {
            clearInterval(timerId.current);
            timerId.current = null;
        } 

        if (timeMode === "15s") {
            setTimeRemaining(15);
        } else if (timeMode === "30s") {
            setTimeRemaining(30);
        } else if (timeMode === "45s") {
            setTimeRemaining(45);
        } else if (timeMode === "60s") {
            setTimeRemaining(60);
        } else if (timeMode === "90s") {
            setTimeRemaining(90);
        }
    }, [timeMode, shouldShowResults])

    if (!dataInitialized) {
        return <LoadingScreen/>
    }

    return (
        <div className="telepathPage entirePage">
            <div className="topTaskBar">
                <InfoButton buttonType="info">
                    <TelepathRules />
                </InfoButton> 
                
                { shouldShowResults &&
                    <InfoButton buttonType="settings">
                        <TelepathSettings roomCode={roomCode} showTeamModeOption={false}/>
                    </InfoButton>
                } 
            </div>
            {timeMode !== "unlimited" &&
                <div className="absolute top-[2%] left-[2%]">
                    <div className="flex items-center">
                        <RiTimerLine className="h-[30px] w-[30px] sm:h-[36px] sm:w-[36px] md:h-[48px] md:w-[48px]"/>
                        <div className="text-[24px] sm:text-[30px] md:text-[40px] font-semibold w-[40px] sm:w-[60px]">
                            {timeRemaining}
                        </div>       
                    </div>
                </div>
            }
  
            <h2 className="telepathPrompt">{prompt + " " + wordLimit} </h2>
            <div className="containerHolder">
                <div className="scoreDisplayContainer scrollbar-hide">
                    <TelepathTeamScoresDisplay playersData={playersData} 
                                               shouldShowResults={shouldShowResults}
                                               setMainUser={setMainUser}
                                               mainUser={mainUser}
                                               teamMode={teamMode}
                    />
                </div>
                <div className="listsContainer">
                    <TelepathListContainers shouldShowResults={shouldShowResults}
                                            prompt={prompt}
                                            wordLimit={wordLimit}
                                            roomCode={roomCode}
                                            playersData={playersData}
                                            mainUser={mainUser}
                                            teamMode={teamMode}
                    />
                </div>
            </div>
            <div className="entirePage bg-black/70 z-[-10]"></div>
        </div>

    );
}

