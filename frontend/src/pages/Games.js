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
                            <div className="myContainerCard w-[30%] h-[80vh] justify-around gap-4 z-[4] cursor-pointer text-[min(3vh,1em)]" 
                                onClick={() => {
                                    navigate(gameData.link);
                                }}
                            >
                                <h1 className="myContainerCardTitle">{gameData.title}</h1>
                                {gameData.logoLink &&      
                                    <div className="logoContainer mt-4">
                                        <img className="h-full rounded-[5%]" src={`${process.env.PUBLIC_URL}/images/${gameData.logoLink}`} alt="logo" />
                                    </div>    
                                }
                                <div className='myContainerCardInnerBox p-[10%]'>{gameData.description}</div>

                            </div>
                        );
                    })
                }

            </div>
        </div>
    );
}