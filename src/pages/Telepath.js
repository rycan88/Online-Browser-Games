import { useState, useEffect, useRef } from "react";

import '../css/Telepath.css';

import getSocket from "../socket";

import { TelepathTeamScoresDisplay } from "../components/telepath/TelepathTeamScoresDisplay";
import { TelepathListContainers } from "../components/telepath/TelepathListContainers";

// TODO
// - Let it toggle so see other people's lists
// - FREE FOR ALL MODE, COMPARE WITH EVERYONE

const socket = getSocket();

// props
// roomCode: string

export const Telepath = (props) => {
    const roomCode = props.roomCode;

    // typedWord is the text in the input
    // pickedWords are the words added to the list


    const [prompt, setPrompt] = useState("");
    const [wordLimit, setWordLimit] = useState(0);
    const [hasPickedWords, setHasPickedWords] = useState(false);

    const [shouldShowResults, setShouldShowResults] = useState(false);
    const [playersData, setPlayersData] = useState({});
    
    let p1Data = useRef({})
    let p2Data = useRef({})

    const getNextWord = () => {
        socket.emit('generate_telepath_prompt', roomCode);
    }

    useEffect(() => {
        socket.on('receive_players_data', (playersData) => {
            setPlayersData(playersData);
            setHasPickedWords(playersData[socket.id].hasPickedWords);
            p1Data.current = playersData[socket.id];
            p2Data.current = playersData[playersData[socket.id].partner];
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
    console.log(playersData);
    return (
        <div className="telepathPage entirePage">
            <h2 className="telepathPrompt">{prompt + " " + wordLimit} </h2>
            <div className="flex place-content-evenly w-full h-full">
                <div className="leftContainer">
                    <TelepathTeamScoresDisplay playersData={playersData} 
                                               shouldShowResults={shouldShowResults}
                    />
                </div>
                <TelepathListContainers shouldShowResults={shouldShowResults}
                                        hasPickedWords={hasPickedWords}
                                        prompt={prompt}
                                        wordLimit={wordLimit}
                                        roomCode={roomCode}
                                        p1Data={p1Data.current}
                                        p2Data={p2Data.current}

                />
            </div>
            <div className="entirePage bg-black/50 z-[-10]"></div>
        </div>

    );
}

