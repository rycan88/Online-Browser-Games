import { IoPerson } from "react-icons/io5";
import { ReadyStatusIcon } from "../ReadyStatusIcon";

export const CrossBattlePlayerList = ({playersData}) => {
    if (!playersData) {return <></> }

    const playerCount = Object.keys(playersData).length;
    const playerList = Object.values(playersData).map((data) => {
        return (
            <div className="flex justify-between items-center gap-[12px]">
                <div>{data.nameData.nickname}</div>
                <ReadyStatusIcon isReady={data.hasSubmitted} greenColor="text-green-600" redColor="text-red-500"/>
            </div>
        );
    }); 


    return (
        <div className="relative flex items-center justify-center mx-[6px] group">
            <div className="flex gap-[8px] items-center justify-center py-[6px] px-[12px] bg-gradient-to-tr from-sky-950 to-sky-600 rounded-lg">
                <IoPerson />
                {`${playerCount} player${playerCount === 1 ? "" : "s"}`}
            </div>
            <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-gradient-to-tr from-slate-400 to-slate-300 text-black rounded-lg shadow-lg py-[12px] px-[18px] min-w-[100%]">
                <div className="flex flex-col gap-[8px]">
                    { playerList }
                </div>
            </div>
        </div>

    );
}