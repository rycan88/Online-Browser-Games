
import { FaCheck } from "react-icons/fa6";
import { IoMdUndo } from "react-icons/io";
import getSocket from "../../socket";

const socket = getSocket();
export const CrossBattleSubmitButton = ({roomCode, hasSubmitted}) => {
    return (
        <>
            <div className={`flex items-center justify-center text-slate-100 text-[3vh] hover:cursor-pointer shadow-xl`}
                onClick={() => {
                    socket.emit("cross_battle_has_submitted", roomCode, !hasSubmitted);
                }}
            >
                { hasSubmitted ?
                    <IoMdUndo />
                  :
                    <FaCheck />
                }
            </div>
        </>
    )
}