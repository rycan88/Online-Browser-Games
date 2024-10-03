import React from "react";

function CardBacking({width = 200}) {
    return (
        <div className={`standardCard p-[0] border-slate-400/10`}
                style={{width: `${width}px`, height: `${width * 1.5}px`, fontSize: `${width/4}px`}}>
            <div className="w-full h-full p-2 bg-sky-600">
                <div className="w-full h-full bg-sky-700 border-2 border-black"></div>
            </div>
        </div>
    );
}

export default CardBacking;