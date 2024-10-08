import { cardChars, suitColours, suitIcons } from "./CardUtils";

export const SimplifiedCard = ({number, suit, width = 200}) => {
    const cardNumber = cardChars[number] ?? number;
    const suitIcon = suitIcons[suit];

    return (
        <div className={`simplifiedCard flex flex-col place-content-center bg-slate-200`}
            style={{color: suitColours[suit], width: `${width}px`, height: `${width * 1.5}px`, fontSize: `${width/2.3}px`, paddingLeft: width * 0.1, paddingBottom: width * 0.1, paddingRight: width * 0.05}}
        >
            
            <div className="flex justify-start font-semibold">{cardNumber}</div>
            <div className="text-[1.7em] flex justify-end w-full">{suitIcon}</div>
            
        </div>
    );
}