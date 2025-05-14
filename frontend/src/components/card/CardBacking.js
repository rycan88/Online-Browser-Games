import React from "react";

function CardBacking({width = 200, num=""}) {
    return (
        <div className={`relative standardCard p-[0] border-slate-400/10`}
                style={{width: `${width}px`, height: `${width * 1.4}px`, fontSize: `${width/4}px`}}>
            <div className="w-full h-full bg-sky-600" style={{padding: width * 0.06}}>
                <div className="w-full h-full bg-sky-700 border-black" style={{borderWidth: width * 0.01}}></div>
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-white" style={{fontSize: `${width/2}px`}}>
                    {num}
                </div>
            </div>
        </div>
    );
}

export default CardBacking;