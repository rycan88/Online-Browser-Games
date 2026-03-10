import '../css/Games.css';
import { GamesData } from '../components/GamesData';
import { useNavigate } from 'react-router-dom';
import { useOrientation } from '../hooks/useOrientation';

export const Games = () => {
    const navigate = useNavigate();
    const orientation = useOrientation();
    const isLandscape = orientation === "landscape";

    return (
        <div className="relative gamesPage flex flex-col gamesContainer z-[1]">
            <div className="cardFlexContainer flex flex-wrap py-6 gap-6 place-content-evenly z-[2]">
                <div className="absolute inset-[0] h-full w-full bg-black/50 bg-cover z-[3] pointer-events-none"></div>
                {
                    GamesData.map((gameData) => {
                        return (
                            <div className={`myContainerCard gap-[8%] z-[4] cursor-pointer 
                                            ${isLandscape ? 
                                                "w-[calc(max(500px,25%))] h-[60vh] text-[min(3vh,1em)] pt-[6vh]" 
                                                :
                                                "w-[40vw] h-[55vw] text-[min(2vw,1em)] pt-[6vw] pb-[2vh]"
                                            }
                                            `} 
                                key={gameData.title}
                                onClick={() => {
                                    navigate(gameData.link);
                                }}
                            >
                                <h1 className={`myContainerCardTitle ${!isLandscape && "text-[2vw] py-[1vw] px-[4vw] h-[8vw] -top-[4vw] rounded-[2vw]"}`}>{gameData.title}</h1>
                                <div className="flex gap-[16px] w-full justify-center">
                                    <div className="myContainerCardInnerBox px-[3%] py-[2%]">{gameData.playerLimitText}</div>
                                    <div className="myContainerCardInnerBox px-[3%] py-[2%]">{gameData.duration}</div>
                                </div>
                                {gameData.logoLink &&      
                                    <div className={`shadow-xl rounded-[10%] ${!isLandscape ? "h-[20vw] w-[20vw]" : "h-[25vh] w-[25vh]"}`}>
                                        <img className="h-full rounded-[5%]" src={`${process.env.PUBLIC_URL}/images/${gameData.logoLink}`} alt="logo" />
                                    </div>    
                                }
                                <div className='flex-1 flex items-center justify-center'>
                                    <div className='myContainerCardInnerBox px-[10%] py-[3%]'>
                                        <div>{gameData.description}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }

            </div>
        </div>
    );
}