import getSocket from "../../socket";

const socket = getSocket();

export const PlayerList = (props) => {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl">Players</h2>
            {props.players.map((player, index) => {
                return (
                    <div className="flex">
                        <h2 className={`text-xl text-right w-[40%] ${socket.userId === player.userId && "text-sky-700"}`}>{index + 1}.</h2>
                        <h2 className={`text-xl text-left pl-2 w-[60%] ${socket.userId === player.userId && "text-sky-700"}`}>{player.nickname}</h2>
                    </div>
                );

            })}
        </div>

    );
}