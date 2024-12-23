import "../../css/Card.css"

export const Card = ({number, suitIcon, suitColour, cardMiddle, cornerFontSize, cornerWidth, width = 200, withBorder=false}) => {
    return (
        <div className={`standardCard ${withBorder && "border-[1px] border-slate-500/50"}`} 
            style={{color: suitColour, width: `${width}px`, height: `${width * 1.5}px`, fontSize: `${width/4}px`, padding: `${width / 100}px ${width / 25}px`}}>
            <div className="cardCornerContainer mb-auto"
                 style={{fontSize: cornerFontSize, width: cornerWidth}}    
            >
                <h1 className="font-bold">{number}</h1>
                <div>{suitIcon}</div>
            </div>
            <div className={`cardMiddleContainer my-auto`}>
                {cardMiddle}
            </div>
            <div className="cardCornerContainer mt-auto rotate-180"
                 style={{fontSize: cornerFontSize, width: cornerWidth}} 
            >
                <h1 className="font-bold">{number}</h1>
                <div className="">{suitIcon}</div>
            </div>
        </div>
    );
}
