import { useContext, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ToggleSwitch } from "../ToggleSwitch";
import Cookies from "js-cookie";
import { OddColourOutContext } from "../../pages/OddColourOut";
import { SettingsSaveButton } from "../SettingsSaveButton";
import { ChoiceDropdown } from "../ChoiceDropdown";

const timeModeChoices = {"unlimited": "Unlimited", "increment": "10s + 1s", "30sec": "30s", "1min": "1min", "2min": "2min"}

const isMarkedCookieName = "oddColourOutIsAnswerMarked";
const timeModeCookieName = "oddColourOutTimeMode";

export const OddColourOutSettings = ({closeOverlay}) => {
    const { triggerRerender } = useContext(OddColourOutContext);

    const [isAnswerMarked, setIsAnswerMarked] = useState(false); 
    const [isSaved, setIsSaved] = useState(false);
    const [timeMode, setTimeMode] = useState("unlimited"); 

    const handleSave = () => {
        Cookies.set(isMarkedCookieName, isAnswerMarked.toString(), { expires: 365});
        Cookies.set(timeModeCookieName, timeMode, { expires: 365});

        triggerRerender();
        
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
        }, 2000)
    };

    useEffect(() => {
        const isMarked = getOddColourOutIsMarked();
        const timeMode = getOddColourOutTimeMode();

        setIsAnswerMarked(isMarked);
        setTimeMode(timeMode);
    }, [])

    return (
        <div className="myContainerCard">
            <div className="myContainerCardTitle">Settings</div>
            <div className="myContainerCardCenterScrollBox gap-[2vh] w-[90%] mt-[2vh]">
                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                    <div>Time Mode</div>
                    <ChoiceDropdown selectedChoice={timeMode} setSelectedChoice={setTimeMode} choices={timeModeChoices}/>
                </div>

                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                    <div>Mark Correct Answer</div>
                    <ToggleSwitch isOn={isAnswerMarked} onAction={() => {setIsAnswerMarked(true)}} offAction={() => {setIsAnswerMarked(false)}} bgColour="bg-blue-600"/>
                </div>
            </div>
            
            <SettingsSaveButton isSaved={isSaved} handleSave={handleSave} closeOverlay={closeOverlay}/>
        </div>
    )
}

export const getOddColourOutIsMarked = () => {
    return Cookies.get(isMarkedCookieName) === "true";
}

export const getOddColourOutTimeMode = () => {
    const mode = Cookies.get(timeModeCookieName);
    if (Object.keys(timeModeChoices).includes(mode)) {
        return mode;
    } else {
        return "unlimited";
    }
}