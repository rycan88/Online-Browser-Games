import { useDroppable } from "@dnd-kit/core"

export const DropZone = ({id, children}) => {
    const { active, isOver, setNodeRef } = useDroppable({ id })

    return (
        <div
            ref={setNodeRef}
            className="w-full h-full"
            style={{backgroundColor: isOver && "rgba(49, 170, 245, 0.4)"}}
        >
            {children}
        </div>
    );

}