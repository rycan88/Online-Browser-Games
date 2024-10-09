import { cardChars, suitColours, suitIcons } from "./CardUtils";

export const SimplifiedCard = ({number, suit, width = 200}) => {
    const cardNumber = cardChars[number] ?? number;
    const suitIcon = suitIcons[suit];

    return (
        <div className={`simplifiedCard flex flex-col place-content-center bg-slate-200`}
            style={{color: suitColours[suit], width: `${width}px`, height: `${width * 1.5}px`, fontSize: `${width/2.3}px`}}
        >
            
            <div className="absolute text-[1.2em] font-bold"
                style={{top: 0, left: width * 0.1}}>
                    {cardNumber}
            </div>
            <div className="absolute text-[1.7em]" 
                style={{bottom: width * 0.07, right: width * 0.05}}>
                {suitIcon}
            </div>
            
        </div>
    );
}