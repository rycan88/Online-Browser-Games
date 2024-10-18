import { FaHandPaper, FaHandRock, FaHandScissors } from "react-icons/fa";
import "../css/RPSMelee.css";
import { RPSMeleeOptionButton } from "../components/rps-melee/RPSMeleeOptionButton";
import { RPSMeleeTimeBar } from "../components/rps-melee/RPSMeleeTimeBar";
import { useEffect, useState } from "react";
import getSocket from "../socket";
import LoadingScreen from "../components/LoadingScreen";

const icons = {"rock": <div>✊</div>, "paper": <div className="rotate-180">📃</div>, "scissors": <div className="rotate-180">✂️</div>}

const socket = getSocket();

export const RPSMelee = ({roomCode}) => {
    const [dataInitialized, setDataInitialized] = useState(false);
    //const [gameData, setGameData] = useState({});
    const [myData, setMyData] = useState([]);
    const [opponentData, setOpponentData] = useState([]);
    const [roundStartTime, setRoundStartTime] = useState(null);
    const [roundInterval, setRoundInterval] = useState(null);
    const [isRoundActive, setIsRoundActive] = useState(false);
    const [timeBarPercent, setTimeBarPercent] = useState(100);

    useEffect(() => {    
        socket.on('receive_players_data', (playersData) => {
            const playersList = Object.values(playersData);

            if (playersList.length !== 2) { console.log("WHAT"); return; }

            const myData = playersData[socket.userId];
            const opponentData = playersData[myData.opponent.userId];

            setMyData(myData);
            setOpponentData(opponentData);
            setDataInitialized(true);
            console.log("HI")
        });

        socket.on('round_started', (roundStartTime, roundInterval) => {
            setRoundInterval(roundInterval);
            setIsRoundActive(true);
            setRoundStartTime(roundStartTime);
            setTimeBarPercent(100);
        });

        socket.on('round_ended', () => {
            setIsRoundActive(false);
            setRoundStartTime(null);
            setTimeBarPercent(0);
        });
        
        /*
        socket.on('receive_game_data', (gameData) => {
            setGameData(gameData);
        });
        */

        socket.emit('join_room', roomCode);
        socket.emit('get_all_rps_melee_data', roomCode);

        return () => {
            socket.off('receive_own_cards');
            socket.off('round_started');
        }
    }, []);

    useEffect(() => {
        let intervalId;
        if (isRoundActive && roundStartTime && roundInterval) {
            intervalId = setInterval(() => {
                const timeDiff = Math.max((roundStartTime + roundInterval) - Date.now(), 0);
                const percent = timeDiff * 100 / roundInterval;
                setTimeBarPercent(percent);
            }, 20);

        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRoundActive, roundStartTime, roundInterval]);

    if (!dataInitialized) {
        return <LoadingScreen />;
    }

    const myChoice = icons[myData.choice];

    return (
        <div className="RPSMeleePage entirePage select-none z-[0] text-slate-400">
            <div className="absolute flex flex-col gap-[2vh] justify-center items-center left-[0] h-full w-[30%] text-white text-[clamp(12px,3vh,24px)]">
                <>
                    <div>{opponentData.nameData.nickname}</div> 
                    <div className="text-[1.5em]">{opponentData.score}</div>
                </>

                <RPSMeleeTimeBar percent={timeBarPercent ?? 100}/>

                <>
                    <div className="text-[1.5em]"> {myData.score}</div>
                    <div>{myData.nameData.nickname}</div>
                </>

            </div>
            <div className="fightArea rotate-180">
                { icons[opponentData.choice] ?? <div>❔</div> }
            </div>
            <div className="fightArea ">
                { myChoice ?? <div>❔</div>}
            </div>
            <div className="buttonChoices flex flex-col h-[40%] w-full py-[0.5vh]">
                <div className="flex h-[50%] justify-center items-end">
                    <RPSMeleeOptionButton roomCode={roomCode} type={"rock"} icon={icons["rock"]} direction={"Up"} isDisabled={Boolean(myChoice)}/>
                </div>
                <div className="flex gap-[1.5%] h-[50%] justify-center">
                    <RPSMeleeOptionButton roomCode={roomCode} type={"paper"} icon={icons["paper"]} direction={"Left"} isDisabled={Boolean(myChoice)}/>
                    <RPSMeleeOptionButton roomCode={roomCode} type={"scissors"} icon={icons["scissors"]} direction={"Right"} isDisabled={Boolean(myChoice)}/>                
                </div>               
            </div>
            <div className="entirePage bg-black/70 z-[-10]"></div>
        </div>

    );
}