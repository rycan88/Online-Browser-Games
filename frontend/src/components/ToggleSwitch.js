import { useEffect, useState } from "react";

export const ToggleSwitch = ({isOn, onAction, offAction, bgColour="bg-sky-800"}) => {
    const [toggleIsOn, setToggleIsOn] = useState(isOn);
    const [hasTransition, setHasTransition] = useState(false); 

    useEffect(() => {
        setToggleIsOn(isOn);
    }, [isOn])

    const toggleSwitch = () => {
        setHasTransition(true);
        if (toggleIsOn && offAction) {
            offAction();
        } else if (!toggleIsOn && onAction) {
            onAction();
        }

        setToggleIsOn(!toggleIsOn);
    };
    return (
        <div className={`relative w-[55px] h-[30px] flex items-center rounded-full p-[6px] cursor-pointer shadow-xl transition-colors ${hasTransition ? "duration-300" : "duration-0"}  ${toggleIsOn ? bgColour : 'bg-slate-300'}`}
            onClick={toggleSwitch}
            >
            <div
                className={`bg-white absolute w-[20px] h-[20px] rounded-full shadow-md transform transition-all ${hasTransition ? "duration-300" : "duration-0"} ${toggleIsOn ? "right-[10%]" : "right-[90%] translate-x-[100%]"}`}
            ></div>
        </div>
    );
}