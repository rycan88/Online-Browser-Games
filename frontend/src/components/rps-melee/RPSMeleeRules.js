import { FaHeart } from "react-icons/fa6"
import { SimplifiedCard } from "../card/SimplifiedCard"

const icons = {"rock": <div>✊</div>, "paper": <div>📃</div>, "scissors": <div>✂️</div>, "gun": <div>🔫</div>, "reflector": <div>🛡️</div>}
export const RPSMeleeRules = () => {    
    const CARD_WIDTH = Math.min((window.innerHeight * 0.05) * (2/3), (window.innerWidth * 0.5));
    return (
        <div className="myContainerCard text-[2vh]">
            <div className="myContainerCardTitle">
                Rules
            </div>
            <div className="overflow-y-auto scrollbar-hide flex flex-col gap-2 text-start">
                <h1 className="w-full text-[1.5em] text-start pl-3 underline">Overview</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div className="indent">This is a fast paced version of rock paper scissors. Multiple rounds will play out within seconds of each other, so think fast to outplay your opponent. First to X amount of points wins that match!</div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Gameplay</h1>
                <div className="myContainerCardInnerBox flex-col py-[1vh] px-[2vh]">
                    <div >Each round will last around one second and will keep going until one player reaches the point goal. These values can be changed in the settings. Pick an element that beats your opponent's element. Your opponent can see your choice when you select your element, so try to wait until the last moment to surprise your opponent!</div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Matchups</h1>
                <div className="myContainerCardInnerBox flex-col gap-2 py-[1vh] px-[2vh]">
                    <div>Just like in regular rock paper scissors, we have:</div>
                    <div className="flex w-full justify-around py-[8px]">
                        <div className="flex gap-[4px]">
                            {icons["rock"]} 
                            {">"} 
                            {icons["scissors"]}
                        </div>
                        <div className="flex gap-[4px]">
                            {icons["paper"]} 
                            {">"} 
                            {icons["rock"]}
                        </div>
                        <div className="flex gap-[4px]">
                            {icons["scissors"]} 
                            {">"} 
                            {icons["paper"]}
                        </div>
                    </div>
                    <div>
                        But there are also two more options that can be picked. Gun and Reflector!
                    </div>
                    <div className="flex w-full justify-around py-[8px]">
                        <div className="flex gap-[4px]">
                            {icons["gun"]}
                            {">"} 
                            {icons["rock"]}
                            {icons["paper"]}
                            {icons["scissors"]}
                            {">"}
                            {icons["reflector"]}
                        </div>
                        <div className="flex gap-[4px]">
                            {icons["reflector"]} 
                            {">"} 
                            {icons["gun"]}
                        </div>
                    </div>
                    <div>
                        Gun beats everything except for reflector, while reflector loses to everything except for gun. (Gun and reflector can be disabled in the settings)
                    </div>
                </div>

                <h1 className="w-full text-[1.5em] pl-3 underline">Controls</h1>
                <div className="myContainerCardInnerBox flex-col gap-2 py-[1vh] px-[2vh]">
                    <div className="flex w-full justify-around py-[8px]">
                        <div className="flex gap-[4px]">
                            {icons["rock"]}
                            {"-> W or UP ARROW"} 
                        </div>
                        <div className="flex gap-[4px]">
                            {icons["paper"]}
                            {"-> A or LEFT ARROW"} 
                        </div>
                        <div className="flex gap-[4px]">
                            {icons["scissors"]}
                            {"-> D or RIGHT ARROW"} 
                        </div>
                    </div>
                    <div className="flex w-full justify-around py-[8px]">
                        <div className="flex gap-[4px]">
                            {icons["gun"]}
                            {"-> Q"} 
                        </div>
                        <div className="flex gap-[4px]">
                            {icons["reflector"]}
                            {"-> E"} 
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}