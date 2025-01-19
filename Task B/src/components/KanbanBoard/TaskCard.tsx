import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskPriority } from '../../types';
import { Edit, Save, X } from 'lucide-react';

interface Props {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
}

export function TaskCard({ task, onUpdateTask }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState<TaskPriority>(task.priority);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const handleSave = () => {
    onUpdateTask({
      ...task,
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedPriority(task.priority);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value as TaskPriority)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-800">{task.title}</h4>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-gray-200 rounded"
              aria-label="Edit task"
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
      )}
    </div>
  );
}