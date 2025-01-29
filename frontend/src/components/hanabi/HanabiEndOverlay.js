import { Overlay } from "../Overlay"

export const HanabiEndOverlay = ({endScore}) => {
    return (
        <Overlay isOpen={true} fullScreen={true}>
            <div className="flex flex-col h-full justify-center items-center text-white text-[5vh]">
                <div>Congratulations!</div>
                <div className="">
                    Your team collected {endScore} {endScore === 1 ? "flower" : "flowers"}!
                </div>
            </div>
        </Overlay>
    )
}