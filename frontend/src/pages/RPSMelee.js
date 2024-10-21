import { FaCheck} from "react-icons/fa";
import "../css/RPSMelee.css";
import { RPSMeleeOptionButton } from "../components/rps-melee/RPSMeleeOptionButton";
import { RPSMeleeTimeBar } from "../components/rps-melee/RPSMeleeTimeBar";
import { useEffect, useRef, useState } from "react";
import getSocket from "../socket";
import LoadingScreen from "../components/LoadingScreen";
import { IoMdClose } from "react-icons/io";
import { GoDash } from "react-icons/go";
import { Overlay } from "../components/Overlay";
import { RPSMeleeReadyOverlay } from "../components/rps-melee/RPSMeleeReadyOverlay";
import { RPSMeleeResults } from "../components/rps-melee/RPSMeleeResults";

const icons = {"rock": <div>✊</div>, "paper": <div>📃</div>, "scissors": <div>✂️</div>}

const socket = getSocket();

export const RPSMelee = ({roomCode}) => {
    const [dataInitialized, setDataInitialized] = useState(false);
    //const [gameData, setGameData] = useState({});
    const [myData, setMyData] = useState([]);
    const [opponentData, setOpponentData] = useState([]);
    const [roundStartTime, setRoundStartTime] = useState(null);
    const [roundDuration, setroundDuration] = useState(null);
    const [timeBarPercent, setTimeBarPercent] = useState(100);
    const [gameInProgress, setGameInProgress] = useState(false);
    const [roundInProgress, setRoundInProgress] = useState(false);
    const [countDown, setCountDown] = useState(0);

    const [showAnimation, setShowAnimation] = useState(null);

    useEffect(() => {    
        socket.on('receive_players_data', (playersData) => {
            const playersList = Object.values(playersData);

            if (playersList.length !== 2) { return; }

            const myData = playersData[socket.userId];
            const opponentData = playersData[myData.opponent.userId];

            setMyData(myData);
            setOpponentData(opponentData);
            setDataInitialized(true);
        });

        socket.on('receive_game_data', (gameData) => {
            setGameInProgress(gameData.gameInProgress);
            setRoundInProgress(gameData.roundInProgress);
            setroundDuration(gameData.roundDuration);
        });
        
        socket.on('round_started', (roundStartTime) => {
            setRoundStartTime(roundStartTime);
            setTimeBarPercent(100);
        });

        socket.on('round_ended', () => {
            setShowAnimation(true);
            setTimeout(() => {
                setShowAnimation(false);
            }, 500);

            setRoundStartTime(null);
            setTimeBarPercent(0);
        });

        socket.emit('join_room', roomCode);
        socket.emit('get_all_rps_melee_data', roomCode);

        return () => {
            socket.off('receive_players_data');
            socket.off('receive_game_data');
            socket.off('round_started');
            socket.off('round_ended');
        }
    }, []);

    useEffect(() => {
        socket.on('start_count_down', () => {
            setTimeBarPercent(100);
            setCountDown(3);

            const intervalId = setInterval(() => {
                setCountDown((previous) => {
                    if (previous <= 0) {
                        clearInterval(intervalId);
                    }
                    return previous - 1
                });
            }, 1000);

        });

        return () => {
            socket.off('start_count_down');
        }
    }, [])

    useEffect(() => {
        let intervalId;
        if (roundInProgress && roundStartTime && roundDuration) {
            intervalId = setInterval(() => {
                const timeDiff = Math.max((roundStartTime + roundDuration) - Date.now(), 0);
                const percent = timeDiff * 100 / roundDuration;
                setTimeBarPercent(percent);
            }, 20);

        }

        return () => {
            clearInterval(intervalId);
        };
    }, [roundInProgress, roundStartTime, roundDuration]);

    if (!dataInitialized) {
        return <LoadingScreen />;
    }


    const myChoice = icons[myData.choice];
    
    if (!gameInProgress && myData.choiceHistory.length > 0 ) {
        return <RPSMeleeResults myData={myData} opponentData={opponentData} isReady={myData.isReady} roomCode={roomCode}/>
    }

    let didWin = null;
    if (myData.choiceHistory.length > 0) {
        didWin = myData.choiceHistory.at(-1).didWin;
    }

    return (
        <div className="RPSMeleePage entirePage select-none z-[0] text-slate-400">
            { !gameInProgress && myData.choiceHistory.length === 0 &&
                <>
                    <RPSMeleeReadyOverlay roomCode={roomCode} isReady={myData.isReady} />
                </>

            }

            { countDown > 0 &&
                <Overlay isOpen={true}>
                    <div className="text-slate-200 text-[30vh]">
                        {countDown}
                    </div>
                </Overlay>
            }


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



            <div className="fightArea">
                { icons[opponentData.choice] ?? <div>❔</div> }
            </div>
            <div className="fightArea flex relative">
                { myChoice ?? <div>❔</div>}
                { showAnimation &&
                <div className="absolute left-[150%] text-[12vh] animate-fadeOut" style={{animation: "fadeOutFrame 500ms ease-out forwards"}}>
                    { didWin ?
                        <FaCheck className="text-green-500"/>
                    :
                        didWin === false ?
                            <IoMdClose className="text-red-500"/>
                        :
                            <GoDash/>

                    }
                </div>
            }
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