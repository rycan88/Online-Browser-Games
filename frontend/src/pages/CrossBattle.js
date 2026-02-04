import { CrossBattleGrid } from '../components/cross-battle/CrossBattleGrid';
import { CrossBattleTile } from '../components/cross-battle/CrossBattleTile';
import '../css/CrossBattle.css';

export const CrossBattle = ({}) => {
    const letters = "EVERYONEISGOODEXCEPTME";
    const things = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    return (
        <div className="crossBattlePage entirePage">
            <div className='flex flex-col items-center justify-around h-full'>
                <CrossBattleGrid />
                <div className='flex flex-wrap justify-center h-[20vh] w-[50vh] bg-red-800'>
                    {[...letters].map((letter, index) => {
                        return <CrossBattleTile tileSize={50} 
                                         tileLetter={letter}
                        />
                    })}

                </div>

            </div>
            <div className="entirePage bg-black/70 z-[-10]"></div>
        </div>
    )
}