import { Columns, Item } from "../types/column";

export function createColumns({
  columnCount,
  itemsPerColumn,
}: {
  columnCount: number;
  itemsPerColumn: number;
}): Columns {
  const columns: Columns = {};

  for (let i = 1; i <= columnCount; i++) {
    const columnName = `column${i}`;
    const columnItems: Item[] = [];

    for (let j = 1; j <= itemsPerColumn; j++) {
      const itemId = `item${(i - 1) * itemsPerColumn + j}`;
      const itemContent = `Item ${itemId.slice(4)}`;
      columnItems.push({ id: itemId, content: itemContent });
    }

    columns[columnName] = {
      name: `Column ${i}`,
      items: columnItems,
    };
  }

  return columns;
}
