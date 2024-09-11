import '../css/Games.css';
import { GamesData } from '../components/GamesData';
import { useNavigate } from 'react-router-dom';

export const Games = () => {
    const navigate = useNavigate();

    return (
        <div className="gamesPage entirePage">
            <div className="relative flex flex-col gamesContainer">
                <div className="flex flex-wrap p-6 gap-6 place-content-evenly">
                    {
                        GamesData.map((gameData) => {
                            return (
                                <div className="gamesCard" 
                                    onClick={() => {
                                        navigate(gameData.link);
                                    }}
                                >
                                    <h1 className="text-3xl">{gameData.title}</h1>
                                    {gameData.logoLink &&      
                                        <div className="h-[300px] w-[300px] shadow-xl rounded-3xl">
                                            <img className="h-full rounded-3xl" src={`${process.env.PUBLIC_URL}/images/${gameData.logoLink}`} alt="Odd Colour Out Logo" />
                                        </div>    
                                    }
                                    <p>{gameData.description}</p>

                                </div>
                            );
                        })
                    }
                </div>
                <div className="absolute inset-[0] h-full w-full bg-black/50 bg-cover z-[-10]"></div>
            </div>
        </div>
    );
}