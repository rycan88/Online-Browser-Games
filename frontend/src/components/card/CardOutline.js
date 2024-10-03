import React from "react";

function CardOutline({width = 200}) {
    return (
        <div className={`standardCard p-[0] bg-slate-200/10 border-black border-dashed border-2 shadow-none`}
            style={{width: `${width}px`, height: `${width * 1.5}px`, fontSize: `${width/4}px`}}>

        </div>
    );
}

export default CardOutline;