import { useEffect, useState } from "react";

export const ToggleSwitch = ({isOn, onAction, offAction, bgColour="bg-sky-800"}) => {
    const [toggleIsOn, setToggleIsOn] = useState(isOn);

    useEffect(() => {
        setToggleIsOn(isOn);
    }, [isOn])

    const toggleSwitch = () => {
        if (toggleIsOn && offAction) {
            offAction();
        } else if (!toggleIsOn && onAction) {
            onAction();
        }

        setToggleIsOn(!toggleIsOn);
    };
    return (
        <div className={`relative w-[55px] h-[30px] flex items-center rounded-full p-[6px] cursor-pointer transition-colors duration-300 shadow-xl ${toggleIsOn ? bgColour : 'bg-slate-300'}`}
            onClick={toggleSwitch}
            >
            <div
                className={`bg-white absolute w-[20px] h-[20px] rounded-full shadow-md transform transition-all duration-300 ${toggleIsOn ? "right-[10%]" : "right-[90%] translate-x-[100%]"}`}
            ></div>
        </div>
    );
}