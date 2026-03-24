import { useContext, useEffect, useState } from "react";
import { ToggleSwitch } from "../ToggleSwitch";
import getSocket from "../../socket";
import { SettingsSaveButton } from "../SettingsSaveButton";
import { ChoiceDropdown } from "../ChoiceDropdown";
import Cookies from "js-cookie";
import { CrossBattleCopySeedButton } from "./CrossBattleCopySeedButton";
import { SectionHeading } from "../SectionHeading";


const socket = getSocket()

const timeLimitChoices = {"unlimited": "Unlimited", "30s": "30s", "60s": "60s", "90s": "90s", "120s": "120s", "180s": "180s"}
const canTileSwapCookieName = "crossBattleCanTileSwap";
export const CrossBattleSettings = ({roomCode, letters, closeOverlay, shouldShowResults}) => {
    const [timeLimit, setTimeLimit] = useState("unlimited");
    const [canTileSwap, setCanTileSwap] = useState(true);
    const [nextSeed, setNextSeed] = useState("");
    const [validWordText, setValidWordText] = useState("");
    const [isValidWord, setIsValidWord] = useState(null);

    const handleSeedChange = (e) => {
        let value = e.target.value;

        // Remove non-letters
        value = value.replace(/[^a-zA-Z]/g, "");

        // Convert to uppercase
        value = value.toUpperCase();

        // Limit to 22 characters
        value = value.slice(0, 22);

        setNextSeed(value);
    };

    const handleValidWordTextChange = (e) => {
        let value = e.target.value;

        // Remove non-letters
        value = value.replace(/[^a-zA-Z]/g, "");

        // Convert to uppercase
        value = value.toUpperCase();

        // Limit to 15 characters
        value = value.slice(0, 15);

        setValidWordText(value);
        setIsValidWord(null);
    };

    const checkValidWordKeyDown = (event) => {
        if (event.key === "Enter") {
            handleCheckWord();
        }
    }

    const handlePasteSeed = async () => {
        try {
            let text = await navigator.clipboard.readText();

            // sanitize
            text = text.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 22);

            setNextSeed(text);
        } catch (err) {
            console.error("Failed to read clipboard:", err);
        }
    };


    const handleSave = () => {
        Cookies.set(canTileSwapCookieName, canTileSwap.toString(), { expires: 365});

        const settingsData = {
            timeLimit: timeLimit,
            nextSeed: nextSeed,
        }
        socket.emit('set_cross_battle_settings_data', roomCode, settingsData);

    };

    const handleCheckWord = () => {
        socket.emit('check_cross_battle_word', roomCode, validWordText);
    };

    useEffect(() => {
        socket.on('receive_settings_data', (settingsData) => {
            if (!settingsData) { return; }
            const {timeLimit, nextSeed} = settingsData;
            
            if (timeLimit) { setTimeLimit(timeLimit) }
            if (nextSeed) { setNextSeed(nextSeed) }
        });

        socket.on('receive_is_word_valid', (isValid) => {
            setIsValidWord(isValid);
        });

        const canTileSwap = getCrossBattleCanTileSwap();
        setCanTileSwap(canTileSwap);
        socket.emit('get_cross_battle_settings_data', roomCode);

        return () => {
            socket.off('receive_settings_data');
            socket.off('receive_is_word_valid');
            //socket.off('update_team_mode');
        }
    }, [])

    const gameInProgress = (shouldShowResults === false);
    const isValidBorderColor = isValidWord === true ? "border-green-600" : (isValidWord === false ? "border-red-600" : "border-sky-700") 

    return (
        <div className="myContainerCard">
            <div className="myContainerCardTitle">Settings</div>
            <div className="myContainerCardCenterScrollBox gap-[2vh] w-[90%] mt-[2vh]">
                <SectionHeading text="Game Settings" />
                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                    <div>Time Mode</div>
                    <ChoiceDropdown selectedChoice={timeLimit} setSelectedChoice={setTimeLimit} choices={timeLimitChoices} isDisabled={gameInProgress}/>
                </div>
                { shouldShowResults &&
                    <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                        <div>Get Seed</div>
                        <CrossBattleCopySeedButton letters={letters}/>
                    </div>
                }
                { !gameInProgress &&
                    <div className="myContainerCardInnerBox py-2 pl-[2%] pr-[5%] flex items-center justify-between">                    
                        <input
                            type="text"
                            value={nextSeed}
                            onChange={handleSeedChange}
                            placeholder="Enter seed..."
                            className="px-[3%] py-2 rounded-md bg-sky-950/60 border border-sky-700 text-slate-200 placeholder-slate-400 font-mono outline-none
                                     focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 transition w-[50%]"
                            isDisabled={true}
                        />

                        <button className="gradientButton py-[6px] px-[12px] rounded-lg"
                                onClick={handlePasteSeed}
                        >
                            Paste Seed
                        </button>
                    </div>
                }
                <SectionHeading text="User Settings" />
                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">
                    <div>Disable Tile Swapping</div>
                    <ToggleSwitch isOn={!canTileSwap} onAction={() => {setCanTileSwap(false)}} offAction={() => {setCanTileSwap(true)}} bgColour="bg-sky-600"/>
                </div>

                { !gameInProgress &&
                    <div className="myContainerCardInnerBox py-2 pl-[2%] pr-[5%] flex items-center justify-between"> 
                        <div className="relative w-[50%]">
                            <input
                                type="text"
                                value={validWordText}
                                onChange={handleValidWordTextChange}
                                onKeyDown={checkValidWordKeyDown}
                                placeholder="Enter word..."
                                className={`px-[6%] py-2 rounded-md bg-sky-950/60 border ${isValidBorderColor} text-slate-200 placeholder-slate-400 font-mono outline-none
                                            transition w-full`}
                                isDisabled={true}
                            />
                            <span className={`absolute right-2 bottom-1 text-[10px] font-mono text-slate-400 ${validWordText.length > 0 ? "opacity-100" : "opacity-0"}    `}>
                                {validWordText.length}/15
                            </span>
                        </div>


                        { isValidWord == null &&
                            <button className="gradientButton py-[6px] px-[12px] rounded-lg"
                                    onClick={handleCheckWord}
                            >
                                Check Word
                            </button>
                        }
                    </div>
                }
            </div>
            
            <SettingsSaveButton handleSave={handleSave} closeOverlay={closeOverlay}/>
        </div>
    )
}

export const getCrossBattleCanTileSwap = () => {
    return Cookies.get(canTileSwapCookieName) !== "false";
}
