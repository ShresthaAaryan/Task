export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
}

export interface ColumnType {
  map(arg0: (col: { id: string; }) => { id: string; } | { title: string; id: string; }): unknown;
  id: string;
  title: string;
  tasks: Task[];
}