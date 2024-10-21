import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import getSocket from "../../socket";

const socket = getSocket()
export const RPSMeleeSettings = ({roomCode}) => {
    const [maxPoints, setMaxPoints] = useState(5);
    const [roundDuration, setRoundDuration] = useState(1000);
    const [isSaved, setIsSaved] = useState(false);
    const handleSave = () => {
        const settings = {
          maxPoints: maxPoints,
          roundDuration: roundDuration,
        };

        socket.emit("send_rps_melee_settings_data", roomCode, settings);
        setIsSaved(true);
        setTimeout(() => {
            setIsSaved(false);
        }, 2000)
    };

    useEffect(() => {
        socket.on('receive_settings_data', (settingsData) => {
            if (!settingsData) { return; }
            const maxPoints = settingsData.maxPoints;
            const roundDuration = settingsData.roundDuration;
            if (maxPoints) {
                setMaxPoints(maxPoints);
            }
            if (roundDuration) {
                setRoundDuration(roundDuration)
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
                <div className="myContainerCardInnerBox w-full">
                    <div className="myContainerCardInnerBox py-2 px-6 flex items-center justify-between">
                        <div>First to {maxPoints} wins</div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={maxPoints}
                            onChange={(e) => setMaxPoints(Number(e.target.value))}
                            className="w-[60%]"
                        />
                    </div>
                </div>

                <div className="myContainerCardInnerBox">
                    <div className="myContainerCardInnerBox py-2 px-6 flex items-center justify-between">
                        <div>Round Duration: {roundDuration}ms</div>
                        <input
                            type="range"
                            min="500"
                            max="1500"
                            step="100"
                            value={roundDuration}
                            onChange={(e) => setRoundDuration(Number(e.target.value))}
                            className="w-[60%]"
                        />
                    </div>
                </div>
            </div>


            <button className="myContainerCardBottomButton gradientButton"
                onClick={handleSave}
            >
                { isSaved ?
                    <div className="flex justify-center items-center gap-2"><FaCheck className="text-green-400"/> Saved!</div>
                :
                    <div>Save</div>
                }
            </button>



        </div>
    )
}