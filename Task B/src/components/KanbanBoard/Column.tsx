import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ColumnType as ColumnType, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  column: ColumnType;
  onAddTask: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onUpdateTask: (updatedTask: Task) => void;
}

export function Column({ column, onAddTask, onDeleteColumn, onUpdateTask }: Props) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    // Update the column title in the state
    const updatedColumns = column.map((col) =>
      col.id === column.id ? { ...col, title: newTitle } : col
    );
    setColumns(updatedColumns);
    saveColumnsToLocalStorage(updatedColumns);
  };

  return (
    <div className="w-80 bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            autoFocus
            className="font-semibold text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none"
          />
        ) : (
          <h3
            className="font-semibold text-gray-700 cursor-pointer"
            onDoubleClick={() => setIsEditing(true)}
          >
            {column.title}
          </h3>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onAddTask(column.id)}
            className="p-1 hover:bg-gray-200 rounded"
            aria-label="Add task"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="p-1 hover:bg-gray-200 rounded text-red-500"
            aria-label="Delete column"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div ref={setNodeRef} className="space-y-3 min-h-[100px]">
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateTask={onUpdateTask}
            />
          ))}
        </SortableContext>
        {/* Empty state for droppable area */}
        {column.tasks.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

function setColumns(updatedColumns: any) {
  throw new Error('Function not implemented.');
}


function saveColumnsToLocalStorage(updatedColumns: any) {
  throw new Error('Function not implemented.');
}
