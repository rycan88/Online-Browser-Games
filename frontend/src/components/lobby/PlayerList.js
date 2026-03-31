import getSocket from "../../socket";

const socket = getSocket();

export const PlayerList = ({players, isRoomHost, setKickPlayer}) => {
    return (
        <div className="flex flex-col gap-2">
            <div className={`flex items-center gap-3 py-[1vh] text-sm font-semibold tracking-wider text-slate-800`}>
                <div className={`flex-1 h-[2px] bg-slate-800/50`}/>
                
                <h2 className="text-[2.5vh]">{`Players (${players.length})`}</h2>

                <div className={`flex-1 h-[2px] bg-slate-800/50`}/>
            </div>

            {players.map((player) => {
                const isPlayer = socket.userId === player.userId;
                return (       
                    <div className={`flex items-center justify-center text-[2.2vh] w-full`}>
                        <div className={`${isPlayer ? "text-sky-700" : (isRoomHost && "cursor-pointer hover:text-yellow-800 hover:underline")}`}
                             onClick={() => {
                                setKickPlayer(player);
                             }}
                        >
                            {player.nickname}
                        </div>
                    </div>
                );

            })}
        </div>
    );
}