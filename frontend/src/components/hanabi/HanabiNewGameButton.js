import getSocket from "../../socket";

const socket = getSocket();
export const HanabiNewGameButton = ({roomCode, playersData}) => {
    return (
        <button className={"gradientButton text-white w-[20vh] h-[8vh] text-[2vh] rounded-lg shadow-xl"}
                onClick={() => {
                    socket.emit("hanabi_new_game_ready", roomCode);
                }}
                disabled={playersData[socket.userId].isReady}
        >
            {(playersData[socket.userId].isReady) ? "Waiting for others..." : "New Game"}
        </button>
    );
}