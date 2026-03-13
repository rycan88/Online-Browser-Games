import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { CrossBattleGrid } from '../components/cross-battle/CrossBattleGrid';
import { CrossBattleTile } from '../components/cross-battle/CrossBattleTile';
import '../css/CrossBattle.css';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useEffect, useRef, useState } from 'react';
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
import { CrossBattlePlayerList } from '../components/cross-battle/CrossBattlePlayerList';
import { CrossBattleSettings, getCrossBattleCanTileSwap } from '../components/cross-battle/CrossBattleSettings';
import { RiInfinityFill, RiTimerLine } from 'react-icons/ri';
import { refreshPage } from '../utils';
import { CrossBattleRules } from '../components/cross-battle/CrossBattleRules';

// Bug fix: Dont let timeLimit change immediately after changing it


const socket = getSocket();

export const CrossBattle = ({roomCode}) => {
    const orientation = useOrientation();
    const isFullscreen = useFullscreen();
    const navigate = useNavigate();

    const [rerender, setRerender] = useState(false);
    const triggerRerender = () => {
        setRerender(!rerender);
    }

    const canTileSwap = getCrossBattleCanTileSwap();

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

    const resync = () => {
        if (!socket.connected) {
            refreshPage();
            console.log("Refreshed");
        }
        socket.emit("get_all_cross_battle_data", roomCode);
    }

    const [timeRemaining, setTimeRemaining] = useState(0);
    const timeControls = {"10s": 10, "15s": 15, "30s": 30, "45s": 45, "60s": 60, "90s": 90, "120s": 120, "180s": 180};
    const timerId = useRef(null);
    const [timeLimit, setTimeLimit] = useState("unlimited");

    useEffect(() => {
        socket.on('receive_player_data', (playerData) => {
            setTileToSpace(playerData.tileToSpace);
            setHasSubmitted(playerData.hasSubmitted);
            setDataInitialized(true);
        });

        socket.on('receive_letters', (letters) => {
            setLetters(letters);
        });

        socket.on('receive_players_data', (playersData) => {
            setPlayersData(playersData)
            setHasSubmitted(playersData[socket.userId].hasSubmitted);
        });

        socket.on('receive_should_show_results', (shouldShowResults) => {
            if (shouldShowResults) {
                clearInterval(timerId.current);  
                timerId.current = null;  
            } 
            setShouldShowResults(shouldShowResults);
        });

        socket.on('start_new_round', () => {
            setTransform(getCenterTransform());
            setCurrentUser(socket.userId);
            socket.emit('get_all_cross_battle_data', roomCode);
            timerId.current = null;
        });

        socket.on('receive_all_data', () => {
            socket.emit('get_all_cross_battle_data', roomCode);
        });

        socket.on('receive_timer_data', (timerData) => {
            const {roundStartTime, roundEndTime, timeLimit, shouldShowResults} = timerData;

            setTimeLimit(timeLimit);

            if (!shouldShowResults && Object.keys(timeControls).includes(timeLimit)) {
                const remaining = Math.min(Math.max(0, Math.floor((roundEndTime - Date.now()) / 1000)), timeControls[timeLimit]);

                setTimeRemaining(remaining);

                if (!timerId.current && remaining > 0) {
                    timerId.current = setInterval(() => {
                        setTimeRemaining((previous) => {
                            if (previous <= 1) {
                                clearInterval(timerId.current);
                                timerId.current = null;
                                return 0;
                            } 
                            return previous - 1
                        });
                    }, 1000)
                }
            }
        })

        socket.on('room_error', (errorMessage) => {
            navigate(`/cross_battle/lobby`, { state: {error: errorMessage}});
        });

        socket.on('connect', resync);
        socket.on('reconnect', resync);


        let hiddenTime = null;

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                hiddenTime = Date.now();
            }

            if (document.visibilityState === "visible") {
                if (hiddenTime && Date.now() - hiddenTime > 2 * 60 * 1000) { // Away longer than 2 min
                    refreshPage();
                }
            }
        }

        window.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", resync);
        window.addEventListener("pageshow", resync);

        socket.emit('join_room', roomCode);
        resync();

        return () => {
            socket.off('receive_player_data');
            socket.off('receive_players_data');
            socket.off('receive_all_data');
            socket.off('receive_should_show_results');
            socket.off('start_new_round');
            socket.off('receive_letters');
            socket.off('receive_timer_data');
            socket.off('room_error');
            socket.off('connect');
            socket.off('reconnect');
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", resync);
            window.removeEventListener("pageshow", resync);
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
        if (tileIndex1 === tileIndex2) { return; }
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
        return Object.entries(tileToSpace).find(([, value]) => value === spaceId)?.[0] ?? null;
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
        } else if (canTileSwap) {
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
                    letters={letters}
                />     

                { !shouldShowResults &&
                    <div className="topTaskBar z-[11]">
                        <CrossBattleSubmitButton 
                            roomCode={roomCode}
                            hasSubmitted={hasSubmitted} 
                            setHasSubmitted={setHasSubmitted}
                        />
                        <CrossBattlePlayerList playersData={playersData} />
                        <InfoButton buttonType="info" fullScreen={isFullscreen}>
                            <CrossBattleRules />
                        </InfoButton>
                        <InfoButton buttonType="settings" fullScreen={isFullscreen}>
                            <CrossBattleSettings triggerRerender={triggerRerender} roomCode={roomCode} shouldShowResults={shouldShowResults} />
                        </InfoButton> 
                        <FullscreenButton shouldRotate={false}/>
                    </div>
                }

                <div className={`absolute flex justify-center items-center left-[20px] top-[1vh] gap-[6px] h-[6vh] text-[3vh] ${timeRemaining < 10 && timeLimit !== "unlimited" && "text-red-500"}`}>
                    <div><RiTimerLine /></div>
                    { timeLimit === "unlimited" ?
                        <RiInfinityFill />
                    :
                        <div>{timeRemaining}</div>
                    }
                    
                </div>
                
                <div className={`flex ${orientation !== "landscape" && "flex-col"} items-center justify-center h-full`}>
                    <div style={{height: orientation === "landscape" ? tileSize * 11.5 : tileSize * 1.5, width: orientation === "landscape" ? tileSize * 3 : tileSize * 8.5}} />
                    
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
                        tileToSpace={tileToSpace}
                        letters={letters}
                        orientation={orientation}
                        setTileToSpace={setTileToSpace}
                        roomCode={roomCode}
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