import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ToggleSwitch } from "../ToggleSwitch";
import getSocket from "../../socket";
import { SettingsSaveButton } from "../SettingsSaveButton";

const socket = getSocket()
export const RPSMeleeSettings = ({roomCode, closeOverlay}) => {
    const [maxPoints, setMaxPoints] = useState(5);
    const [roundDuration, setRoundDuration] = useState(1000);
    const [withGun, setWithGun] = useState(true);

    const handleSave = () => {
        const settings = {
          maxPoints: maxPoints,
          roundDuration: roundDuration,
          withGun: withGun,
        };

        socket.emit("send_rps_melee_settings_data", roomCode, settings);
    };

    useEffect(() => {
        socket.on('receive_settings_data', (settingsData) => {
            if (!settingsData) { return; }
            const maxPoints = settingsData.maxPoints;
            const roundDuration = settingsData.roundDuration;
            const withGun = settingsData.withGun;

            if (maxPoints) {
                setMaxPoints(maxPoints);
            }
            if (roundDuration) {
                setRoundDuration(roundDuration)
            }
            if (withGun != null) {
                setWithGun(withGun);
            }
        });

        socket.emit('get_rps_melee_settings_data', roomCode);

        return () => {
            socket.off('receive_settings_data');
        }
    }, [])

    return (
        <div className="myContainerCard">
            <div className="myContainerCardTitle">Settings</div>
            <div className="myContainerCardCenterScrollBox gap-[2vh] w-[90%] mt-[2vh]">

                <div className="myContainerCardInnerBox py-2 px-6 flex items-center justify-between">
                    <div>First to {maxPoints} wins</div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={maxPoints}
                        onChange={(e) => setMaxPoints(Number(e.target.value))}
                        className="w-[60%] accent-sky-600"
                    />
                </div>
                
                <div className="myContainerCardInnerBox py-2 px-6 flex items-center justify-between">
                    <div>Round Duration: {roundDuration}ms</div>
                    <input
                        type="range"
                        min="500"
                        max="1500"
                        step="100"
                        value={roundDuration}
                        onChange={(e) => setRoundDuration(Number(e.target.value))}
                        className="w-[60%] accent-sky-600"
                    />
                </div>
                <div className="myContainerCardInnerBox py-2 px-6 flex items-center justify-between">
                    <div>With Gun and Reflector</div>
                    <ToggleSwitch isOn={withGun} onAction={() => {setWithGun(true)}} offAction={() => {setWithGun(false)}} bgColour="bg-sky-600"/>
                </div>
            </div>
            
            <SettingsSaveButton handleSave={handleSave} closeOverlay={closeOverlay}/>
        </div>
    )
}