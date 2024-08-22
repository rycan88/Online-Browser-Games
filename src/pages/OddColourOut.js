import { useState, createContext } from "react"

import { OddColourOutGrid } from "../components/OddColourOutGrid";
import { Overlay } from "../components/Overlay";

import '../css/OddColourOut.css';

export const OddColourOutContext = createContext();

export const OddColourOut = () => {
    const generateRandomColours = (offset) => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        
        const original_color = `rgb(${r},${g},${b})`;

        const lst = [r, g, b];
        
        const s_i = lst.indexOf(Math.min(r,g,b));
        lst[s_i] > 255 - offset ? lst[s_i] -= offset : lst[s_i] += offset;
    
        const b_i = lst.indexOf(Math.max(r,g,b));
        lst[b_i] < offset ? lst[b_i] += offset : lst[b_i] -= offset;            
        //const i = Math.floor(Math.random() * 3);

        const modified_color = `rgb(${lst[0]},${lst[1]},${lst[2]})`;
        
        return [original_color, modified_color];
    }

    const startValues = {
        bgColor: "rgb(226, 232, 240)",
        transition: "background-color 1s ease",
        level: 1,
        score: 0,
        bestScore: 0,
        gridSize: 2,
        offset: 20,
    }

    const [level, setLevel] = useState(startValues.level);
    const [score, setScore] = useState(startValues.score);
    const [bestScore, setBestScore] = useState(startValues.bestScore);
    const [colorTransition, setColorTransition] = useState(startValues.transition);
    const [isGameRunning, setIsGameRunning] = useState("true");
    const [isShow, setIsShow] = useState("false");
    const [gridSize, setGridSize] = useState(startValues.gridSize);
    const [offset, setOffset] = useState(startValues.offset);
    const [colors, setColors] = useState(generateRandomColours(startValues.offset));
    const [oddOne, setOddOne] = useState(Math.floor(Math.random() * (startValues.gridSize ** 2)));
    const [boxBgColor, setBoxBgColor] = useState(startValues.bgColor);



    const CorrectAction = () => {
        setIsGameRunning(true);
        const newScore = score + level * 10;
        const newLevel = level + 1;
        let newGridSize = gridSize;
        let newOffset = offset;

        setScore(newScore);
        setLevel(newLevel);
        if (newLevel % 10 === 1) {
            newGridSize = Math.min(7, ((newLevel - 1) / 10) + 2);
            newOffset = Math.max(10, offset - 5);
            setGridSize(newGridSize);
            setOffset(newOffset);
        }
        if (bestScore <= newScore) {
            setBestScore(newScore);
        }
        ReconfigureBoard(newOffset, newGridSize);
    }

    const WrongAction = () => {
        setIsGameRunning(false);
        ShowSolution();
    }

    const ReconfigureBoard = (offset, gridSize) => {
        setColorTransition("none");
        setColors(generateRandomColours(offset))
        setOddOne(Math.floor(Math.random() * (gridSize ** 2)));
        setBoxBgColor(startValues.bgColor);
    }

    const ShowSolution = () => {
        setColorTransition(startValues.transition);
        setBoxBgColor(colors[0]);
        setIsShow(false);
    }

    const HideSolution = () => {
        setColorTransition(startValues.transition);
        setBoxBgColor(startValues.bgColor);
        setIsShow(true);
    }

    const RestartAction = () => {
        setIsGameRunning(true);
        setGridSize(startValues.gridSize);
        setOffset(startValues.offset);
        setLevel(startValues.level);
        setScore(startValues.score);
        ReconfigureBoard(startValues.offset, startValues.gridSize);
    }

    const [isOverlayOpen, setIsOverlayOpen] = useState(true);

    return (
        <OddColourOutContext.Provider value={{ isGameRunning, CorrectAction, WrongAction}}>
            <div className="page">
                <div className="gridBox" style={{backgroundColor: boxBgColor, transition: colorTransition}}>
                    <OddColourOutGrid colors={colors} oddOne={oddOne} gridSize={gridSize}/>
                </div>
                <div className="infoBoard">
                    <div className="infoTexts">
                        <div>
                            <h2>Level: {level}</h2>
                            <h2>Score: {score}</h2>
                            <h2>Personal Best: {bestScore}</h2>
                        </div>
                        <div>
                            { isGameRunning ?
                                <div className="oddColourOutTimer">
                                    <div className="timerClockIcon"></div>
                                    <h3>&infin;</h3>
                                </div>
                            : 
                            <div className="flex flex-col">
                                {
                                    isShow ? 
                                        <button className="bg-sky-900" onClick={ShowSolution}> Show </button>
                                        :
                                        <button className="bg-sky-900" onClick={HideSolution}> Hide </button>
                                }
                                <button className="bg-red-800" onClick={RestartAction}> Restart </button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Overlay
                    isOpen={isOverlayOpen}
                    onClose={() => setIsOverlayOpen(!isOverlayOpen)}
                >
                    <h1>Hello</h1>
                    <button className="bg-red-800">Hey</button>
            </Overlay>
        </OddColourOutContext.Provider>
    );
}