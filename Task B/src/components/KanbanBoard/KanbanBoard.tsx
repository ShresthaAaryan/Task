import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ColumnType as ColumnType, Task } from '../../types';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

const initialColumns: ColumnType[] = [
  {
    id: 'todo', title: 'To Do', tasks: [],
    map: function (arg0: (col: { id: string; }) => { id: string; } | { title: string; id: string; }): unknown {
      throw new Error('Function not implemented.');
    }
  },
  {
    id: 'inProgress', title: 'In Progress', tasks: [],
    map: function (arg0: (col: { id: string; }) => { id: string; } | { title: string; id: string; }): unknown {
      throw new Error('Function not implemented.');
    }
  },
  {
    id: 'done', title: 'Done', tasks: [],
    map: function (arg0: (col: { id: string; }) => { id: string; } | { title: string; id: string; }): unknown {
      throw new Error('Function not implemented.');
    }
  },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    try {
      const savedColumns = localStorage.getItem('kanbanColumns');
      return savedColumns ? JSON.parse(savedColumns) : initialColumns;
    } catch (error) {
      console.error('Failed to load columns from localStorage:', error);
      return initialColumns;
    }
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const saveColumnsToLocalStorage = (updatedColumns: ColumnType[]) => {
    try {
      localStorage.setItem('kanbanColumns', JSON.stringify(updatedColumns));
    } catch (error) {
      console.error('Failed to save columns to localStorage:', error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeTaskId = active.id;
    const overColumnId = over.id;
  
    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeTaskId)
    );
    const overColumn = columns.find((col) => col.id === overColumnId);
  
    if (!activeColumn || !overColumn || activeColumn === overColumn) return;
  
    setColumns((prev) => {
      const activeTask = activeColumn.tasks.find(
        (task) => task.id === activeTaskId
      );
      if (!activeTask) return prev;
  
      return prev.map((col) => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task.id !== activeTaskId),
          };
        }
        if (col.id === overColumn.id) {
          return {
            ...col,
            tasks: [...col.tasks, activeTask],
          };
        }
        return col;
      });
    });
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveTask(null);
      return;
    }
  
    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === active.id)
    );
    const overColumn = columns.find((col) => col.id === over.id);
  
    if (!activeColumn || !overColumn) return;
  
    if (activeColumn.id === overColumn.id) {
      // Reorder tasks within the same column
      const activeIndex = activeColumn.tasks.findIndex(
        (task) => task.id === active.id
      );
      const overIndex = overColumn.tasks.findIndex(
        (task) => task.id === over.id
      );
  
      const updatedTasks = arrayMove(
        activeColumn.tasks,
        activeIndex,
        overIndex
      );
  
      const updatedColumns = columns.map((col) =>
        col.id === activeColumn.id ? { ...col, tasks: updatedTasks } : col
      );
  
      setColumns(updatedColumns);
      saveColumnsToLocalStorage(updatedColumns);
    }
  
    setActiveTask(null);
  };

  const handleAddColumn = () => {
    const newColumn: ColumnType = {
      id: `column-${Date.now()}`,
      title: 'New Column',
      tasks: [],
      map: function (arg0: (col: { id: string; }) => { id: string; } | { title: string; id: string; }): unknown {
        throw new Error('Function not implemented.');
      }
    };
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    saveColumnsToLocalStorage(updatedColumns);
  };

  const handleDeleteColumn = (columnId: string) => {
    const updatedColumns = columns.filter((col) => col.id !== columnId);
    setColumns(updatedColumns);
    saveColumnsToLocalStorage(updatedColumns);
  };

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      description: 'Add description here',
      priority: 'medium',
    };

    const updatedColumns = columns.map((col) =>
      col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
    );
    setColumns(updatedColumns);
    saveColumnsToLocalStorage(updatedColumns);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedColumns = columns.map((col) => ({
      ...col,
      tasks: col.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
    setColumns(updatedColumns);
    saveColumnsToLocalStorage(updatedColumns);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Kanban Board</h2>
        <button
          onClick={handleAddColumn}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Column
        </button>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onDeleteColumn={handleDeleteColumn}
              onUpdateTask={handleUpdateTask}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} onUpdateTask={handleUpdateTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}