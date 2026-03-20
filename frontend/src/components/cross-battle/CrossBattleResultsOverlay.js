import { useState } from "react";
import { useOrientation } from "../../hooks/useOrientation";
import getSocket from "../../socket";
import { Overlay } from "../Overlay";
import { ReadyStatusIcon } from "../ReadyStatusIcon";
import useFullscreen from "../../hooks/useFullscreen";
import { CrossBattlePlayerList } from "./CrossBattlePlayerList";
import { InfoButton } from "../InfoButton";
import { CrossBattleSettings } from "./CrossBattleSettings";
import { FullscreenButton } from "../FullscreenButton";
import { CrossBattleRules } from "./CrossBattleRules";
import { GiSprout } from "react-icons/gi";

const crossBattleScoring = {2: 0, 3: 3, 4: 7, 5: 12, 6: 18, 7: 25, 8: 33, 9: 42, 10: 52, 11: 63, 12: 75, 13: 88, 14: 102, 15: 117};

// z2 = 0
// z3 = 3
// z4 = 7
// z_i = z_(i-1) + i = z_(i-2) + i + i - 1
// (3 + i) / 2  *  (i - 2) = 

// (i ** 2 + i - 6) / 2 

const socket = getSocket();
const longestWordUser = "longestWords";

export const CrossBattleResultsOverlay = ({roomCode, playersData, isOpen, currentUser, setCurrentUser, letters, isSeeded, longestWordsData}) => {
    const orientation = useOrientation();

    const isFullscreen = useFullscreen();

    if (!currentUser || !playersData) { 
        return <></> 
    }

    const isLongestWordUser = currentUser === longestWordUser;
    const currentPlayer = isLongestWordUser ? longestWordUser : playersData[currentUser];

    const validWordsText = [];
    const invalidWordsText = [];
    let gridArray = [];

    if (!isLongestWordUser) {
        for (let i = 15; i > 1; i--) {
            const words = currentPlayer.validWords.filter((word) => word.length === i);
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
        currentPlayer.invalidWords.forEach((word) => {
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
                {`[${currentPlayer.invalidWords.join("] [")}]`}
            </div>
        )

        gridArray = (
            currentPlayer.coords.map((coord) => {
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




    console.log(longestWordsData, socket.userId)


    const tabBarElements = () => {
        let arr = Object.values(playersData);
        const i = arr.findIndex((data) => data.nameData.userId === socket.userId);
    
        if (i !== -1) {
            arr = [arr[i], ...arr.slice(0, i), ...arr.slice(i + 1)]
        }

        const tabs = arr.map((playerData) => {
            const isCurrentPlayer = playerData.nameData.userId === currentUser;
            return (
                <div className={`flex flex-col rounded-t-md  text-center pt-[5px] pb-[8px] px-[40px] backdrop-blur-md
                                 ${isCurrentPlayer ? "cursor-default bg-[rgb(22,70,110)]" 
                                                   : "hover:cursor-pointer hover:bg-[rgb(22,66,110)] bg-slate-800"}`
                                }
                     onClick={() => {
                        setCurrentUser(playerData.nameData.userId);
                     }}
                >
                    <div className="absolute right-[10px] top-1/2 -translate-y-1/2">
                        <ReadyStatusIcon isReady={ playerData.isReady }/>
                    </div>
                    <div>  { playerData.nameData.nickname } </div>
                    <div className={`${playerData.score > 0 ? "text-green-500" : "text-red-400"}`}> 
                        { `(${playerData.score})` } 
                    </div>
                </div>
            )
        }); 

        if (longestWordsData != null && longestWordsData.length > 0) { 
            tabs.push(
                <div className={`flex flex-col justify-center rounded-t-md  text-center px-[20px] backdrop-blur-md
                                    ${currentPlayer === "longestWords" ? "cursor-default bg-[rgb(22,70,110)]" 
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
        <Overlay isOpen={isOpen}>
            <div className="topTaskBar">
                <button className="gradientButton text-slate-200 py-[6px] px-[12px] rounded-lg mx-[6px]"
                    onClick={() => {
                        socket.emit("cross_battle_is_ready", roomCode, true);
                    }}
                    disabled={playersData[socket.userId].isReady}
                >
                    {playersData[socket.userId].isReady ? "Waiting for others..." : "Next Game" }
                </button>

                <InfoButton buttonType="info" fullScreen={isFullscreen}>
                    <CrossBattleRules />
                </InfoButton>
                <InfoButton buttonType="settings" fullScreen={isFullscreen}>
                    <CrossBattleSettings roomCode={roomCode} shouldShowResults={true} letters={letters}/>
                </InfoButton> 
                <FullscreenButton shouldRotate={false}/>
            </div>

            <div className="myContainerCard gap-[0px] text-[2vh] pt-[2vh] pb-[3vh] select-none bg-gradient-to-tr from-slate-950 to-slate-950">
                <div className="flex w-full text-left translate-y-[2px] text-sm overflow-x-scroll">
                    { tabBarElements() }
                </div>
                <div className=" bg-[rgb(22,70,110)] h-full w-full overflow-x-auto scrollbar-hide flex gap-2 text-start backdrop-blur-md z-[10]">
                    { !isLongestWordUser ? 
                    <div className={`flex ${orientation !== "landscape" && "flex-col"} justify-between w-[100%] py-[1vh] ${orientation === "portrait" && "pl-[2vh]"} pr-[2vh]`}>

                        <div className={`flex flex-col overflow-y-auto overflow-x-clip scrollbar-hide ${orientation === "landscape" ? "h-full w-[50%] px-[5%]": "w-full h-[55%]"} text-[16px]`}>
                            <div className="flex items-center justify-center underline text-[18px] pb-[6px]">
                                {currentPlayer.nameData.nickname}
                            </div>
                            { currentPlayer.validWords.length > 0 &&
                                <div>
                                    {validWordsText}
                                </div>
                            }

                            {   currentPlayer.invalidWords.length > 0 &&
                                <div>
                                    {invalidWordsText}
                                </div>
                            }
                            {   currentPlayer.unusedLetters.length === 0 ?
                                    currentPlayer.invalidWords.length === 0 &&
                                        <div className="flex items-center justify-between">
                                            <div>All Tiles Used Bonus</div>
                                        <div>10</div>
                                </div>

                                :
                                <div>
                                    <div className="flex items-center justify-between">
                                        <div>{`Unused letters (${currentPlayer.unusedLetters.length})`}</div>
                                        <div className="text-red-400">-{currentPlayer.unusedLetters.length}</div>
                                    </div>
                                    <div className="text-red-400 ml-[12px]">{currentPlayer.unusedLetters}</div>
                                </div>
                            }
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full h-[2px] my-[6px] bg-slate-200/90"></div>
                                <div className={`flex items-center justify-between w-full`}>
                                    <div>Total</div>
                                    <div className={`${currentPlayer.score > 0 ? "text-green-500" : "text-red-400"}`}>{currentPlayer.score}</div>
                                </div>
                            </div>

                        </div>

                        <div className={`relative ${orientation === "landscape" ? "w-[50%]": "h-[40%]"} aspect-square grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(16,1fr)] border border-slate-500`}>
                            {gridArray}
                            { isSeeded &&
                                <div className="absolute right-[2px] top-[2px]">🌱</div>
                            }

                        </div>   
                    </div>
                    : 
                    <div className="w-full h-full flex flex-col text-slate-200 font-mono">
                        
                        {/* Header */}
                        <div className="grid grid-cols-[40px_1fr_50px] px-3 py-2 text-xs text-slate-400 border-b border-slate-600">
                            <div>#</div>
                            <div>WORD</div>
                            <div className="text-right">LEN</div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            {longestWordsData.map((data, i) => (
                                <div
                                    key={data.word}
                                    className={`grid grid-cols-[40px_1fr_50px] px-3 py-2 hover:bg-sky-800/40 rounded transition ${data.players.includes(socket.userId) ? "bg-amber-400/80" : (data.players.length > 0 && "bg-green-300/30")}`}
                                >
                                    <div className={`${data.players.length > 0 ? "text-slate-200" : "text-slate-400"}`}>{i + 1}</div>

                                    <div className="truncate">{data.word}</div>

                                    <div className={`text-right ${data.players.length > 0 ? "text-slate-200" : "text-slate-400"}`}>
                                        {data.word.length}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    }
                </div>

            </div>
        </Overlay>
    )
}