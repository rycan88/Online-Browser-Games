import { useContext, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ToggleSwitch } from "../ToggleSwitch";
import Cookies from "js-cookie";
import { OddColourOutContext } from "../../pages/OddColourOut";
import { SettingsSaveButton } from "../SettingsSaveButton";

const isMarkedCookieName = "oddColourOutIsAnswerMarked";
export const OddColourOutSettings = ({closeOverlay}) => {
    const { triggerRerender } = useContext(OddColourOutContext);

    const [isAnswerMarked, setIsAnswerMarked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    
    const handleSave = () => {
        Cookies.set(isMarkedCookieName, isAnswerMarked.toString(), { expires: 365});
        
        triggerRerender();
        
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
        }, 2000)
    };

    useEffect(() => {
        const isMarked = getOddColourOutIsMarked();
        
        setIsAnswerMarked(isMarked);
    }, [])

    return (
        <div className="myContainerCard">
            <div className="myContainerCardTitle">Settings</div>
            <div className="myContainerCardCenterScrollBox gap-[2vh] w-[90%] mt-[2vh]">
                <div className="myContainerCardInnerBox py-2 px-6 flex items-center justify-between">
                    <div>Mark Correct Answer</div>
                    <ToggleSwitch isOn={isAnswerMarked} onAction={() => {setIsAnswerMarked(true)}} offAction={() => {setIsAnswerMarked(false)}} bgColour="bg-blue-600"/>
                </div>
            </div>
            
            <SettingsSaveButton isSaved={isSaved} handleSave={handleSave} closeOverlay={closeOverlay}/>
        </div>
    )
}

export const getOddColourOutIsMarked = () => {
    return Cookies.get(isMarkedCookieName) === "true"
}