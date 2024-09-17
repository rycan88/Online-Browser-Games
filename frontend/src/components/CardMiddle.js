
export const CardMiddle = ({number, suitIcon}) => {
    if (1 <= number && number <= 3) {
        return (
            <div className={`flex flex-col h-full items-center ${number === 1 ? "justify-center" : "justify-between"}`}>
                {[...Array(Number(number))].map((_symb, index) => {
                        return <div className={`middleSuitIcon ${index === 2 && "rotate-180"}`}>{suitIcon}</div>;  
                })}
            </div>
        );
    } else if (4 <= number && number <= 8) {
        return <div className="flex flex-col w-full h-full items-center justify-between">
            <div className="flex justify-between w-full">
                <div className="middleSuitIcon">{suitIcon}</div>
                <div className="middleSuitIcon">{suitIcon}</div> 
            </div>
            {number !== 4 && 
            <div className={`flex ${number === 5 ? "justify-center" : "justify-between"} w-full`}>
                <div className="middleSuitIcon">{suitIcon}</div> 
                {number >= 6 && <div className="middleSuitIcon">{suitIcon}</div> }
            </div>                
            }
            <div className="flex justify-between w-full rotate-180">
                <div className="middleSuitIcon">{suitIcon}</div> 
                <div className="middleSuitIcon">{suitIcon}</div> 
            </div>
            { number >= 7 && <div className="absolute bottom-1/2 transform -translate-y-1/2 middleSuitIcon">{suitIcon}</div> }
            { number === 8 && <div className="absolute top-1/2 transform translate-y-1/2 middleSuitIcon rotate-180">{suitIcon}</div> }
        </div>
    } else if (9 <= number && number <= 10) {
        return <div className="flex flex-col w-full h-full items-center justify-between">
            <div className="flex justify-between w-full">
                <div className="middleSuitIcon">{suitIcon}</div>
                <div className="middleSuitIcon">{suitIcon}</div> 
            </div>
            <div className="flex justify-between w-full">
                <div className="middleSuitIcon">{suitIcon}</div>
                <div className="middleSuitIcon">{suitIcon}</div> 
            </div>
            <div className="flex justify-between w-full rotate-180">
                <div className="middleSuitIcon">{suitIcon}</div>
                <div className="middleSuitIcon">{suitIcon}</div> 
            </div>
            <div className="flex justify-between w-full rotate-180">
                <div className="middleSuitIcon">{suitIcon}</div> 
                <div className="middleSuitIcon">{suitIcon}</div> 
            </div>
            { number === 9 && <div className="absolute top-1/2 -translate-y-1/2 middleSuitIcon">{suitIcon}</div> }            
            { number === 10 && <div className="absolute bottom-1/2 transform -translate-y-1/2 middleSuitIcon">{suitIcon}</div> }
            { number === 10 && <div className="absolute top-1/2 transform translate-y-1/2 middleSuitIcon rotate-180">{suitIcon}</div> }
        </div>
    }

    return <div className="text-5xl bg-blue-700">{suitIcon}</div>;
}