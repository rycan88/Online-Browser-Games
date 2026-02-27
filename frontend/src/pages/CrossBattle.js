import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { CrossBattleGrid } from '../components/cross-battle/CrossBattleGrid';
import { CrossBattleTile } from '../components/cross-battle/CrossBattleTile';
import { DraggableItem } from '../components/hanabi/DraggableItem';
import '../css/CrossBattle.css';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useEffect, useState } from 'react';
import { CrossBattleHand } from '../components/cross-battle/CrossBattleHand';
import { countVowels, scoreGrid } from '../components/cross-battle/CrossBattleUtils';
import useScrabbleDictionary from '../hooks/useScrabbleDictionary';
import { Overlay } from '../components/Overlay';
import { CrossBattleResultsOverlay } from '../components/cross-battle/CrossBattleResultsOverlay';
import { useOrientation } from '../hooks/useOrientation';
import useFullscreen from '../hooks/useFullscreen';

// Scale properly for different sizes
// Allow swap tiles

// Work for multiplayer

export const CrossBattle = ({}) => {
    const orientation = useOrientation();
    const dictionary = useScrabbleDictionary();
    
    useEffect(() => {
        window.scrollTo(0, 1000);
    }, []);

    // Scrabble tile counts
    const allLetterTiles = {1: "JQXZV", 2: "BWYK", 3: "FMPHC", 4: "DUG", 6: "NRTSL", 8: "O", 9: "AI", 12: "E"};
    const letterCounts = {}
    let letterTileString = "";

    Object.entries(allLetterTiles).forEach((entry) => {
        for (const char of entry[1]) {
            letterTileString += char.repeat(Number(entry[0]));
            letterCounts[char] = entry[0];
        }
    });
    
    const randomCombo = (str, length) => {
        const tilePoolLength = str.length;
        while (true) {
            let newLetters = "";
            const counter = {}
            while (newLetters.length < length) {
                const num = Math.floor(Math.random() * tilePoolLength);
                const letter = str[num];
                if (counter[letter] >= letterCounts[letter]) {
                    continue;
                }

                counter[str[num]] += 1; 
                newLetters += str[num];
            }
            if (countVowels(newLetters) >= 5 && countVowels(newLetters) <= 11) {
                return newLetters
            }
        }
    }

    const [letters, setLetters] = useState(randomCombo(letterTileString, 22));

    const gridSize = 33;

    const [viewportSize, setViewportSize] = useState(orientation === "landscape" ? window.innerHeight * 0.85 : Math.min(window.innerHeight * 0.60, window.innerWidth * 0.95)); 
    
    const viewTiles = viewportSize > 700 ? 15 : (viewportSize > 400 ? 11 : 9);
    const tileSize = viewportSize / viewTiles;

    const centerTile = Math.floor(gridSize / 2);

    const initialX = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;
    const initialY = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;
    const [transform, setTransform] = useState({offsetX: initialX, offsetY: initialY, scale: 1, viewportSize: viewportSize, tileSize: tileSize});
    
    useEffect(() => {
        const handleResize = () => {
            const newViewportSize = orientation === "landscape" ? window.innerHeight * 0.85 : Math.min(window.innerHeight * 0.60, window.innerWidth * 0.95);
            setViewportSize(newViewportSize);
            
            setTransform((prev) => {
                return ({
                    ...prev,
                    tileSize: tileSize,
                    viewportSize: newViewportSize,
                    offsetX: ((prev.offsetX + prev.viewportSize / 2) / prev.tileSize) * tileSize - newViewportSize / 2, 
                    offsetY: ((prev.offsetY + prev.viewportSize / 2) / prev.tileSize) * tileSize - newViewportSize / 2,
                })
            })
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [orientation, tileSize])




    const [score, setScore] = useState(0); 
    const [validWords, setValidWords] = useState([]);
    const [invalidWords, setInvalidWords] = useState([]);
    const [unusedLetters, setUnusedLetters] = useState([]);
    const [tileCoords, setTileCoords] = useState([]);

    const [shouldShowResults, setShouldShowResults] = useState(false);

    const onClose = () => {
        setShouldShowResults(false);
    }

    const [tileToSpace, setTileToSpace] = useState(() => {
        const initial = {}
        for (let index = 0; index < letters.length; index++) {
            initial[index] = `handSpace-${String(index)}`;
        }
        return initial;
    });

    const moveTile = (endId, tileIndex) => {
        setTileToSpace(prev => {
            const next = { ...prev };
            next[tileIndex] = endId;
            return next;
        });
    }

    const swapTiles = (tileIndex1, tileIndex2) => {
        setTileToSpace(prev => {
            const next = { ...prev };
        
            next[tileIndex1] = prev[tileIndex2];
            next[tileIndex2] = prev[tileIndex1];

            return next;
        });
    }

    // Tile index to space Id
    const spaceToTile = (spaceId) => {
        return Object.entries(tileToSpace).find(([, value]) => value === spaceId)?.[0];
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeType, setActiveType] = useState(null);
    const [activeData, setActiveData] = useState({});
    const [draggingStyle, setDraggingStyle] = useState({});
    const [hoveredSpaceId, setHoveredSpaceId] = useState(null);

    const handleDragMove = (event) => {
        const { over, delta } = event;
    }

    const handleDragStart = (event) => {
        if (event.active.data.current.type) {
            setActiveData({letter: event.active.data.current.letter, tileIndex: event.active.data.current.tileIndex});
            setActiveType(event.active.data.current.type);
        } else {
            setActiveType(null);
        }
    }
    
    const handleDragOver = (event) => {
        const { over } = event;

        if (over) {
            setDraggingStyle({});
            setHoveredSpaceId(over.id);
        }
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!active || !over) {
            return;
        }

        if (spaceToTile(over.id) == null) {
            moveTile(over.id, active.data.current.tileIndex);
        } else {
            swapTiles(spaceToTile(over.id), active.data.current.tileIndex);
        }

        setDraggingStyle({});
        setActiveType(null);
        setActiveData({})
        setHoveredSpaceId(null);
    }

    return (
        <DndContext
            modifiers={[restrictToWindowEdges]}
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}

        >
            <div className="crossBattlePage entirePage">
                <CrossBattleResultsOverlay
                    validWords={validWords}
                    invalidWords={invalidWords} 
                    unusedLetters={unusedLetters}
                    score={score}
                    tileCoords={tileCoords}
                    onClose={onClose}
                    isOpen={shouldShowResults}
                />     

                <div className={`flex ${orientation !== "landscape" && "flex-col"} items-center justify-center h-full`}>
                    <div className={`flex justify-around items-center`}>
                        <button className="gradientButton"                 
                            onClick={() => {
                                const {validWords: newValidWords, invalidWords: newInvalidWords, score: newScore, unusedLetters, coords: tileCoords} = scoreGrid(tileToSpace, letters, dictionary);
                                setValidWords(newValidWords);
                                setInvalidWords(newInvalidWords);
                                setScore(newScore);
                                setUnusedLetters(unusedLetters);
                                setShouldShowResults(true);
                                setTileCoords(tileCoords);
                            }}>
                            Submit
                        </button>
                    </div>

                    <CrossBattleGrid 
                        tileSize={tileSize} 
                        gridSize={gridSize} 
                        viewportSize={viewportSize}
                        transform={transform}
                        setTransform={setTransform}
                        spaceToTile={spaceToTile}
                        letters={letters}
                        activeType={activeType}
                    >
                    </CrossBattleGrid>
                        
                    
                    <CrossBattleHand 
                        tileSize={tileSize}
                        spaceToTile={spaceToTile}
                        letters={letters}
                        orientation={orientation}
                    />
                </div>

                <DragOverlay>
                    {(draggingStyle) ? (
                        <div className='absolute -translate-x-[4.55%] -translate-y-[4.55%] z-[9999] pointer-events-none'>
                            {
                                <CrossBattleTile tileSize={tileSize * 1.1} tileLetter={activeData.letter} />
                            }
                        </div>
                    ) : null}
                </DragOverlay>
                <div className="entirePage bg-black/70 z-[-10]"></div>
            </div>

        </DndContext>

    )
}