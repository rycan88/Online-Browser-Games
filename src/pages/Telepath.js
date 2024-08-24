import { useState, useRef } from "react";
import Axios from "axios";

import { TelepathWords } from "../TelepathWords";
import { ListItem } from "../components/ListItem";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import '../css/Telepath.css';

export const Telepath = () => {
    // typedWord is the text in the input
    // pickedWords are the words added to the list
    const [typedWord, setTypedWord] = useState(""); 
    const [pickedWords, setPickedWords] = useState([]);
  
    const fName = useRef('');

    const handleTextChange = (event) => {
        setTypedWord(event.target.value);
    }

    const addWord = () => {
        // We make the words uppercase to avoid repeated words and to make it look nicer
        if (typedWord === "" || pickedWords.includes(typedWord.toUpperCase(), 0)) {
            return
        }

        fName.current.value = "";
        setTypedWord("");
        setPickedWords([...pickedWords, typedWord.toUpperCase()]);
    }

    const removeItem = (chosenWord) => {
        setPickedWords(pickedWords.filter((word) => word !== chosenWord));
    }

    const keyDownHandler = (event) => {
        if (event.key === "Enter") {
            addWord();
        }
    }

    const TeamScores = () => {
        return (
            <div className="w-full h-[25%] p-4 bg-slate-900/30 mb-1 rounded-2xl">
                <h2 className="text-3xl">Team 1</h2>
                <div className="flex w-full h-[75%]">
                    <div className="flex flex-col place-content-around items-start pl-4 w-[60%] h-full">
                        <div className="flex w-full h-[50%] items-center">
                            <h2 className="text-xl">Player 1</h2>
                            <FaCheck className="h-full ml-4 mt-[2px] text-green-400"/>
                        </div>
                        <div className="flex w-full h-[50%] items-center">
                            <h2 className="text-xl">Player 2</h2>
                            <AiOutlineLoading3Quarters className="h-full ml-4 mt-[2px] animate-spin text-red-600"/>
                        </div>
                    </div>
                    <h2 className="text-3xl w-[40%] h-full place-content-center items-center">10</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="telepathPage entirePage">
            <h2 className="telepathPrompt">APPLES</h2>
            <div className="flex place-content-evenly w-full h-full">
                <div className="leftContainer">
                    {TeamScores()}
                    {TeamScores()}
                </div>
                <div className="middleContainer">
                    <div className="inputContainer">
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
                    </div>
                    <div className="box">

                        <div className="list">
                            {pickedWords.map((word) => {
                                return <ListItem word={word} removeItem={removeItem}/>;
                            })}
                        </div>

                    </div>
                </div>
                <div className="rightContainer">
                    {TeamScores()}
                    {TeamScores()}
                    {TeamScores()}
                    {TeamScores()}
                </div>
            </div>
            <div className="entirePage bg-black/50 z-[-10]"></div>
        </div>

    );
}

