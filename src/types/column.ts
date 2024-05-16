export interface Item {
  id: string;
  content: string;
}

export interface Column {
  name: string;
  items: Item[];
}

export interface Columns {
  [key: string]: Column;
}
