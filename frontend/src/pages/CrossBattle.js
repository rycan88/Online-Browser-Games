import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { CrossBattleGrid } from '../components/cross-battle/CrossBattleGrid';
import { CrossBattleTile } from '../components/cross-battle/CrossBattleTile';
import '../css/CrossBattle.css';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useEffect, useState } from 'react';
import { CrossBattleHand } from '../components/cross-battle/CrossBattleHand';
import { CrossBattleResultsOverlay } from '../components/cross-battle/CrossBattleResultsOverlay';
import { useOrientation } from '../hooks/useOrientation';
import getSocket from '../socket';
import LoadingScreen from '../components/LoadingScreen';
import { FullscreenButton } from '../components/FullscreenButton';
import { InfoButton } from '../components/InfoButton';
import useFullscreen from '../hooks/useFullscreen';
import { CrossBattleSubmitButton } from '../components/cross-battle/CrossBattleSubmitButton';
import { useNavigate } from 'react-router-dom';

// Add next game button
// Recenter board each round


const socket = getSocket();

export const CrossBattle = ({roomCode}) => {
    const orientation = useOrientation();
    const isFullscreen = useFullscreen();
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(socket.userId);  

    useEffect(() => {
        window.scrollTo(0, 1000);
    }, []);

    const [letters, setLetters] = useState("");

    const gridSize = 33;

    const [viewportSize, setViewportSize] = useState(orientation === "landscape" ? window.innerHeight * 0.80 : Math.min(window.innerHeight * 0.60, window.innerWidth * 0.95)); 
    
    const viewTiles = viewportSize > 700 ? 15 : (viewportSize > 400 ? 11 : 9);
    const tileSize = viewportSize / viewTiles;

    const getCenterTransform = () => {
        const viewportSize = (orientation === "landscape" ? window.innerHeight * 0.80 : Math.min(window.innerHeight * 0.60, window.innerWidth * 0.95)); 

        const viewTiles = viewportSize > 700 ? 15 : (viewportSize > 400 ? 11 : 9);
        const tileSize = viewportSize / viewTiles;

        const centerTile = Math.floor(gridSize / 2);

        const initialX = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;
        const initialY = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;
        
        return {offsetX: initialX, offsetY: initialY, scale: 1, viewportSize: viewportSize, tileSize: tileSize};
    }
    const [transform, setTransform] = useState(getCenterTransform());
    
    useEffect(() => {
        const handleResize = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            const newViewportSize = isLandscape ? window.innerHeight * 0.80 : Math.min(window.innerHeight * 0.60, window.innerWidth * 0.95);
            
            const viewTiles = newViewportSize > 700 ? 15 : (newViewportSize > 400 ? 11 : 9);
            const tileSize = newViewportSize / viewTiles;
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
    }, [])


    const [dataInitialized, setDataInitialized] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [playersData, setPlayersData] = useState([]);

    const [shouldShowResults, setShouldShowResults] = useState(false);

    const handleVisibilityChange = () => {
        if (!document.hidden) {
            socket.emit("get_all_cross_battle_data", roomCode);
        }
    }

    useEffect(() => {
        socket.on('receive_player_data', (playerData, letters) => {
            setTileToSpace(playerData.tileToSpace);
            setHasSubmitted(playerData.hasSubmitted);
            setLetters(letters);
            setDataInitialized(true);
        });

        socket.on('receive_players_data', (playersData) => {
            setPlayersData(playersData)
        });

        socket.on('receive_should_show_results', (shouldShowResults) => {
            setShouldShowResults(shouldShowResults);
        });

        socket.on('start_new_round', () => {
            setTransform(getCenterTransform());
            setCurrentUser(socket.userId);
            socket.emit('get_all_cross_battle_data', roomCode);
        });

        socket.on('room_error', (errorMessage) => {
            navigate(`/cross_battle/lobby`, { state: {error: errorMessage}});
        });

        window.addEventListener("visibilitychange", handleVisibilityChange);

        socket.emit("get_all_cross_battle_data", roomCode);

        return () => {
            socket.off('receive_player_data');
            socket.off('receive_players_data');
            socket.off('receive_should_show_results');
            socket.off('start_new_round');
            socket.off('room_error');
            window.removeEventListener("visibilitychange", handleVisibilityChange);
        }
    }, []);

    const onClose = () => {
        setShouldShowResults(false);
    }

    const [tileToSpace, setTileToSpace] = useState({});

    const moveTile = (endId, tileIndex) => {
        setTileToSpace(prev => {
            const next = { ...prev };
            next[tileIndex] = endId;

            socket.emit("cross_battle_send_tile_to_space_data", roomCode, next);
            return next;
        });
    }

    const swapTiles = (tileIndex1, tileIndex2) => {
        setTileToSpace(prev => {
            const next = { ...prev };
        
            next[tileIndex1] = prev[tileIndex2];
            next[tileIndex2] = prev[tileIndex1];
            
            socket.emit("cross_battle_send_tile_to_space_data", roomCode, next);
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

    if (!dataInitialized) {
        return <LoadingScreen />;
    }

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
            <div className={`crossBattlePage entirePage select-none ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}>
                <CrossBattleResultsOverlay
                    roomCode={roomCode}
                    playersData={playersData}
                    onClose={onClose}
                    isOpen={shouldShowResults}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                />     
                <div className="topTaskBar">
                    <CrossBattleSubmitButton 
                        roomCode={roomCode}
                        hasSubmitted={hasSubmitted} 
                        setHasSubmitted={setHasSubmitted}
                    />
                    <InfoButton buttonType="info" fullScreen={isFullscreen} />
                    <InfoButton buttonType="settings" fullScreen={isFullscreen} />
                    <FullscreenButton shouldRotate={false}/>
                </div>
                <div className={`flex ${orientation !== "landscape" && "flex-col"} items-center justify-center h-full`}>
                    <div style={{height: orientation === "landscape" ? tileSize * 11.5 : tileSize * 4, width: orientation === "landscape" ? tileSize * 3 : tileSize * 8.5}} />
                    
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
                <div className={`entirePage bg-black/70 z-[-10] ${isFullscreen ? "h-[100vh]" : "md:h-[calc(100vh-60px)]"}`}></div>
            </div>

        </DndContext>

    )
}