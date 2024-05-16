import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Column } from "../types/column";
import styled from "styled-components";

interface Props {
  columnId: string;
  columnValue: Column;
  isDropActive: boolean;
  selectedItems: string[];
  onClickItem: (columnId: string, itemId: string) => void;
}

export default function DragDropColumn({
  columnId,
  columnValue,
  isDropActive,
  selectedItems,
  onClickItem,
}: Props) {
  return (
    <Droppable droppableId={columnId} key={columnId}>
      {(provided, snapshot) => (
        <DragList
          {...provided.droppableProps}
          ref={provided.innerRef}
          $isDraggingOver={snapshot.isDraggingOver}
          $isDropActive={isDropActive}
        >
          <Title>{`[ ${columnId} section ]`}</Title>
          {columnValue.items.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <DragItem
                  onClick={() => onClickItem(columnId, item.id)}
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
  );
}

const DragList = styled.div<{
  $isDraggingOver: boolean;
  $isDropActive: boolean;
}>`
  width: 300px;
  padding: 16px;

  border-radius: 10px;
  background: ${(props) =>
    props.$isDraggingOver
      ? props.$isDropActive
        ? "lightblue"
        : "pink"
      : " lightgrey"};
`;

const Title = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;

  font-size: 24px;
  font-weight: 700;
  color: white;
`;

const DragItem = styled.div<{
  $isDragging: boolean;
  $isDropActive: boolean;
  $isSelected: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;
  margin: 0 0 8px 0;

  border-radius: 10px;
  border: ${(props) =>
    props.$isSelected
      ? props.$isDropActive
        ? "3px solid lightgreen"
        : "3px solid red"
      : " 1px solid white"};
  background: white;
`;

const CountItem = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 700;

  border-radius: 20px;
  background: #e1c3fd;
  color: white;
`;
