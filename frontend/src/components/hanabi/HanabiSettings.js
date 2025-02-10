import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ToggleSwitch } from "../ToggleSwitch";
import { SettingsSaveButton } from "../SettingsSaveButton";
import getSocket from "../../socket";
import { ChoiceDropdown } from "../ChoiceDropdown";

const shouldSortDiscardCookieName = "shouldSortHanabiDiscardPile";

const gameModeChoices = {"standard": "Standard", "extraSuit": "6th Pile", "rainbowSuit": "Rainbow Pile", "uniqueRainbowSuit": "Rainbow Unique"}

const socket = getSocket();
export const HanabiSettings = ({triggerRerender, roomCode, closeOverlay}) => {
    const [shouldSort, setShouldSort] = useState(false); 
    const [isSaved, setIsSaved] = useState(false);
    const [gameMode, setGameMode] = useState("");

    const handleSave = () => {
        Cookies.set(shouldSortDiscardCookieName, shouldSort.toString(), { expires: 365});

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
        const shouldSort = getShouldSortHanabiDiscardPile();

        setShouldSort(shouldSort);

        socket.on('receive_settings_data', (settingsData) => {
            if (!settingsData) { return; }
            const gameMode = settingsData.gameMode;

            if (gameMode) {
                setGameMode(gameMode)
            }
        });

        socket.emit('get_hanabi_settings_data', roomCode);

        return () => {
            socket.off('receive_settings_data');
        }
    }, [])

    return (
        <div className="myContainerCard">
            <div className="myContainerCardTitle">Settings</div>
            <div className="myContainerCardCenterScrollBox gap-[2vh] w-[90%] mt-[2vh]">
                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                    <div>Sort discard pile</div>
                    <ToggleSwitch isOn={shouldSort} onAction={() => {setShouldSort(true)}} offAction={() => {setShouldSort(false)}} bgColour="bg-blue-600"/>
                </div>
                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                    <div>Game Mode</div>
                    <ChoiceDropdown selectedChoice={gameMode} setSelectedChoice={setGameMode} choices={gameModeChoices}/>
                </div>
            </div>
            
            <SettingsSaveButton isSaved={isSaved} handleSave={handleSave} closeOverlay={closeOverlay}/>
        </div>
    )
}

export const getShouldSortHanabiDiscardPile = () => {
    return Cookies.get(shouldSortDiscardCookieName) === "true";
}

export const setShouldSortHanabiDiscardPile = (shouldSort) => {
    Cookies.set(shouldSortDiscardCookieName, shouldSort.toString(), { expires: 365});
}

