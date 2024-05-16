import { Columns } from "../types/column";

export const orderItem = {
  orderItemInSameColumn: (
    columns: Columns,
    startId: string,
    endIdx: number,
    selectedItems: string[]
  ) => {
    const column = columns[startId];
    const copiedItems = [...column.items];
    const movingItems = copiedItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    const remainingItems = copiedItems.filter(
      (item) => !selectedItems.includes(item.id)
    );

    movingItems.forEach((item, index) => {
      remainingItems.splice(endIdx + index, 0, item);
    });

    return { column, remainingItems };
  },
  orderItemInDiffColumn: (
    columns: Columns,
    startId: string,
    endId: string,
    endIdx: number,
    selectedItems: string[]
  ) => {
    const sourceColumn = columns[startId];
    const destColumn = columns[endId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    const movingItems = sourceItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    const remainingItems = sourceItems.filter(
      (item) => !selectedItems.includes(item.id)
    );

    movingItems.forEach((item, index) => {
      destItems.splice(endIdx + index, 0, item);
    });

    return { sourceColumn, remainingItems, destColumn, destItems };
  },
};
