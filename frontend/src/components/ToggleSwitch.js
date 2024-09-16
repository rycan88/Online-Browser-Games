import { useEffect, useState } from "react";

export const ToggleSwitch = (props) => {
    const [isOn, setIsOn] = useState(props.isOn);

    useEffect(() => {
        setIsOn(props.isOn);
    }, [props.isOn])

    const toggleSwitch = () => {
        if (isOn && props.offAction) {
            props.offAction();
        } else if (!isOn && props.onAction) {
            props.onAction();
        }

        setIsOn(!isOn);
    };
    return (
        <div className={`relative w-[55px] h-[30px] flex items-center rounded-full p-[6px] cursor-pointer transition-colors duration-300 ${isOn ? 'bg-sky-800' : 'bg-slate-300'}`}
            onClick={toggleSwitch}
            >
            <div
                className={`bg-white w-[20px] h-[20px] rounded-full shadow-md transform transition-transform duration-300 ${
                isOn ? 'translate-x-[23px]' : ''
                }`}
            ></div>
        </div>
    );
}