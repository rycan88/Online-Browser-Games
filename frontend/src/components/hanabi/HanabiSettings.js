import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ToggleSwitch } from "../ToggleSwitch";
import { SettingsSaveButton } from "../SettingsSaveButton";

const shouldSortDiscardCookieName = "shouldSortHanabiDiscardPile";


export const HanabiSettings = ({triggerRerender, closeOverlay}) => {
    const [shouldSort, setShouldSort] = useState(false); 
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        Cookies.set(shouldSortDiscardCookieName, shouldSort.toString(), { expires: 365});

        triggerRerender();
        
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
        }, 2000)
    };

    useEffect(() => {
        const shouldSort = getShouldSortHanabiDiscardPile();

        setShouldSort(shouldSort);
    }, [])

    return (
        <div className="myContainerCard">
            <div className="myContainerCardTitle">Settings</div>
            <div className="myContainerCardCenterScrollBox gap-[2vh] w-[90%] mt-[2vh]">
                <div className="myContainerCardInnerBox py-2 px-[5%] flex items-center justify-between">                    
                    <div>Sort discard pile</div>
                    <ToggleSwitch isOn={shouldSort} onAction={() => {setShouldSort(true)}} offAction={() => {setShouldSort(false)}} bgColour="bg-blue-600"/>
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

