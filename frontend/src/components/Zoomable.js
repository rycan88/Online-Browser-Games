
import { useRef, useState } from "react";

export const Zoomable = ({viewportSize, transform, setTransform, gridSizePx, children, zoomBounds={min: 0.5, max: 3}}) => {
    const divRef = useRef(null)

    const dragging = useRef(false);
    const last = useRef({ x: 0, y: 0 });

    const clamp = (value, min, max) =>
        Math.min(max, Math.max(min, value));

    const pointers = useRef(new Map());
    const lastDistance = useRef(null);
    const lastPointers = useRef(new Map());

    const getDistance = () => {
        const values = [...pointers.current.values()];
        if (values.length < 2) return null;

        const dx = values[0].x - values[1].x;
        const dy = values[0].y - values[1].y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const getCenter = () => {
        const values = [...pointers.current.values()];
        if (values.length < 2) return null;

        const x = values[0].x - (values[0].x - values[1].x) / 2;
        const y = values[0].y - (values[0].y - values[1].y) / 2;
        return {clientX: x, clientY: y};
    };

    const handlePointerDown = (e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        lastPointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };

    const handlePointerMove = (e) => {
        if (!pointers.current.has(e.pointerId)) return;

        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (pointers.current.size === 1) {
            const prev = lastPointers.current.get(e.pointerId);
            const dx = prev.x - e.clientX;
            const dy = prev.y - e.clientY;

            lastPointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

            setTransform((t) => {
                const maxX = gridSizePx * t.scale - viewportSize;
                const maxY = gridSizePx * t.scale - viewportSize;

                return {
                ...t,
                    offsetX: clamp(t.offsetX + dx, 0, maxX),
                    offsetY: clamp(t.offsetY + dy, 0, maxY),
                };
            });
        } else if (pointers.current.size === 2) {
            const distance = getDistance();
            const center = getCenter();

            if (lastDistance.current) {
                const diff = lastDistance.current - distance;
                setTransform((t) => {
                    return zoomTransform(t, diff, center)
                });
            }

            lastDistance.current = distance;
        }
    };

    const handlePointerUp = (e) => {
        pointers.current.delete(e.pointerId);
        lastDistance.current = null;
        lastPointers.current.delete(e.pointerId);
    };

    
    const zoomTransform = (prevTransform, deltaY, coord) => {
        const { offsetX, offsetY, scale: prevScale } = prevTransform;

        const sensitivity = 0.1;
        const delta = -Math.sign(deltaY);
        const zoomFactor = Math.exp(delta * sensitivity);
        const newScale = clamp(prevTransform.scale * zoomFactor, zoomBounds.min, zoomBounds.max);

        const rect = divRef.current.getBoundingClientRect()

        const scaleRatio = newScale / prevScale;

        const mouseOffset = {x: coord.clientX - rect.left, y: coord.clientY - rect.top}

        const newOffsetX = (offsetX + mouseOffset.x) * scaleRatio - mouseOffset.x;

        const newOffsetY = (offsetY + mouseOffset.y) * scaleRatio - mouseOffset.y;
        
        const maxX = gridSizePx * newScale - viewportSize;
        const maxY = gridSizePx * newScale - viewportSize;
        
        return {
            offsetX: clamp(newOffsetX, 0, maxX),
            offsetY: clamp(newOffsetY, 0, maxY),
            scale: newScale,
        };
    }

    const onWheel = (e) => {
        e.preventDefault();

        if (e.ctrlKey) {
            return;
        }
        
        setTransform((prevTransform) => {  
            return zoomTransform(prevTransform, e.deltaY, {clientX: e.clientX, clientY: e.clientY});
        });
    };

    const onMouseDown = (e) => {
        dragging.current = true;
        last.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
        if (!dragging.current) return;

        const dx = last.current.x - e.clientX;
        const dy = last.current.y - e.clientY;
        last.current = { x: e.clientX, y: e.clientY };

        setTransform((transform) => {
            const maxX = gridSizePx * transform.scale - viewportSize;
            const maxY = gridSizePx * transform.scale - viewportSize;

            return {
                offsetX: clamp(transform.offsetX + dx, 0, maxX),
                offsetY: clamp(transform.offsetY + dy, 0, maxY),
                scale: transform.scale,
            };
        });
    };

    const onMouseUp = () => {
        dragging.current = false;
    };

    return (
        <div
            className="overflow-hidden relative border border-slate-100 select-none touch-none"
            style={{ width: viewportSize, height: viewportSize }}
            ref={divRef}
            onWheel={onWheel}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onMouseEnter={onMouseUp}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
        >
            <div
                className="absolute top-0 left-0 origin-top-left cursor-grab active:cursor-grabbing"
                style={{
                    transform: `translate(${-transform.offsetX}px, ${-transform.offsetY}px) scale(${transform.scale})`,
                }}
            >
                {children}
            </div>
        </div>
    );
    }
