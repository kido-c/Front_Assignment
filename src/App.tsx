import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { createColumns } from "./utils/createColumns";

export default function App() {
  const [columns, setColumns] = useState(
    createColumns({ columnCount: 4, itemsPerColumn: 10 })
  );

  const reorder = (
    list: Iterable<unknown> | ArrayLike<unknown>,
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      // const newItems = reorder(
      //   items,
      //   result.source.index,
      //   result.destination.index
      // );

      // setItems(newItems);
    },
    [columns]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <DragDropContainer>
        {Object.entries(columns).map(([columnId, columnValue]) => (
          <Droppable droppableId={columnId}>
            {(provided, snapshot) => (
              <DragList
                {...provided.droppableProps}
                ref={provided.innerRef}
                $isDraggingOver={snapshot.isDraggingOver}
              >
                {columnValue.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <DragItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        $isDragging={snapshot.isDragging}
                      >
                        {item.content}
                      </DragItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </DragList>
            )}
          </Droppable>
        ))}
      </DragDropContainer>
    </DragDropContext>
  );
}

const DragDropContainer = styled.div`
  display: flex;
`;

const DragItem = styled.div<{ $isDragging: boolean }>`
  padding: 16px;
  margin: 0 0 8px 0;
  background: ${(props) => (props.$isDragging ? "lightgreen" : "grey")};
`;

const DragList = styled.div<{ $isDraggingOver: boolean }>`
  padding: 8px;
  width: 250px;
  background: ${(props) => (props.$isDraggingOver ? "lightblue" : "lightgrey")};
`;

/* const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  userSelect: "none",
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
}); */

// const getListStyle = (isDraggingOver: boolean) => ({
//   background: isDraggingOver ? "lightblue" : "lightgrey",
//   padding: GRID,
//   width: 250,
// });
