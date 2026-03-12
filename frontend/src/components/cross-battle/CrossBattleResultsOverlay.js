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

const crossBattleScoring = {2: 0, 3: 3, 4: 7, 5: 12, 6: 18, 7: 25, 8: 33, 9: 42, 10: 52, 11: 63, 12: 75, 13: 88, 14: 102, 15: 117};

// z2 = 0
// z3 = 3
// z4 = 7
// z_i = z_(i-1) + i = z_(i-2) + i + i - 1
// (3 + i) / 2  *  (i - 2) = 

// (i ** 2 + i - 6) / 2 

const socket = getSocket();

export const CrossBattleResultsOverlay = ({roomCode, playersData, isOpen, currentUser, setCurrentUser, letters}) => {
    const orientation = useOrientation();
    const validWordsText = [];
    const isFullscreen = useFullscreen();

    if (!currentUser || !playersData) { 
        return <></> 
    }

    const currentPlayer = playersData[currentUser];
    
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

    const invalidWordsText = []
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

    const gridArray = (
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

    const tabBarElements = () => {
        let arr = Object.values(playersData);
        const i = arr.findIndex((data) => data.nameData.userId === socket.userId);
    
        if (i !== -1) {
            arr = [arr[i], ...arr.slice(0, i), ...arr.slice(i + 1)]
        }

        return arr.map((playerData) => {
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
    }

    return (
        <Overlay isOpen={isOpen}>
            <div className="topTaskBar">
                <button className="gradientButton text-slate-200 text-[2vh] p-[1vh]"
                    onClick={() => {
                        socket.emit("cross_battle_is_ready", roomCode, true);
                    }}
                    disabled={playersData[socket.userId].isReady}
                >
                    {playersData[socket.userId].isReady ? "Waiting for others..." : "Next Game" }
                </button>

                <InfoButton buttonType="info" fullScreen={isFullscreen} />
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

                        <div className={`${orientation === "landscape" ? "w-[50%]": "h-[40%]"} aspect-square grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(16,1fr)] border border-slate-500`}>
                            {gridArray}
                        </div>
                    </div>
                </div>

            </div>
        </Overlay>
    )
}