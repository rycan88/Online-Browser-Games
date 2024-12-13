import { useContext, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ToggleSwitch } from "../ToggleSwitch";
import getSocket from "../../socket";
import { SettingsSaveButton } from "../SettingsSaveButton";
import { ChoiceDropdown } from "../ChoiceDropdown";

const socket = getSocket()

const timeLimitChoices = {"unlimited": "Unlimited", "15s": "15s", "30s": "30s", "45s": "45s", "60s": "60s", "90s": "90s"}
export const TelepathSettings = ({roomCode, closeOverlay, showTeamModeOption=true}) => {
    const [timeLimit, setTimeLimit] = useState("unlimited");
    const [isTeamMode, setIsTeamMode] = useState(true);

    const handleSave = () => {
        const settings = {
            timeLimit: timeLimit,
            teamMode: isTeamMode
        };

        socket.emit("send_telepath_settings_data", roomCode, settings);
    };

    useEffect(() => {
        socket.on('receive_settings_data', (settingsData) => {
            if (!settingsData) { return; }
            const timeLimit = settingsData.timeLimit;

            if (timeLimit) {
                setTimeLimit(timeLimit)
            }
        });

        socket.on('update_team_mode', (isTeamMode) => {
            setIsTeamMode(isTeamMode)
        });

        socket.emit('get_telepath_settings_data', roomCode);

        return () => {
            socket.off('receive_settings_data');
            //socket.off('update_team_mode');
        }
    }, [])

    return (
        <div className="myContainerCard">
            <div className="myContainerCardTitle">Settings</div>
            <div className="myContainerCardCenterScrollBox gap-[2vh] w-[90%] mt-[2vh]">
                { showTeamModeOption &&
                    <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">
                        <div>Team Mode</div>
                        <ToggleSwitch isOn={isTeamMode} onAction={() => {setIsTeamMode(true)}} offAction={() => {setIsTeamMode(false)}} bgColour="bg-sky-600"/>
                    </div>
                }

                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                    <div>Time Mode</div>
                    <ChoiceDropdown selectedChoice={timeLimit} setSelectedChoice={setTimeLimit} choices={timeLimitChoices}/>
                </div>
            </div>
            
            <SettingsSaveButton handleSave={handleSave} closeOverlay={closeOverlay}/>
        </div>
    )
}