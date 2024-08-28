import { useState, useRef, useEffect } from "react";
import Axios from "axios";

import { ListItem } from "../components/telepath/ListItem";
import { TelepathTeamScores } from "../components/telepath/TelepathTeamScores";

import '../css/Telepath.css';

import getSocket from "../socket";

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
    const [typedWord, setTypedWord] = useState(""); 
    const [myWords, setMyWords] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [wordLimit, setWordLimit] = useState(0);
    const [players, setPlayers] = useState([]);

    const handleTextChange = (event) => {
        setTypedWord(event.target.value);
    }

    const fName = useRef('');
    const addWord = () => {
        // We make the words uppercase to avoid repeated words and to make it look nicer
        const reformattedWord = typedWord.toUpperCase().trim()
        if (reformattedWord === "" || myWords.includes(reformattedWord)) {
            return
        }

        fName.current.value = "";
        setTypedWord("");
        setMyWords([...myWords, reformattedWord.toUpperCase()]);
    }

    const removeItem = (chosenWord) => {
        setMyWords(myWords.filter((word) => word !== chosenWord));
    }

    const keyDownHandler = (event) => {
        if (event.key === "Enter") {
            addWord();
        }
    }

    const [partnerWords, setPartnerWords] = useState([]);
    const [sharedWords, setSharedWords] = useState([])
    const [shouldShowResults, setShouldShowResults] = useState(false);
    const [selfReady, setSelfReady] = useState(false);
    const [teamReady, setTeamReady] = useState(false);
    const partners = {};

    const refreshShared = () => {
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
            <>
                <input className="telepathInput"
                        type='text' 
                        ref={fName} 
                        placeholder="Type a word..." 
                        onChange={ handleTextChange } 
                        onKeyDown={ keyDownHandler }>    
                </input>
                <button className="addButton"
                        onClick={ addWord }>
                    Enter
                </button>
            </>
        )   
    }

    const submitEvent = () => {
        sendWords();
    }

    const sendWords = () => {
        socket.emit("send_telepath_words", { message: myWords});
        setSelfReady(true);
    };

    const sendReady = () => {
        socket.emit("send_telepath_ready");
        setSelfReady(true);
    };

    useEffect(() => {
        socket.on('receive_starting_players', (players) => {
            setPlayers(players);
            players.forEach((player, index) => {
                if (index % 2 === 0) {
                    partners[player] = players[index + 1];
                } else {
                    partners[player] = players[index - 1];
                }
            });
        });

        socket.on("receive_telepath_words", (data) => {
            setTeamReady(true);
            setPartnerWords(data.message);
        });

        socket.on("receive_telepath_ready", () => {
            setTeamReady(true);
        });

        socket.on("receive_telepath_prompt", (data) => {
            setPrompt(data.prompt);
            setWordLimit(data.wordLimit);
            console.log("Prompt has updated");
        });

        socket.emit('get_starting_players', roomCode);
        socket.emit('get_telepath_prompt', roomCode);

        return () => {
            socket.off('receive_telepath_words');
            socket.off('receive_telepath_ready');
            socket.off('receive_telepath_prompt');
            socket.off('receive_starting_players');
        };
    }, []);

    if (selfReady && teamReady) {
        shouldShowResults ? getNextWord() : refreshShared();

        setShouldShowResults(!shouldShowResults);
        setSelfReady(false);
        setTeamReady(false);
    }

    return (
        <div className="telepathPage entirePage">
            <h2 className="telepathPrompt">{prompt + " " + wordLimit} </h2>
            <div className="flex place-content-evenly w-full h-full">
                <div className="leftContainer">
                    {players.map((player, index) => {
                        if (index % 2 === 1) {
                            return <></>;
                        }
                        return <TelepathTeamScores teamNum={index / 2 + 1} player1={player.slice(0,10)} player2={players[index + 1].slice(0,10) ?? ""} firstReady={selfReady} secondReady={teamReady}/>;
                    })}
                </div>
                <div className="middleContainer">
                    <div className="inputContainer">
                        {MiddleInputTitle()}
                    </div>
                    <div className="list">
                        {myWords.map((word) => {
                            return <ListItem word={word} removeItem={removeItem} shouldShowResults={shouldShowResults} sharedWords={sharedWords}/>;
                        })}
                    </div>
                    <div className="flex flex-row place-content-center">
                        <button className="submitWords"
                             onClick={shouldShowResults ? sendReady : submitEvent}
                        >
                            <h2>{shouldShowResults ? "Next Word" : "Submit Words"}</h2>
                        </button>
                    </div>
                </div>
                <div className="rightContainer">
                    {
                    shouldShowResults ?
                    <>
                        <div className="wordlistTitle">Teammate</div>
                                    
                        <div className="list">
                            {partnerWords.map((word) => {
                                return <ListItem word={word} shouldShowResults={shouldShowResults} sharedWords={sharedWords}/>;
                            })}
                        </div>
                    </>
                    :
                    <></>
                    }
                </div>
            </div>
            <div className="entirePage bg-black/50 z-[-10]"></div>
        </div>

    );
}

