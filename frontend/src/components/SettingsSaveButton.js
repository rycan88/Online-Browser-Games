import { useState } from "react"
import { FaCheck } from "react-icons/fa"

export const SettingsSaveButton = ({handleSave, closeOverlay}) => {
    const [isSaved, setIsSaved] = useState(false);

    return (
        <button className="myContainerCardBottomButton gradientButton"
            onClick={() => {
                handleSave();

                setIsSaved(true);
                setTimeout(() => {
                    setIsSaved(false);

                    if (closeOverlay) {
                        closeOverlay();
                    }

                }, 1000)
            }}
        >
            { isSaved ?
                <div className="flex justify-center items-center gap-2"><FaCheck className="text-green-400"/> Saved!</div>
            :
                <div>Save</div>
            }
        </button>
    )
}