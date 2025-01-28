import { MdVisibility, MdVisibilityOff } from "react-icons/md"

export const HanabiHintVisibilityButton = ({showTeammateHints, setShowTeammateHints}) => {
    return (
        <button className="text-[3vh] px-[10px]"
             onClick={() => {
                setShowTeammateHints((prev) => !prev);
             }}
        >
            { showTeammateHints ?
                <MdVisibility />
            :
                <MdVisibilityOff />
            }
        </button>

    )
}