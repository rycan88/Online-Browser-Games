import { TelepathList } from "./TelepathList";
import { TelepathInputBar } from "./TelepathInputBar";

import { useEffect, useState } from "react";
import getSocket from "../../socket";

const socket = getSocket();

// props
// shouldShowResults: bool
export const TelepathListContainers = (props) => {
    const shouldShowResults = props.shouldShowResults;

    const wordLimit = props.wordLimit;
    const prompt = props.prompt;
    const roomCode = props.roomCode;

    const playersData = props.playersData;
    const mainUser = props.mainUser;

    const p1Data = playersData[mainUser];    
    const p2Data = playersData[playersData[mainUser].partner.userId];

    const hasPickedWords = playersData[socket.userId].hasPickedWords;
    const isReady = playersData[socket.userId].isReady;

    const [myWords, setMyWords] = useState([]);
    const [sharedWords, setSharedWords] = useState([]);

    const addWord = (typedWord) => {
        // We make the words uppercase to avoid repeated words and to make it look nicer
        const reformattedWord = typedWord.toUpperCase().trim()
        if (reformattedWord === "" || reformattedWord === prompt.toUpperCase() || myWords.includes(reformattedWord)) {
            return false;
        }

        setMyWords([...myWords, reformattedWord.toUpperCase()]);
        return true;
    }

    const MiddleInputTitle = () => {
        if (shouldShowResults) {
            return <div className="wordlistTitle">{p1Data.nameData.nickname}</div>
        }

        if (myWords.length >= wordLimit) {
            return <div className="wordlistTitle">Word Limit Reached</div>
        } else {
            return <TelepathInputBar addWord={addWord}/>
        }  
    }

    const submitAction = () => {
        if (!shouldShowResults) {
            if (hasPickedWords) {
                unsendWords();
            } else {
                sendWords();
            }

        } else {
            if (!isReady) {
                sendReady();
            }
        }
    }

    const buttonLabel = () => {
        let label = "";
        if (!shouldShowResults) {
            if (hasPickedWords) {
                label = "Unsend Words";
            } else {
                label = "Send Words";
            }
        } else {
            if (isReady) {
                label = "Waiting for others...";
            } else {
                label = "Next Word";
            }
        }

        return <h2>{label}</h2>
    }

    const refreshShared = (myWords, partnerWords) => {
        const newSharedWords = [];
        myWords.forEach((word) => {
            if (partnerWords.includes(word)) {
                newSharedWords.push(word);
            }
        });

        setSharedWords(newSharedWords)
    }
    
    console.log("list refresh");
    // Refresh the words that are the same
    useEffect(() => {
        if (shouldShowResults) {
            refreshShared(p1Data.chosenWords, p2Data.chosenWords);
            console.log("data", p1Data, p2Data)
            setMyWords([]);
        }
    }, [shouldShowResults, p1Data, p2Data]);     

    const sendWords = () => {
        socket.emit("send_telepath_words", roomCode, myWords);
    };

    const sendReady = () => {
        socket.emit("send_telepath_ready", roomCode);
    };

    const unsendWords = () => {
        socket.emit("unsend_telepath_words", roomCode);
    };

    // Unsend word when we change the wordList after sent
    useEffect(() => {
        if (hasPickedWords && !shouldShowResults) {
            console.log("unsend");
            unsendWords();
        }
    }, [myWords]);

    return <>
        <div className="p1Container">
            <div className="inputContainer">
                {MiddleInputTitle()}
            </div>

            <div className="list">
                {shouldShowResults 
                ?
                <TelepathList wordList={p1Data.chosenWords} 
                    setMyWords={setMyWords}
                    shouldShowResults={shouldShowResults}
                    sharedWords={sharedWords}
                />
                :
                <TelepathList wordList={myWords} 
                            setMyWords={setMyWords}
                            shouldShowResults={shouldShowResults}
                            sharedWords={sharedWords}
                />
                }
            </div>
            <div className="flex flex-row place-content-center">
                <button className="submitWords gradientButton"
                    onClick={ submitAction }
                    disabled={shouldShowResults && isReady}
                >
                    {buttonLabel()}
                </button>
            </div>
        </div>
        <div className={`p2Container ${shouldShowResults ? "block" : "hidden lg:block"}`}>
            {
            shouldShowResults &&
            <>
                <div className="wordlistTitle">{p2Data.nameData.nickname}</div>
                            
                <div className="list">
                    <TelepathList wordList={p2Data.chosenWords} 
                                setMyWords={setMyWords}
                                shouldShowResults={shouldShowResults}
                                sharedWords={sharedWords}
                    />
                </div>
            </>
            }
        </div>
    </>
}