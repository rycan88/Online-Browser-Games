import { useContext, useEffect, useState } from "react";
import { ToggleSwitch } from "../ToggleSwitch";
import getSocket from "../../socket";
import { SettingsSaveButton } from "../SettingsSaveButton";
import { ChoiceDropdown } from "../ChoiceDropdown";
import Cookies from "js-cookie";


const socket = getSocket()

const timeLimitChoices = {"unlimited": "Unlimited", "30s": "30s", "60s": "60s", "90s": "90s", "120s": "120s", "180s": "180s"}
const canTileSwapCookieName = "crossBattleCanTileSwap";
export const CrossBattleSettings = ({roomCode, closeOverlay}) => {
    const [timeLimit, setTimeLimit] = useState("unlimited");
    const [canTileSwap, setCanTileSwap] = useState(true);

    const handleSave = () => {
        Cookies.set(canTileSwapCookieName, canTileSwap.toString(), { expires: 365});

        const settingsData = {
            timeLimit: timeLimit,
        }
        socket.emit('set_cross_battle_settings_data', roomCode, settingsData);

    };

    useEffect(() => {
        socket.on('receive_settings_data', (settingsData) => {
            if (!settingsData) { return; }
            const timeLimit = settingsData.timeLimit;

            if (timeLimit) {
                setTimeLimit(timeLimit)
            }
        });

        const canTileSwap = getCrossBattleCanTileSwap();
        setCanTileSwap(canTileSwap);
        socket.emit('get_cross_battle_settings_data', roomCode);

        return () => {
            socket.off('receive_settings_data');
            //socket.off('update_team_mode');
        }
    }, [])


    useEffect(() => {

    }, [])


    return (
        <div className="myContainerCard">
            <div className="myContainerCardTitle">Settings</div>
            <div className="myContainerCardCenterScrollBox gap-[2vh] w-[90%] mt-[2vh]">

                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                    <div>Time Mode</div>
                    <ChoiceDropdown selectedChoice={timeLimit} setSelectedChoice={setTimeLimit} choices={timeLimitChoices}/>
                </div>
                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">
                    <div>Disable Tile Swapping</div>
                    <ToggleSwitch isOn={!canTileSwap} onAction={() => {setCanTileSwap(false)}} offAction={() => {setCanTileSwap(true)}} bgColour="bg-sky-600"/>
                </div>



            </div>
            
            <SettingsSaveButton handleSave={handleSave} closeOverlay={closeOverlay}/>
        </div>
    )
}

export const getCrossBattleCanTileSwap = () => {
    return Cookies.get(canTileSwapCookieName) !== "false";
}
