import '../css/Games.css';
import { GamesData } from '../components/GamesData';
import { useNavigate } from 'react-router-dom';

export const Games = () => {
    const navigate = useNavigate();

    return (
        <div className="relative gamesPage flex flex-col gamesContainer z-[1]">
            <div className="cardFlexContainer flex flex-wrap py-6 gap-6 place-content-evenly z-[2]">
                <div className="absolute inset-[0] h-full w-full bg-black/50 bg-cover z-[3] pointer-events-none"></div>
                {
                    GamesData.map((gameData) => {
                        return (
                            <div className="myContainerCard w-[25%] h-[60vh] pt-[3%] gap-[8%] z-[4] cursor-pointer text-[min(3vh,1em)]" 
                                onClick={() => {
                                    navigate(gameData.link);
                                }}
                            >
                                <h1 className="myContainerCardTitle">{gameData.title}</h1>
                                <div className="flex gap-2 w-full justify-center">
                                    <div className="myContainerCardInnerBox px-[3%] py-[2%]">{gameData.playerLimitText}</div>
                                    <div className="myContainerCardInnerBox px-[3%] py-[2%]">{gameData.duration}</div>
                                </div>
                                {gameData.logoLink &&      
                                    <div className="logoContainer">
                                        <img className="h-full rounded-[5%]" src={`${process.env.PUBLIC_URL}/images/${gameData.logoLink}`} alt="logo" />
                                    </div>    
                                }

                                <div className='myContainerCardInnerBox px-[10%] py-[3%]'>
                                    <div>{gameData.description}</div>
                                </div>

                            </div>
                        );
                    })
                }

            </div>
        </div>
    );
}