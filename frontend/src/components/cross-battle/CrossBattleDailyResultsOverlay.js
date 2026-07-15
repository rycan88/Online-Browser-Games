import { useOrientation } from "../../hooks/useOrientation";
import getSocket from "../../socket";
import { Overlay } from "../Overlay";
import { ReadyStatusIcon } from "../ReadyStatusIcon";
import useFullscreen from "../../hooks/useFullscreen";
import { InfoButton } from "../InfoButton";
import { CrossBattleSettings } from "./CrossBattleSettings";
import { FullscreenButton } from "../FullscreenButton";
import { CrossBattleRules } from "./CrossBattleRules";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { CrossBattleLeaderboardPlayerOverlay } from "./CrossBattleLeaderboardPlayerOverlay";
import { addDays, getNextResetDiff, getPSTDate } from "../../utils";
import { MdOutlineCalendarMonth } from "react-icons/md";

const crossBattleScoring = {2: 0, 3: 3, 4: 7, 5: 12, 6: 18, 7: 25, 8: 33, 9: 42, 10: 52, 11: 63, 12: 75, 13: 88, 14: 102, 15: 117};

const socket = getSocket();

export const CrossBattleDailyResultsOverlay = ({roomCode, isOpen}) => {
    const orientation = useOrientation();
    const navigate = useNavigate();
    const isFullscreen = useFullscreen();

    const [leaderboardData, setLeaderboardData] = useState(null); // List
    const [playerData, setPlayerData] = useState(null); // Object
    const [myResultsRequested, setMyResultsRequested] = useState(false);

    const [currentPlayerUserId, setCurrentPlayerUserId] = useState(null);
    const [currentUser, setCurrentUser] = useState(socket.userId);
    const [longestWordsData, setLongestWordsData] = useState(null);
    const [dailyTimeRemaining, setDailyTimeRemaining] = useState({hours: "30", minutes: "00", seconds: "00"});
    const [selectedDate, setSelectedDate] = useState(getPSTDate()) 
    const todaysDate = getPSTDate();
    const isTodaySelected = selectedDate === todaysDate;
    const isYesterdaySelected = selectedDate === addDays(todaysDate, -1);

    useEffect(() => {
        socket.on('receive_leaderboard', (leaderboardData) => {
            if (!leaderboardData) { return; }
            setLeaderboardData(leaderboardData);
        });

        socket.on('receive_my_results', (playerData) => {
            if (!playerData) { return; }
            setPlayerData(playerData);
        })

        socket.on('receive_daily_longest_words', (longestWordsData) => {
            if (!longestWordsData) { return; }
            setLongestWordsData(longestWordsData);
        })

        return () => {
            socket.off('receive_leaderboard');
            socket.off('receive_my_results');
            socket.off('receive_daily_longest_words');
        }
    }, []);

    useEffect(() => {
        socket.emit("get_cross_battle_leaderboard", roomCode, todaysDate); 
        socket.emit("cross_battle_get_daily_longest_words", roomCode, todaysDate); 
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const resetDiff = getNextResetDiff();
            setDailyTimeRemaining(resetDiff);
        }, 1000); // update once per second

        return () => clearInterval(interval);
    }, [])



    if (leaderboardData && playerData === null && !myResultsRequested) {
        socket.emit('cross_battle_get_my_results', roomCode, todaysDate);
        setMyResultsRequested(true);
    }

    if (!currentUser || leaderboardData === null || playerData === null) { 
        return <LoadingScreen />
    }

    const validWordsText = [];
    const invalidWordsText = [];
    let gridArray = [];
    
    if (currentUser === socket.userId) {
        for (let i = 15; i > 1; i--) {
            const words = playerData.validWords.filter((word) => word.length === i);
            if (words.length > 0) {
                validWordsText.push(
                    <div className="flex justify-between items-center w-full">
                        <div>{`${i}-letter words (${words.length})`}</div>
                        <div className={`${i > 2 && "text-green-500"}`}>{crossBattleScoring[i] * words.length}</div>
                    </div>
                )

                validWordsText.push(
                    <div className={`ml-[12px] w-full text-sm ${i > 2 && "text-green-500"}`}>
                        {`[${words.join("] [")}]`}
                    </div>
                )
            }
        }

        let totalInvalidLetters = 0;
        playerData.invalidWords.forEach((word) => {
            totalInvalidLetters += word.length;
        })

        invalidWordsText.push(
            <div className="flex justify-between items-center w-full">
                <div>{`Total invalid letters (${totalInvalidLetters})`}</div>
                <div className="text-red-400">{-totalInvalidLetters * 2}</div>
            </div>
        )

        invalidWordsText.push(
            <div className="ml-[12px] w-full text-sm text-red-400">
                {`[${playerData.invalidWords.join("] [")}]`}
            </div>
        )

        gridArray = (
            playerData.coords.map((coord) => {
                return (
                    <div className={`flex items-center justify-center text-xs text-center ${coord.isInvalid && "text-red-400"}`}
                        style = {{gridColumnStart: coord.x + 1, gridRowStart: coord.y + 1}}
                    >
                        {coord.letter}
                    </div>
                )
            })
        );
    }


    const tabBarElements = () => {
        const tabs = [];
        if (isTodaySelected) {
            tabs.push(
                <div className={`flex flex-col rounded-t-md text-center items-center justify-center px-[20px] backdrop-blur-md
                                    ${currentUser === socket.userId ? "cursor-default bg-[rgb(22,70,110)]" 
                                                    : "hover:cursor-pointer hover:bg-[rgb(22,66,110)] bg-slate-800"}`
                                }
                        onClick={() => {
                            setCurrentUser(playerData.userId);
                        }}
                >           
                    <div>  { playerData.nickname } </div>
                    <div className={`${playerData.score > 0 ? "text-green-500" : "text-red-400"}`}> 
                        { `(${playerData.score})` } 
                    </div>
                </div>
            );
        }
            
        tabs.push(
            <div className={`flex flex-col justify-center rounded-t-md  text-center px-[20px] backdrop-blur-md
                                ${currentUser === "leaderboard" ? "cursor-default bg-[rgb(22,70,110)]" 
                                                : "hover:cursor-pointer hover:bg-[rgb(22,66,110)] bg-slate-800"}`
                            }
                    onClick={() => {
                        setCurrentUser("leaderboard");
                    }}
            >
                <div>Leaderboard</div>
            </div>            
        )

        if (longestWordsData != null && longestWordsData.length > 0) { 
            tabs.push(
                <div className={`flex flex-col justify-center rounded-t-md  text-center px-[20px] backdrop-blur-md
                                    ${currentUser === "longestWords" ? "cursor-default bg-[rgb(22,70,110)]" 
                                                    : "hover:cursor-pointer hover:bg-[rgb(22,66,110)] bg-slate-800"}`
                                }
                        onClick={() => {
                            setCurrentUser("longestWords");
                        }}
                >
                    <div>Longest Words</div>
                </div>            
            )
        }

        return tabs;
    }

    return (
        <div className={`crossBattlePage entirePage z-[30] select-none ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}>
            <Overlay isOpen={isOpen}>
                <div className="topTaskBar">
                    <button className="gradientButton text-slate-200 py-[6px] px-[12px] rounded-lg mx-[6px]"
                        onClick={() => {
                            navigate("/cross_battle/lobby");
                        }}
                    >
                        Return to Menu
                    </button>

                    <InfoButton buttonType="info" fullScreen={isFullscreen}>
                        <CrossBattleRules />
                    </InfoButton>
                    <InfoButton buttonType="settings" fullScreen={isFullscreen}>
                        <CrossBattleSettings roomCode={roomCode} shouldShowResults={true} letters={playerData.letters}/>
                    </InfoButton> 
                    <FullscreenButton shouldRotate={false}/>
                </div>


                <CrossBattleLeaderboardPlayerOverlay 
                    roomCode={roomCode} 
                    isOpen={currentPlayerUserId} 
                    setCurrentPlayerUserId={setCurrentPlayerUserId}
                    userId={currentPlayerUserId}
                    selectedDate={selectedDate}
                />


                <div className="myContainerCard h-[90%] gap-[0px] text-[2vh] pt-[0] pb-[3vh] select-none bg-gradient-to-tr from-slate-950 to-slate-950">
                    <div className="flex w-full h-[9%] items-center justify-center gap-[2vh] font-mono">
                        <button className="px-[1vh] h-[3vh] bg-[rgb(22,70,110)] border border-slate-700 rounded-sm"
                                onClick={() => {
                                    const newDate = addDays(selectedDate, -1);
                                    setSelectedDate(newDate);
                                    socket.emit("get_cross_battle_leaderboard", roomCode, newDate); 
                                    socket.emit("cross_battle_get_daily_longest_words", roomCode, newDate); 
                                    if (!["leaderboard", "longestWords"].includes(currentUser)) {
                                        setCurrentUser("leaderboard");
                                    }
                                }}
                        >
                            {"<"}
                        </button>
                        <button className="flex items-center gap-[0.8vh] justify-center px-[1vh] h-[3vh] min-w-[14ch] bg-[rgb(22,70,110)] border border-slate-500 rounded-sm">
                            <MdOutlineCalendarMonth />
                            <div className="text-[1.8vh]">{ isTodaySelected ? "Today" : (isYesterdaySelected ? "Yesterday" : selectedDate) }</div>
                        </button> 
                        <button className={`${isTodaySelected && "invisible"} px-[1vh] h-[3vh] bg-[rgb(22,70,110)] border border-slate-700 rounded-sm`}
                                onClick={() => {
                                    const newDate = addDays(selectedDate, 1);
                                    setSelectedDate(newDate);
                                    socket.emit("get_cross_battle_leaderboard", roomCode, newDate); 
                                    socket.emit("cross_battle_get_daily_longest_words", roomCode, newDate); 
                                    if (!["leaderboard", "longestWords"].includes(currentUser)) {
                                        setCurrentUser("leaderboard");
                                    }
                                }}
                        >
                            {">"}
                        </button>
                    </div>
                    <div className="flex w-full h-[6vh] text-left translate-y-[0px] text-[1.5vh] overflow-x-scroll overflow-y-hidden">
                        { tabBarElements() }
                    </div>
                    <div className=" bg-[rgb(22,70,110)] h-full w-full overflow-x-auto scrollbar-hide flex gap-2 text-start backdrop-blur-md z-[10]">
                        { currentUser === socket.userId &&
                            <div className={`flex ${orientation !== "landscape" && "flex-col"} justify-between w-[100%] py-[1vh] ${orientation === "portrait" && "pl-[2vh]"} pr-[2vh]`}>

                                <div className={`flex flex-col overflow-y-auto overflow-x-clip scrollbar-hide ${orientation === "landscape" ? "h-full w-[50%] px-[5%]": "w-full h-[55%]"} text-[16px]`}>
                                    <div className="flex items-center justify-center underline text-[18px] pb-[6px]">
                                        {playerData.nickname}
                                    </div>
                                    { playerData.validWords.length > 0 &&
                                        <div>
                                            {validWordsText}
                                        </div>
                                    }

                                    {   playerData.invalidWords.length > 0 &&
                                        <div>
                                            {invalidWordsText}
                                        </div>
                                    }
                                    {   playerData.unusedLetters.length === 0 ?
                                            playerData.invalidWords.length === 0 &&
                                                <div className="flex items-center justify-between">
                                                    <div>All Tiles Used Bonus</div>
                                                <div>10</div>
                                        </div>

                                        :
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <div>{`Unused letters (${playerData.unusedLetters.length})`}</div>
                                                <div className="text-red-400">-{playerData.unusedLetters.length}</div>
                                            </div>
                                            <div className="text-red-400 ml-[12px]">{playerData.unusedLetters}</div>
                                        </div>
                                    }
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-full h-[2px] my-[6px] bg-slate-200/90"></div>
                                        <div className={`flex items-center justify-between w-full`}>
                                            <div>Total</div>
                                            <div className={`${playerData.score > 0 ? "text-green-500" : "text-red-400"}`}>{playerData.score}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`relative ${orientation === "landscape" ? "w-[50%]": "h-[40%]"} aspect-square grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(16,1fr)] border border-slate-500`}>
                                    {gridArray}
                                </div>   
                            </div>
                        }
                        { currentUser === "leaderboard" &&
                            <div className="w-full h-full flex flex-col text-slate-200 font-mono">
                                <div className="flex items-center justify-between w-full text-[1.5vh] py-[4px] px-3 border-b-[1px] border-slate-500">
                                    <div>{selectedDate}</div>
                                    <div className={`${!isTodaySelected && "invisible"}`}>{`Time Remaining: ${dailyTimeRemaining.hours}:${dailyTimeRemaining.minutes}:${dailyTimeRemaining.seconds}`}</div>
                                </div>
                                <div className="grid grid-cols-[40px_1fr_50px] px-3 py-2 text-xs text-slate-400 border-b border-slate-600">
                                    <div>#</div>
                                    <div>USERNAME</div>
                                    <div className="text-right">SCORE</div>
                                </div>

                                {/* List */}
                                <div className="flex-1 overflow-y-auto">
                                    {leaderboardData.map((data, i) => (
                                        <div
                                            key={data.userId + String(i)}
                                            className={`grid grid-cols-[40px_1fr_50px] px-3 py-2 rounded transition ${data.userId === socket.userId ? "bg-amber-400/80" : "hover:bg-sky-800/40"}`}
                                            onClick={() => {
                                                setCurrentPlayerUserId(data.userId);
                                            }}
                                        >
                                            <div className={`${data.userId === socket.userId ? "text-slate-200" : "text-slate-400"}`}>{ i + 1 }</div>

                                            <div className="truncate">
                                                {data.nickname}
                                            </div>

                                            <div className={`text-right ${data.userId === socket.userId ? "text-slate-200" : "text-slate-400"}`}>
                                                {data.score}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        } 
                        { currentUser === "longestWords" &&
                            <div className="w-full h-full flex flex-col text-slate-200 font-mono">
                                {/* Header */}
                                <div className="grid grid-cols-[40px_1fr_50px] px-3 py-2 text-xs text-slate-400 border-b border-slate-600">
                                    <div>#</div>
                                    <div>WORD</div>
                                    <div className="text-right">LEN</div>
                                </div>

                                {/* List */}
                                <div className="flex-1 overflow-y-auto">
                                    {longestWordsData.map((word, i) => (
                                        <div
                                            key={word}
                                            className={`grid grid-cols-[40px_1fr_50px] px-3 py-2 rounded transition ${playerData.validWords.includes(word) ? "bg-amber-400/80" : "hover:bg-sky-800/40"}`}
                                        >
                                            <div className={`${playerData.validWords.includes(word) && "text-slate-200"}`}>{i + 1}</div>

                                            <div className="truncate">{word}</div>

                                            <div className={`text-right ${playerData.validWords.includes(word) && "text-slate-200"}`}>
                                                {word.length}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>

                </div>
            </Overlay>
            <div className={`entirePage bg-black/70 z-[-10] ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}></div>
        </div>
    )
}