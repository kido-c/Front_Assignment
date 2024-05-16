import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DragUpdate,
  DragStart,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { createColumns } from "./utils/createColumns";
import { getNumberId } from "./utils/getNumberId";
import { orderItem } from "./utils/orderItem";

export default function App() {
  const [columns, setColumns] = useState(
    createColumns({ columnCount: 4, itemsPerColumn: 10 })
  );
  const [activeColumn, setActiveColumn] = useState<string>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDropActive, setIsDropActive] = useState<boolean>(true);

  const clearSelectedItem = useCallback(() => {
    setSelectedItems([]);
    setActiveColumn(undefined);
  }, []);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || !isDropActive) {
        clearSelectedItem();
        return;
      }

      const {
        source: { droppableId: startId },
        destination: { droppableId: endId, index: endIdx },
      } = result;

      if (startId === endId) {
        const { column, remainingItems } = orderItem.orderItemInSameColumn(
          columns,
          startId,
          endIdx,
          selectedItems
        );

        setColumns({
          ...columns,
          [startId]: { ...column, items: remainingItems },
        });
      } else {
        const { sourceColumn, remainingItems, destColumn, destItems } =
          orderItem.orderItemInDiffColumn(
            columns,
            startId,
            endId,
            endIdx,
            selectedItems
          );

        setColumns({
          ...columns,
          [startId]: { ...sourceColumn, items: remainingItems },
          [endId]: { ...destColumn, items: destItems },
        });
      }
      clearSelectedItem();
    },
    [columns, selectedItems, isDropActive]
  );

  const onDragStart = useCallback(
    (start: DragStart) => {
      const id = start.draggableId;
      if (!selectedItems.includes(id)) {
        setSelectedItems([id]);
      }
    },
    [selectedItems]
  );

  const onDragUpdate = useCallback((update: DragUpdate) => {
    if (!update.destination) return;

    const {
      source: { droppableId: startColumn },
      destination: { droppableId: endColumn },
    } = update;

    if (startColumn === endColumn) return;

    const startColumnId = getNumberId(startColumn);
    const endColumnId = getNumberId(endColumn);

    const isDropActive = Math.abs(startColumnId - endColumnId) % 2 !== 0;

    setIsDropActive(isDropActive);
  }, []);

  const selectItems = useCallback(
    (columnId: string, itemId: string) => {
      if (activeColumn && activeColumn !== columnId) return;
      if (selectedItems.length === 0) setActiveColumn(columnId);

      const newSelectedItems = selectedItems.includes(itemId)
        ? selectedItems.filter((id) => id !== itemId)
        : [...selectedItems, itemId];

      if (newSelectedItems.length === 0) setActiveColumn(undefined);

      setSelectedItems(newSelectedItems);
    },
    [activeColumn, selectedItems]
  );

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragUpdate={onDragUpdate}
      onDragStart={onDragStart}
    >
      <DragDropContainer>
        {Object.entries(columns).map(([columnId, columnValue]) => (
          <Droppable droppableId={columnId} key={columnId}>
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
                        onClick={() => selectItems(columnId, item.id)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        $isDragging={snapshot.isDragging}
                        $isDropActive={isDropActive}
                        $isSelected={selectedItems.includes(item.id)}
                      >
                        {item.content}
                        {selectedItems.length > 1 &&
                          selectedItems.includes(item.id) && (
                            <CountItem>{selectedItems.length}</CountItem>
                          )}
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

const DragItem = styled.div<{
  $isDragging: boolean;
  $isDropActive: boolean;
  $isSelected: boolean;
}>`
  position: relative;
  padding: 16px;
  margin: 0 0 8px 0;
  background: ${(props) =>
    props.$isSelected ? (props.$isDropActive ? "lightgreen" : "red") : "gray"};
`;

const DragList = styled.div<{ $isDraggingOver: boolean }>`
  padding: 8px;
  width: 250px;
  background: ${(props) => (props.$isDraggingOver ? "lightblue" : "lightgrey")};
`;

const CountItem = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid black;
  border-radius: 20px;

  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: blue;
  color: white;
`;
