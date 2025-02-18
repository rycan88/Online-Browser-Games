import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SettingsSaveButton } from "../SettingsSaveButton";
import getSocket from "../../socket";
import { ChoiceDropdown } from "../ChoiceDropdown";

const sortDiscardModeCookieName = "sortHanabiDiscardPileMode";

const gameModeChoices = {"standard": "Standard", "extraSuit": "6th Pile", "rainbowSuit": "Rainbow Pile", "uniqueRainbowSuit": "Rainbow Unique"}
const gameModeDescription = {"standard": <div>Standard Rules.</div>, 
                             "extraSuit": <div>A pink pile will be added as a 6th pile. It follows the same rules as the other piles.</div>,
                             "rainbowSuit": <div>A rainbow pile will be added as a 6th pile. You cannot clue the rainbow suit. Instead, these cards will count as every colour. So when clueing red, all red and rainbow cards will be clued.</div>,
                             "uniqueRainbowSuit": <div>This is the same as Rainbow Pile except that there will be only 1 copy of each rainbow card. So there is only 1 copy of the 1,2,3,4,5 of rainbow. <br/><br/> Rainbow Pile Description: A rainbow pile will be added as a 6th pile. You cannot clue the rainbow suit. Instead, these cards will count as every colour. So when clueing red, all red and rainbow cards will be clued.</div>
                            }
const sortModeChoices = {0: "Discard Order", 1: "Suit", 2: "Number"}

const socket = getSocket();
export const HanabiSettings = ({triggerRerender, roomCode, closeOverlay}) => {
    const [dataInitialized, setDataInitialized] = useState(false);

    const [sortMode, setSortMode] = useState(0); 
    const [isSaved, setIsSaved] = useState(false);
    const [gameMode, setGameMode] = useState("");

    const handleSave = () => {
        Cookies.set(sortDiscardModeCookieName, sortMode.toString(), { expires: 365});

        if (triggerRerender) {
            triggerRerender();
        }

        const settings = {
            gameMode: gameMode,
        };

        socket.emit('send_hanabi_settings_data', roomCode, settings);

        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
        }, 2000)
    };

    useEffect(() => {
        const sortMode = getSortHanabiDiscardPileMode();

        setSortMode(sortMode);

        socket.on('receive_settings_data', (settingsData) => {
            if (!settingsData) { return; }
            const gameMode = settingsData.gameMode;

            if (gameMode) {
                setGameMode(gameMode)
            }
            setDataInitialized(true);
        });

        socket.emit('get_hanabi_settings_data', roomCode);

        return () => {
            socket.off('receive_settings_data');
        }
    }, [])

    const startSurrenderVote = () => {
        socket.emit("hanabi_new_game_ready", roomCode);
        closeOverlay();
    }

    if (!dataInitialized) {
        return <></>;
    }

    return (
        <div className="myContainerCard">
            <div className="myContainerCardTitle">Settings</div>
            <div className="myContainerCardCenterScrollBox gap-[2vh] w-[90%] mt-[2vh]">
                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                    <div>Sort discard pile</div>
                    <ChoiceDropdown selectedChoice={sortMode} setSelectedChoice={setSortMode} choices={sortModeChoices}/>
                </div>
                <div className="myContainerCardInnerBox flex flex-col">  
                    <div className="py-2 px-[5%] flex items-center justify-between">
                        <div>Game Mode</div>
                        <ChoiceDropdown selectedChoice={gameMode} setSelectedChoice={setGameMode} choices={gameModeChoices}/>
                    </div>      
                    <div className="py-2 px-[5%] text-left">
                        {gameModeDescription[gameMode]}
                    </div>          
                </div>
                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                    <div>Start Surrender Vote</div>
                    <button className="redGradientButton rounded-[5%] py-1 px-2"
                            onClick={() => {
                                startSurrenderVote()
                            }}
                    >
                        Give up
                    </button>
                </div>
            </div>
            
            <SettingsSaveButton isSaved={isSaved} handleSave={handleSave} closeOverlay={closeOverlay}/>
        </div>
    )
}

export const getSortHanabiDiscardPileMode = () => {
    return Number(Cookies.get(sortDiscardModeCookieName)) || 0;
}

export const setSortHanabiDiscardPileMode = (sortMode) => {
    const mode = sortMode % Object.keys(sortModeChoices).length
    Cookies.set(sortDiscardModeCookieName, mode.toString(), { expires: 365});
}

