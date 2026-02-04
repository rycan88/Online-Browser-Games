
// import { useRef, useState } from "react";
// import { CrossBattleTile } from "./CrossBattleTile";

// export const Zoomable = ({viewportSize}) => {
//     const tileSize = 48;
//     const gridSize = 43;
//     const viewTiles = 11;

//     const divRef = useRef(null)
//     const viewportSize = tileSize * viewTiles;
//     const gridSizePx = tileSize * gridSize;

//     const [transform, setTransform] = useState({ offsetX: -10000000, offsetY: -10000000, scale: 1});

//     const dragging = useRef(false);
//     const last = useRef({ x: 0, y: 0 });

//     // 🎯 Center on middle tile initially
//     const centerTile = Math.floor(gridSize / 2);
//     const initialX = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;
//     const initialY = (centerTile * tileSize + tileSize / 2) - viewportSize / 2;

//     // set initial once
//     if (transform.offsetX === -10000000 && transform.offsetY === -10000000) {
//         setTransform({ offsetX: initialX, offsetY: initialY, scale: 1});
//     }

//     const clamp = (value, min, max) =>
//         Math.min(max, Math.max(min, value));

//     const onWheel = (e) => {
//         e.preventDefault();

//         setTransform((prevTransform) => {
//             const { offsetX, offsetY, scale: prevScale } = prevTransform;

//             const sensitivity = 0.1;
//             const delta = -Math.sign(e.deltaY);
//             const zoomFactor = Math.exp(delta * sensitivity);
//             const newScale = transform.scale * zoomFactor;

//             const rect = divRef.current.getBoundingClientRect()

//             const scaleRatio = newScale / prevScale;

//             const mouseOffset = {x: e.clientX - rect.left, y: e.clientY - rect.top}

//             const newOffsetX = (offsetX + mouseOffset.x) * scaleRatio - mouseOffset.x;

//             const newOffsetY = (offsetY + mouseOffset.y) * scaleRatio - mouseOffset.y;
            
//             const maxX = gridSizePx * newScale - viewportSize;
//             const maxY = gridSizePx * newScale - viewportSize;
            
//             return {
//                 offsetX: clamp(newOffsetX, 0, maxX),
//                 offsetY: clamp(newOffsetY, 0, maxY),
//                 scale:   clamp(newScale, 0.5, 3)
//             };
//         });
//     };

//     const onMouseDown = (e) => {
//         dragging.current = true;
//         last.current = { x: e.clientX, y: e.clientY };
//     };

//     const onMouseMove = (e) => {
//         if (!dragging.current) return;

//         const dx = last.current.x - e.clientX;
//         const dy = last.current.y - e.clientY;
//         last.current = { x: e.clientX, y: e.clientY };

//         setTransform((transform) => {
//             const maxX = gridSizePx * transform.scale - viewportSize;
//             const maxY = gridSizePx * transform.scale - viewportSize;

//             return {
//                 x: clamp(transform.offsetX + dx, 0, maxX),
//                 y: clamp(transform.offsetY + dy, 0, maxY),
//             };
//         });
//     };

//     const onMouseUp = () => {
//         dragging.current = false;
//     };

//     return (
//         <div
//         className="overflow-hidden relative border border-slate-200 select-none"
//         style={{ width: viewportSize, height: viewportSize }}
//         ref={divRef}
//         onWheel={onWheel}
//         onMouseMove={onMouseMove}
//         onMouseDown={onMouseDown}
//         onMouseUp={onMouseUp}
//         onMouseLeave={onMouseUp}
//         >
//             {/* CAMERA */}
//             <div
//                 className="absolute top-0 left-0 origin-top-left cursor-grab active:cursor-grabbing"
//                 style={{
//                 transform: `translate(${-transform.offsetX}px, ${-transform.offsetY}px) scale(${transform.scale})`,
//                 }}
//             >
//                 <div className="grid"
//                      style={{
//                      gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
//                      width: gridSizePx,
//                      height: gridSizePx,
//                 }}
//                 >
//                 {Array.from({ length: gridSize * gridSize }).map((_, i) => (
//                     <CrossBattleTile key={i} tileSize={tileSize} tileLetter={String(i%10)}/>
//                 ))}
//                 </div>
//             </div>
//         </div>
//     );
//     }
