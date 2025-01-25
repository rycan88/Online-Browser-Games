import React from "react";

function CardOutline({width = 200, borderColor="border-black"}) {
    return (
        <div className={`standardCard p-[0] bg-slate-200/10 ${borderColor} border-dashed border-2 shadow-none`}
            style={{width: `${width}px`, height: `${width * 1.4}px`, fontSize: `${width/4}px`}}>

        </div>
    );
}

export default CardOutline;