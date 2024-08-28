import { useState, useRef } from "react";

// props
// addWord: function
export const TelepathInputBar = (props) => {
    const [typedWord, setTypedWord] = useState(""); 

    const handleTextChange = (event) => {
        setTypedWord(event.target.value);
    }

    const keyDownHandler = (event) => {
        if (event.key === "Enter") {
            handleAddWord();
        }
    }

    const handleAddWord = () => {
        if (props.addWord(typedWord)) {
            fName.current.value = "";
            setTypedWord("");
        }

    }

    const fName = useRef('');
    return (
        <>
            <input className="telepathInput"
                    type='text' 
                    ref={fName} 
                    placeholder="Type a word..." 
                    onChange={ handleTextChange } 
                    onKeyDown={ keyDownHandler }>    
            </input>
            <button className="addButton"
                    onClick={() => {
                        handleAddWord(typedWord);
                    }}>
                Enter
            </button>
        </>
    );
}