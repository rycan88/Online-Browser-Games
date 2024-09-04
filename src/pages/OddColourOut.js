import { useState, createContext } from "react"

import { OddColourOutGrid } from "../components/oddColourOut/OddColourOutGrid";
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



    const correctAction = () => {
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
        reconfigureBoard(newOffset, newGridSize);
    }

    const wrongAction = () => {
        setIsGameRunning(false);
        showSolution();
    }

    const reconfigureBoard = (offset, gridSize) => {
        setColorTransition("none");
        setColors(generateRandomColours(offset))
        setOddOne(Math.floor(Math.random() * (gridSize ** 2)));
        setBoxBgColor(startValues.bgColor);
    }

    const showSolution = () => {
        setColorTransition(startValues.transition);
        setBoxBgColor(colors[0]);
        setIsShow(false);
    }

    const hideSolution = () => {
        setColorTransition(startValues.transition);
        setBoxBgColor(startValues.bgColor);
        setIsShow(true);
    }

    const restartAction = () => {
        setIsGameRunning(true);
        setGridSize(startValues.gridSize);
        setOffset(startValues.offset);
        setLevel(startValues.level);
        setScore(startValues.score);
        reconfigureBoard(startValues.offset, startValues.gridSize);
    }

    // TODO: Style Overlays
    const SettingsOverlay = () => {
        return (
            <>
                <legend>Time Controls</legend>
                <div>
                    <div>
                        <input type="radio" id="lightning" name="timeControl"/>
                        <label for="lightning">Lightning</label>
                    </div>
                    <div>                        
                        <input type="radio" id="min" name="timeControl"/>
                        <label for="min">1 Min</label>
                    </div>
                    <div>
                        <input type="radio" id="endless" name="timeControl" checked/>
                        <label for="endless">Endless</label>
                    </div>
                </div>
            </>
        )
    }

    const InfoOverlay = () => {
        return (
            <>
                <h1>Odd Colour Out Game</h1>
                <p>
                    Click on the tile that is a different colour from the rest. Every 10 levels, the difficulty will increase by increasing the grid size and decrease the difference in colours.
                    You can change the time constraints in the settings.
                </p>
            </>
        )
    }

    const settingsOverlay = SettingsOverlay();
    const infoOverlay = InfoOverlay();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [overlay, setOverlay] = useState(InfoOverlay);

    const toggleOverlay = () => {
        setIsOverlayOpen(!isOverlayOpen);
    }

    return (
        <OddColourOutContext.Provider value={{ isGameRunning, correctAction, wrongAction}}>
            <div className="oddColourPage entirePage">
                <div className="topToolBar">
                    <div className="infoIcon" 
                        onClick={() => {
                            setOverlay(infoOverlay);
                            toggleOverlay();
                        }}>
                    </div>
                    <div className="settingsIcon" 
                        onClick={() => {
                            setOverlay(settingsOverlay);
                            toggleOverlay();
                        }}>
                    </div>
                </div>
                <div className="content">
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
                                    // TODO: Add timer
                                    <div className="timer">
                                        <div className="timerClockIcon"></div>
                                        <h3>&infin;</h3>
                                    </div>
                                : 
                                <div className="flex flex-col">
                                    {
                                        isShow ? 
                                            <button className="gradientButton" onClick={showSolution}> Show </button>
                                            :
                                            <button className="gradientButton" onClick={hideSolution}> Hide </button>
                                    }
                                    <button className="redGradientButton" onClick={restartAction}> Restart </button>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="entirePage bg-black/40 z-[-10]"></div>
            </div>

            <Overlay
                    isOpen={isOverlayOpen}
                    onClose={() => setIsOverlayOpen(!isOverlayOpen)}
                >
                {overlay}
            </Overlay>
        </OddColourOutContext.Provider>
    );
}