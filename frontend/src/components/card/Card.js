import "../../css/Card.css"

export const Card = ({number, suitIcon, suitColour, cardMiddle, cornerFontSize, cornerWidth, width = 200, withBorder=false}) => {
    const isRainbow = suitColour === "rainbow";
    return (
        <div className={`standardCard ${withBorder && "border-[1px] border-slate-500/50"}`} 
            style={{color: !isRainbow && suitColour, width: `${width}px`, height: `${width * 1.4}px`, fontSize: `${width/4}px`, padding: `${width / 50}px 0px`}}>
            <div className={`cardCornerContainer mb-auto`}
                 style={{fontSize: cornerFontSize, width: cornerWidth}}    
            >
                <h1 className={`font-bold ${isRainbow && "rainbowText"}`}>{number}</h1>
                <div className={`${isRainbow && "rainbowText"}`}>{suitIcon}</div>
            </div>
            <div className={`cardMiddleContainer my-auto ${isRainbow && "rainbowText"}`}>
                {cardMiddle}
            </div>
            <div className={`cardCornerContainer mt-auto rotate-180 ${isRainbow && "rainbowText"}`}
                 style={{fontSize: cornerFontSize, width: cornerWidth}} 
            >
                <h1 className={`font-bold ${isRainbow && "rainbowText"}`}>{number}</h1>
                <div className={`${isRainbow && "rainbowText"}`}>{suitIcon}</div>
            </div>
        </div>
    );
}
