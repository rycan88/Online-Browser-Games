
import { FaCheck } from "react-icons/fa6";
import { IoMdUndo } from "react-icons/io";

export const CrossBattleSubmitButton = ({hasSubmitted, setHasSubmitted, onClickAction}) => {
    return (
        <>
            <div className={`flex items-center justify-center text-slate-100 text-[3vh] hover:cursor-pointer shadow-xl`}
                onClick={() => {
                    if (!hasSubmitted) {
                        onClickAction()
                    }
                    setHasSubmitted(!hasSubmitted);
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