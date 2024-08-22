import { useState, useRef } from "react";
import Axios from "axios";

import { TelepathWords } from "../TelepathWords";
import { ListItem } from "../components/ListItem";

export const Telepath = () => {
    // typedWord is the text in the input
    // pickedWords are the words added to the list
    const [typedWord, setTypedWord] = useState(""); 
    const [pickedWords, setPickedWords] = useState([]);
    
    /*
    const fetchData = (excuseType) => {
      Axios.get(`excuser.herokuapp.com/v1/excuse/${excuseType}/`).then((res) => {
        setExcuse(res.data.excuse);
      });
    }*/
  
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

    return <div className="telepathBox">
        <h1>TELEPATH</h1>
        <input type='text' ref={fName} placeholder="Type a word..." onChange={ handleTextChange } onKeyDown={ keyDownHandler }></input>
        <button onClick={ addWord }>Add Word</button>
        <div className="list">
            {pickedWords.map((word) => {
                return <ListItem word={word} removeItem={removeItem}/>;
            })}
        </div>

    </div>
}

