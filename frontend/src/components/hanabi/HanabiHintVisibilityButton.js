import { useEffect } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md"

export const HanabiHintVisibilityButton = ({showTeammateHints, setShowTeammateHints}) => {
    const handlePress = () => setShowTeammateHints(true);
    const handleRelease = () => setShowTeammateHints(false);

    useEffect(() => {
        window.addEventListener("mouseup", handleRelease);

        return () => {
            window.removeEventListener("mouseup", handleRelease);
        };
    }, []);

    return (
        <button className="text-[3vh] px-[10px]"
            onMouseDown={handlePress}
            onMouseUp={handleRelease}

            onTouchStart={handlePress}
            onTouchEnd={handleRelease}
            onTouchCancel={handleRelease}
        >
            { showTeammateHints ?
                <MdVisibilityOff />
            :
                <MdVisibility />
            }
        </button>

    )
}