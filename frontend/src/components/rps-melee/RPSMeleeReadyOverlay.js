import getSocket from "../../socket";
import { Overlay } from "../Overlay";

const socket = getSocket();
export const RPSMeleeReadyOverlay = ({roomCode, isReady}) => {
    return (
        <Overlay isOpen={true}>
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
