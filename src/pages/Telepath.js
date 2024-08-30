import { useState, useEffect } from "react";

import '../css/Telepath.css';

import getSocket from "../socket";

import { TelepathTeamScoresDisplay } from "../components/telepath/TelepathTeamScoresDisplay";
import { TelepathListContainers } from "../components/telepath/TelepathListContainers";

// TODO
// QoL changes
// - Finish resizing for smaller screens (double check big screen) 
// - Let players join with the link instead of always typing the code
// - Let players reconnect by saving them as a cookie
// - FREE FOR ALL MODE, COMPARE WITH EVERYONE

const socket = getSocket();

// props
// roomCode: string

export const Telepath = (props) => {
    const roomCode = props.roomCode;

    // typedWord is the text in the input
    // pickedWords are the words added to the list

    const [dataInitialized, setDataInitialized] = useState(false)
    const [prompt, setPrompt] = useState("");
    const [wordLimit, setWordLimit] = useState(0);

    const [shouldShowResults, setShouldShowResults] = useState(false);
    const [playersData, setPlayersData] = useState({});

    // List to show in middle
    const [mainUser, setMainUser] = useState(socket.id);

    const getNextWord = () => {
        socket.emit('generate_telepath_prompt', roomCode);
    }

    useEffect(() => {
        socket.on('receive_players_data', (playersData) => {
            setPlayersData(playersData);
            playersData[socket.id] && setDataInitialized(true);
        });

        socket.on("receive_results_state", (shouldShowResults) => {
            setShouldShowResults(shouldShowResults);
            if (shouldShowResults) {            

            } else {
                getNextWord();
            }    
        });

        socket.on("receive_telepath_prompt", (data) => {
            setPrompt(data.prompt);
            setWordLimit(data.wordLimit);
        });

        socket.emit('get_all_telepath_data', roomCode);

        return () => {
            socket.off('receive_results_state');
            socket.off('receive_telepath_prompt');
            socket.off('receive_players_data');
        };
    }, []);

    if (!dataInitialized) {
        return <></>
    }

    return (
        <div className="telepathPage entirePage">
            <h2 className="telepathPrompt">{prompt + " " + wordLimit} </h2>
            <div className="containerHolder">
                <div className="scoreDisplayContainer">
                    <TelepathTeamScoresDisplay playersData={playersData} 
                                               shouldShowResults={shouldShowResults}
                                               setMainUser={setMainUser}
                    />
                </div>
                <div className="listsContainer">
                    <TelepathListContainers shouldShowResults={shouldShowResults}
                                            prompt={prompt}
                                            wordLimit={wordLimit}
                                            roomCode={roomCode}
                                            playersData={playersData}
                                            mainUser={mainUser}
                    />
                </div>
            </div>
            <div className="entirePage bg-black/50 z-[-10]"></div>
        </div>

    );
}

