import { useState, useCallback } from "react";
import {
  DragDropContext,
  DropResult,
  DragUpdate,
  DragStart,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { createColumns } from "./utils/createColumns";
import { getNumberId } from "./utils/getNumberId";
import { orderItem } from "./utils/orderItem";
import { Columns } from "./types/column";
import DragDropColumn from "./components/DragDropColumn";

export default function App() {
  const [columns, setColumns] = useState<Columns>(
    createColumns({ columnCount: 4, itemsPerColumn: 10 })
  );
  const [activeColumn, setActiveColumn] = useState<string>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDropActive, setIsDropActive] = useState<boolean>(true);

  const clearSelectedItem = useCallback(() => {
    setSelectedItems([]);
    setActiveColumn(undefined);
    setIsDropActive(true);
  }, []);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || !isDropActive) {
        clearSelectedItem();
        alert("해당 섹션에는 드래그가 제한됩니다.");
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

  const selectItem = useCallback(
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
          <DragDropColumn
            columnId={columnId}
            columnValue={columnValue}
            isDropActive={isDropActive}
            selectedItems={selectedItems}
            onClickItem={selectItem}
          />
        ))}
      </DragDropContainer>
    </DragDropContext>
  );
}

const DragDropContainer = styled.div`
  display: flex;
  gap: 20px;
`;
