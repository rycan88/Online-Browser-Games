import { useOrientation } from "../../hooks/useOrientation";
import getSocket from "../../socket";
import { Overlay } from "../Overlay";
import useFullscreen from "../../hooks/useFullscreen";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";

const crossBattleScoring = {2: 0, 3: 3, 4: 7, 5: 12, 6: 18, 7: 25, 8: 33, 9: 42, 10: 52, 11: 63, 12: 75, 13: 88, 14: 102, 15: 117};

const socket = getSocket();
export const CrossBattleLeaderboardPlayerOverlay = ({roomCode, isOpen, setCurrentPlayerUserId, userId}) => {
    const orientation = useOrientation();
    const navigate = useNavigate();
    const isFullscreen = useFullscreen();

    const [playerData, setPlayerData] = useState(null); // Object

    useEffect(() => {
        socket.on('receive_player_results', (playerData) => {
            if (!playerData) { return; }
            setPlayerData(playerData);
        })

        return () => {
            socket.off('receive_player_results');
        }
    }, []);

    useEffect(() => {
        socket.emit("cross_battle_get_player_results", roomCode, userId);
    }, [isOpen]);

    if (playerData === null) { 
        return (
            <Overlay isOpen={isOpen}>
                <div className="entirePage">
                    <LoadingScreen />
                </div>
            </Overlay>
        ) 
    }

    const validWordsText = [];
    const invalidWordsText = [];
    let gridArray = [];
    
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
    


    const tabBarElements = () => {
        const tabs = [];

        tabs.push(
            <div className={`flex flex-col rounded-t-md  text-center pt-[5px] pb-[8px] px-[40px] backdrop-blur-md
                             cursor-default bg-[rgb(22,70,110)]`
                            }
            >           
                <div>  { playerData.nickname } </div>
                <div className={`${playerData.score > 0 ? "text-green-500" : "text-red-400"}`}> 
                    { `(${playerData.score})` } 
                </div>
            </div>
        );

        return tabs;
    }

    return (
        <Overlay isOpen={isOpen} onClose={() => {setCurrentPlayerUserId(null)}}>
            <div className="myContainerCard gap-[0px] text-[2vh] pt-[2vh] pb-[3vh] select-none bg-gradient-to-tr from-slate-950 to-slate-950">
                <div className="flex w-full text-left translate-y-[2px] text-sm overflow-x-scroll overflow-y-hidden">
                    { tabBarElements() }
                </div>
                <div className=" bg-[rgb(22,70,110)] h-full w-full overflow-x-auto scrollbar-hide flex gap-2 text-start backdrop-blur-md z-[10]">
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
                    
                </div>

            </div>
        </Overlay>
    )
}
