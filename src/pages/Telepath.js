import { useState, useRef, useEffect } from "react";
import Axios from "axios";


import { TelepathWords } from "../TelepathWords";
import { ListItem } from "../components/ListItem";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import '../css/Telepath.css';

import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

export const Telepath = () => {
    const generateNewWord = () => {
        return TelepathWords[Math.floor(Math.random() * TelepathWords.length)].toUpperCase();
    }

    const generateWordLimit = () => {
        return Math.floor(Math.random() * 5) + 5;
    }

    // typedWord is the text in the input
    // pickedWords are the words added to the list
    const [typedWord, setTypedWord] = useState(""); 
    const [myWords, setMyWords] = useState([]);
    const [prompt, setPrompt] = useState(generateNewWord());
    const [wordLimit, setWordLimit] = useState(generateWordLimit());

    const fName = useRef('');

    const handleTextChange = (event) => {
        setTypedWord(event.target.value);
    }

    const addWord = () => {
        // We make the words uppercase to avoid repeated words and to make it look nicer
        if (typedWord === "" || myWords.includes(typedWord.toUpperCase(), 0)) {
            return
        }

        fName.current.value = "";
        setTypedWord("");
        setMyWords([...myWords, typedWord.toUpperCase()]);
    }

    const removeItem = (chosenWord) => {
        setMyWords(myWords.filter((word) => word !== chosenWord));
    }

    const keyDownHandler = (event) => {
        if (event.key === "Enter") {
            addWord();
        }
    }

    const ReadyStatusIcon = (isReady) => {
        return isReady ? <FaCheck className="h-full ml-4 mt-[2px] text-green-400"/> : <AiOutlineLoading3Quarters className="h-full ml-4 mt-[2px] animate-spin text-red-600"/>;
    }

    const TeamScores = () => {
        return (
            <div className="w-full h-[25%] p-4 bg-slate-900/30 mb-1 rounded-2xl">
                <h2 className="text-3xl">Team 1</h2>
                <div className="flex w-full h-[75%]">
                    <div className="flex flex-col place-content-around items-start pl-4 w-[60%] h-full">
                        <div className="flex w-full h-[50%] items-center">
                            <h2 className="text-xl">You</h2>
                            { ReadyStatusIcon(selfReady) }
                        </div>
                        <div className="flex w-full h-[50%] items-center">
                            <h2 className="text-xl">Teammate</h2>
                            { ReadyStatusIcon(teamReady) }
                        </div>
                    </div>
                    <h2 className="text-3xl w-[40%] h-full place-content-center items-center">10</h2>
                </div>
            </div>
        );
    }

    const [partnerWords, setPartnerWords] = useState(["RED", "ORANGE", "BANANA", "LIME", "MANGO", "FRUIT"]);
    const [sharedWords, setSharedWords] = useState([])
    const [shouldShowResults, setShouldShowResults] = useState(false);
    const [selfReady, setSelfReady] = useState(false);
    const [teamReady, setTeamReady] = useState(false);

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
        setPrompt(generateNewWord);
        setWordLimit(generateWordLimit);
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

    useEffect(() => {
        socket.on("receive_telepath_words", (data) => {
            setTeamReady(true);
            setPartnerWords(data.message);
        })
    }, [socket]);

    const sendReady = () => {
        socket.emit("send_telepath_ready", {});
        setSelfReady(true);
    };

    useEffect(() => {
        socket.on("receive_telepath_ready", (data) => {
            setTeamReady(true);
        })
    }, [socket]);


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
                    {TeamScores()}
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

