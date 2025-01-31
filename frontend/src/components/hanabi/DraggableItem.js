import { useDraggable } from "@dnd-kit/core"

export const DraggableItem = ({ id, children, type}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useDraggable({ id, data: { type } })

    return (
        <div ref={setNodeRef} 
            style={{transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
                     transition,
                     opacity: isDragging ? "0" : "1",
                     touchAction: "none",
                    }}
             {...attributes}
             {...listeners}
             id={id}
        >
            {children}
        </div>
    )
}