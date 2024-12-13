import getSocket from "../../socket";
import { InfoButton } from "../InfoButton";
import { Overlay } from "../Overlay";
import { RPSMeleeRules } from "./RPSMeleeRules";
import { RPSMeleeSettings } from "./RPSMeleeSettings";

const socket = getSocket();
export const RPSMeleeReadyOverlay = ({roomCode, isReady}) => {
    return (
        <Overlay isOpen={true}>
            <div className="topTaskBar">
                <InfoButton buttonType="info">
                    <RPSMeleeRules />
                </InfoButton>
                
                <InfoButton buttonType="settings">
                    <RPSMeleeSettings roomCode={roomCode}/>
                </InfoButton>   
            </div>
            <button className="gradientButton flex justify-center items-center text-white text-6xl p-6 rounded-xl"
                onClick={() => {
                    socket.emit("rps_melee_ready", roomCode);
                }}
                disabled={isReady}
            >
                { isReady ?
                    "Waiting for opponent..."
                    :
                    "Ready?"
                }
            </button>
        </Overlay>
    )
}
