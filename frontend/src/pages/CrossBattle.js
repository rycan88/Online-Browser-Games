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

// Scale properly for different sizes
// Work for mobile

// Work for multiplayer


export const CrossBattle = ({}) => {
    const orientation = useOrientation();
    const dictionary = useScrabbleDictionary();

    // Scrabble tile counts except +2 tiles added for each vowel
    const allLetterTiles = {1: "JKQXZ", 2: "BCFHMPVWY", 3: "G", 4: "DLSU", 6: "NRT", 8: "O", 9: "AI", 12: "E"};
    let letterTileString = "";

    Object.entries(allLetterTiles).forEach((entry) => {
        for (const char of entry[1]) {
            letterTileString += char.repeat(Number(entry[0]));
        }
    });
    
    const randomCombo = (str, length) => {
        const shuffled = [...str].sort(() => Math.random() - 0.5);
        let newLetters = shuffled.slice(0, length).join("");

        while (countVowels(newLetters) < 5 || countVowels(newLetters) > 11) {
            newLetters = randomCombo(letterTileString, 22);
        }
        return newLetters;
    }

    const [letters, setLetters] = useState(randomCombo(letterTileString, 22));

    const gridSize = 33;
    const viewTiles = orientation === "landscape" ? 15 : 11;
    const viewportSize = orientation === "landscape" ? window.innerHeight * 0.85 : Math.min(window.innerHeight * 0.60, window.innerWidth * 0.95); 
    const tileSize = viewportSize / viewTiles;

    const centerTile = Math.floor(gridSize / 2);

    const initialX = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;
    const initialY = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;

    const [transform, setTransform] = useState({offsetX: initialX, offsetY: initialY, scale: 1});

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
                        viewTiles={viewTiles}
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
                        <div
                            style={{
                                position: 'absolute',
                                left: draggingStyle.transform ? `${draggingStyle.transform.split(' ')[0]}` : '0px',
                                top: draggingStyle.transform ? `${draggingStyle.transform.split(' ')[1]}` : '0px',
                                pointerEvents: 'none', // Prevent interaction with the overlay
                                zIndex: 9999, // Ensure the overlay is on top
                                opacity: 1
                            }}
                        >
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