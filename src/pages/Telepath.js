import { useState, useEffect, useRef } from "react";

import '../css/Telepath.css';

import getSocket from "../socket";
import { TelepathInputBar } from "../components/telepath/TelepathInputBar";
import { TelepathTeamScoresDisplay } from "../components/telepath/TelepathTeamScoresDisplay";
import { TelepathList } from "../components/telepath/TelepathList";

// TODO
// - Keep proper track of points
// - Make the word limit really a limit
// - Sort the list of words so correct words are at the top
// - Create a room so that multiple teams can play
// - Let it toggle so see other people's scores
// - FREE FOR ALL MODE, COMPARE WITH EVERYONE

const socket = getSocket();

// props
// roomCode: string

export const Telepath = (props) => {
    const roomCode = props.roomCode;

    // typedWord is the text in the input
    // pickedWords are the words added to the list

    const [myWords, setMyWords] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [wordLimit, setWordLimit] = useState(0);

    const addWord = (typedWord) => {
        // We make the words uppercase to avoid repeated words and to make it look nicer
        const reformattedWord = typedWord.toUpperCase().trim()
        if (reformattedWord === "" || myWords.includes(reformattedWord)) {
            return false;
        }

        setMyWords([...myWords, reformattedWord.toUpperCase()]);
        return true;
    }


    const [partnerWords, setPartnerWords] = useState([]);
    const [sharedWords, setSharedWords] = useState([])
    const [shouldShowResults, setShouldShowResults] = useState(false);
    const [playersData, setPlayersData] = useState({});
    const playersDataRef = useRef(playersData);

    const refreshShared = (myWords, partnerWords) => {
        const newSharedWords = [];
        myWords.forEach((word) => {
            if (partnerWords.includes(word)) {
                newSharedWords.push(word);
            }
        });

        setSharedWords(newSharedWords)
    }

    const getNextWord = () => {
        socket.emit('generate_telepath_prompt', roomCode);
        setMyWords([]);
    }

    const MiddleInputTitle = () => {
        return (
            shouldShowResults ?
            <div className="wordlistTitle">You</div>
            :
            <TelepathInputBar addWord={addWord}/>
        )   
    }

    const sendWords = () => {
        socket.emit("send_telepath_words", roomCode, myWords);
    };

    const sendReady = () => {
        socket.emit("send_telepath_ready", roomCode);
    };

    useEffect(() => {
        refreshShared(myWords, partnerWords);
    }, [myWords, partnerWords]);

    useEffect(() => {
        playersDataRef.current = playersData;
        if (shouldShowResults && playersData[socket.id]) {
            const partner = playersData[socket.id].partner;
            setMyWords(playersData[socket.id].chosenWords);
            setPartnerWords(playersData[partner].chosenWords);
        }
    }, [playersData, shouldShowResults]);

    useEffect(() => {
        socket.on('receive_players_data', (playersData) => {
            setPlayersData(playersData);

        });

        socket.on("update_player_data", (username, userData) => {
            const playersData = playersDataRef.current;
            console.log("playerData", playersData);
            const newPlayersData = {...playersData, [username]: userData};
            setPlayersData(newPlayersData);
            console.log("newData", newPlayersData);
        });

        socket.on("receive_results_state", (shouldShowResults) => {
            setShouldShowResults(shouldShowResults);
            if (!shouldShowResults) {            
                getNextWord();
            }
        });

        socket.on("receive_telepath_prompt", (data) => {
            setPrompt(data.prompt);
            setWordLimit(data.wordLimit);
        });

        socket.emit('get_all_telepath_data', roomCode);

        return () => {
            socket.off('update_player_data');
            socket.off('receive_results_state');
            socket.off('receive_telepath_prompt');
            socket.off('receive_players_data');
        };
    }, []);

    return (
        <div className="telepathPage entirePage">
            <h2 className="telepathPrompt">{prompt + " " + wordLimit} </h2>
            <div className="flex place-content-evenly w-full h-full">
                <div className="leftContainer">
                    <TelepathTeamScoresDisplay playersData={playersData} shouldShowResults={shouldShowResults}/>
                </div>
                <div className="middleContainer">
                    <div className="inputContainer">
                        {MiddleInputTitle()}
                    </div>
                    <div className="list">
                        <TelepathList wordList={myWords} 
                                      setMyWords={setMyWords}
                                      shouldShowResults={shouldShowResults}
                                      sharedWords={sharedWords}
                        />
                    </div>
                    <div className="flex flex-row place-content-center">
                        <button className="submitWords"
                             onClick={shouldShowResults ? sendReady : sendWords}
                        >
                            <h2>{shouldShowResults ? "Next Word" : "Submit Words"}</h2>
                        </button>
                    </div>
                </div>
                <div className="rightContainer">
                    {
                    shouldShowResults &&
                    <>
                        <div className="wordlistTitle">{playersData[socket.id].partner.slice(0, 10)}</div>
                                    
                        <div className="list">
                            <TelepathList wordList={partnerWords} 
                                        setMyWords={setMyWords}
                                        shouldShowResults={shouldShowResults}
                                        sharedWords={sharedWords}
                            />
                            {console.log("partner", partnerWords)}
                        </div>
                    </>
                    }
                </div>
            </div>
            <div className="entirePage bg-black/50 z-[-10]"></div>
        </div>

    );
}

