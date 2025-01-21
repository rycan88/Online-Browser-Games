import { useState } from "react";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, pointerWithin, rectIntersection, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

const DropZone = ({ id, color, children }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? "yellow" : color,
        height: "200px",
        width: "100%",
        textAlign: "center",
        color: "white",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};

const SortableItem = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging} =
    useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, padding: "10px", margin: "5px", border: "1px solid", opacity: isDragging ? "0" : "1"}}
      {...attributes}
      {...listeners}
      id={id}
    >
      {id}
    </div>
  );
};

const Coins = ({id}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging} =
  useDraggable({ id });

const style = {
  transform: transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined,
  transition,
};

return (
  <div
    className="rounded-full w-[20px] h-[20px]"
    ref={setNodeRef}
    style={{ ...style, padding: "10px", margin: "5px", border: "1px solid", opacity: isDragging ? "0" : "1"}}
    {...attributes}
    {...listeners}
    id={id}
  >

  </div>
);
}

function renderActiveElement(activeId) {
  const activeElement = document.getElementById(activeId);

  if (!activeElement) return null;

  // Example: Return a JSX element based on the active DOM element
  return (
    <div
      style={{
        ...activeElement.style,
      }}
      className={activeElement.className}
    >
      {activeElement.textContent}
    </div>
  );
}

export const TailwindTest = () => {
  const [items, setItems] = useState(["Card 1", "Card 2", "Card 3"]);
  const [activeId, setActiveId] = useState(null);
  const [text, setText] = useState("");
  const [draggingStyle, setDraggingStyle] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  function customCollisionDetectionAlgorithm(args) {
    // First, let's see if there are any collisions with the pointer
    const pointerCollisions = pointerWithin(args);
    
    // Collision detection algorithms return an array of collisions
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    
    // If there are no collisions with the pointer, return rectangle intersections
    return closestCenter(args);
  };


  const handleDragMove = (event) => {
    const { delta } = event;

    if (activeId) {
      // Update the position of the dragged item based on cursor movement
      setDraggingStyle({
        transform: `translate(${delta.x}px, ${delta.y}px)`,
      });
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { over } = event;

    if (over) {
      console.log(`Dragging over: ${over.id}`);
    }
  };

  const handleDragEnd = (event) => {
    const { over } = event;
    
    // Handle sorting within green area
    if (over && items.includes(over?.id)) {
      setText("green");
      setItems((prev) => {
        const oldIndex = prev.indexOf(activeId);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }

    // Handle drop on red and blue areas
    if (over?.id === "red") {
      setText("red");
      console.log("Dropped in red area");
    }
    if (over?.id === "blue") {
      setText("blue");
      console.log("Dropped in blue area");
    }
    console.log(over)
    setDraggingStyle({});
    setActiveId(null);
  };
  
  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      sensors={sensors}
      collisionDetection={customCollisionDetectionAlgorithm}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      {/* Blue Area */}
      <DropZone id="blue" color="blue" />

      {/* Red Area */}
      <DropZone id="red" color="red">Drop Here</DropZone>

      {/* Green Area with Sortable Items */}
      
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          <div className="zone bg-green-300 h-[200px] flex justify-center items-center space-x-4">
            {items.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </div>
        </SortableContext>
      <div>{text}</div>
      <div id="pink" className="bg-pink-300 w-full h-[200px]">
            <Coins id="Coin 1" />
      </div>

      <DragOverlay>
          {activeId ? (
            <div
              style={{
                position: 'absolute',
                left: draggingStyle.transform ? `${draggingStyle.transform.split(' ')[0]}` : '0px',
                top: draggingStyle.transform ? `${draggingStyle.transform.split(' ')[1]}` : '0px',
                padding: '10px',
                backgroundColor: 'lightblue',
                border: '1px solid #ccc',
                pointerEvents: 'none', // Prevent interaction with the overlay
                zIndex: 9999, // Ensure the overlay is on top
              }}
            >
              {`Item ${activeId}`}
            </div>
          ) : null}
      </DragOverlay>

    </DndContext>
  );
  
    /*
    const [cards, setCards] = useState(initialCards);

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );
  
    const collisionDetection = (args) => {
      // Use default rectIntersection detection
      const collisions = rectIntersection(args);
  
      // Check if any collisions occurred within the green area
      return collisions.filter((collision) => {
        const element = document.getElementById(collision.id);
        return element?.closest("#cardArea");
      });
    };

    const handleDragEnd = ({ active, over }) => {
      if (active.id !== over.id) {
        setCards((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };
  
    return (
      <div className="w-[100vw] h-[100vh] flex flex-col">
        <div className="h-[30vh] w-full bg-blue-400">
            Hello
        </div>
        <div className="h-[30vh] w-full bg-red-300">
          FEllow
        </div>
        <div id="cardArea" className="flex h-[30vh] items-center justify-center bg-green-300">
          <DndContext 
            modifiers={[restrictToWindowEdges]}
            sensors={sensors}
            collisionDetection={(args) => {
              return rectIntersection(args);
            }}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={cards} strategy={horizontalListSortingStrategy}>
              <div className="flex justify-center gap-[10px] ">
                {cards.map((card) => (
                  <SortableItem key={card.id} id={card.id}>
                    {card.content}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

      </div>

    );
    */
  };
  

