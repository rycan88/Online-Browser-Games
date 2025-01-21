import { useSortable } from "@dnd-kit/sortable"

export const SortableItem = ({ id, children, type}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({ id, data: { type } })

    return (
        <div ref={setNodeRef} 
            style={{transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
                     transition,
                     opacity: isDragging ? "0" : "1",
                    }}
             {...attributes}
             {...listeners}
             id={id}
        >
            {children}
        </div>
    )
}