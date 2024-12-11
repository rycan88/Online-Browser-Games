import { useState, createContext, useEffect, useRef, useCallback } from "react"
import Cookies from "js-cookie";
import { OddColourOutGrid } from "../components/oddColourOut/OddColourOutGrid";

import '../css/OddColourOut.css';
import { InfoButton } from "../components/InfoButton";
import { getOddColourOutTimeMode, OddColourOutSettings } from "../components/oddColourOut/OddColourOutSettings";

export const OddColourOutContext = createContext();

export const OddColourOut = () => {
    const [rerender, setRerender] = useState(false);

    const triggerRerender = () => {
        setRerender(!rerender);
    }

    const generateRandomColours = (offset) => {
        const h = Math.floor(Math.random() * 360);
        const s = Math.floor(25 + Math.random() * 50);
        const l = Math.floor(25 + Math.random() * 50);
        
        const original_color = `hsl(${h},${s}%,${l}%)`;

        const lst = [h, s, l];
        const upLst = [Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)];
        upLst[0] ? lst[0] -= offset : lst[0] += offset;
        upLst[1] ? lst[1] -= offset : lst[1] += offset;
        upLst[2] ? lst[2] -= offset : lst[2] += offset;
    
        const modified_color = `hsl(${lst[0]},${lst[1]}%,${lst[2]}%)`;
        return [original_color, modified_color];
    }

    const getBestScore = () => {
        let bestScore = Cookies.get("bestOddColourOutScore");
        if (!bestScore) {
            bestScore = 0;
            Cookies.set('bestOddColourOutScore', bestScore, { expires: 365});
        }
        return bestScore;
    }

    const startValues = {
        bgColor: "rgb(226, 232, 240)",
        transition: "background-color 1s ease",
        level: 1,
        score: 0,
        gridSize: 2,
        offset: 5,
    }

    const [level, setLevel] = useState(startValues.level);
    const [score, setScore] = useState(startValues.score);
    const [bestScore, setBestScore] = useState(getBestScore());
    const [colorTransition, setColorTransition] = useState(startValues.transition);
    const [isGameRunning, setIsGameRunning] = useState(true);
    const [isShow, setIsShow] = useState(false);
    const [gridSize, setGridSize] = useState(startValues.gridSize);
    const [offset, setOffset] = useState(startValues.offset);
    const [colors, setColors] = useState(generateRandomColours(startValues.offset));
    const [oddOne, setOddOne] = useState(Math.floor(Math.random() * (startValues.gridSize ** 2)));
    const [boxBgColor, setBoxBgColor] = useState(startValues.bgColor);

    const [timeMode, setTimeMode] = useState("unlimited");
    const [timeRemaining, setTimeRemaining] = useState(0);
    const timerId = useRef(null);

    useEffect(() => {
        const mode = getOddColourOutTimeMode();
        if (level === 1) {
            setTimeMode(mode)
            switch (mode) {
                case "increment":
                    setTimeRemaining(10);
                    break
                case "30sec":
                    setTimeRemaining(30);
                    break
                case "1min":
                    setTimeRemaining(60);
                    break
                case "2min":
                    setTimeRemaining(120);
                    break
                default:
                    break
            }

        } else if (level > 1) {

        }
    }, [rerender, level]);

    const correctAction = () => {
        if (level === 1 && timeMode !== "unlimited") {
            const intervalId = setInterval(() => {
                setTimeRemaining((previous) => {
                    if (previous <= 1) {
                        clearInterval(intervalId);
                        wrongActionRef.current()
                        return 0;
                    } 
                    return previous - 1
                });
            }, 1000);

            timerId.current = intervalId;
        }

        if (timeMode === "increment" && level > 1) {
            setTimeRemaining(timeRemaining + 1)
        }

        setIsGameRunning(true);
        const newScore = score + level * 10;
        const newLevel = level + 1;
        let newGridSize = gridSize;
        let newOffset = offset;

        setScore(newScore);
        setLevel(newLevel);
        if (newLevel % 10 === 1) {
            newGridSize = Math.min(7, ((newLevel - 1) / 10) + 2);
            newOffset = Math.max(2, offset - 1);
            setGridSize(newGridSize);
            setOffset(newOffset);
        }
        if (bestScore < newScore) {
            Cookies.set('bestOddColourOutScore', newScore, { expires: 365});
            setBestScore(newScore);
        }
        reconfigureBoard(newOffset, newGridSize);
    }

    const showSolution = useCallback(() => {
        setColorTransition(startValues.transition);
        setBoxBgColor(colors[0]);
        setIsShow(false);
    }, [colors]);

    const wrongAction = useCallback(() => {
        if (timerId.current) {
            clearInterval(timerId.current);
        }

        setIsGameRunning(false);
        showSolution();
    }, [showSolution]);

    const reconfigureBoard = (offset, gridSize) => {
        setColorTransition("none");
        setColors(generateRandomColours(offset))
        setOddOne(Math.floor(Math.random() * (gridSize ** 2)));
        setBoxBgColor(startValues.bgColor);
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

    const wrongActionRef = useRef(wrongAction)
    useEffect(() => {
        wrongActionRef.current = wrongAction;
    }, [wrongAction])

    useEffect(() => {
        return () => {
            if (timerId.current) {
                clearInterval(timerId.current);
            }
        };
    }, []);

    return (
        <OddColourOutContext.Provider value={{ isGameRunning, correctAction, wrongAction, isShow, triggerRerender}}>
            <div className="oddColourPage entirePage">
                <div className="topTaskBar">
                    <InfoButton buttonType="settings">
                        <OddColourOutSettings />
                    </InfoButton>
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
                                <h2>Best Score: {bestScore}</h2>
                            </div>
                            <div>
                                { isGameRunning ?
                                    // TODO: Add timer
                                    <div className="timer">
                                        <div className="timerClockIcon"></div>
                                        <h3 className="w-[80px] sm:w-[120px]">{timeMode === "unlimited" ? "∞" : timeRemaining}</h3>
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
                <div className="entirePage bg-black/50 z-[-10]"></div>
            </div>
        </OddColourOutContext.Provider>
    );
}