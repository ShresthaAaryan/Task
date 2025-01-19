import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanBoard } from '../components/KanbanBoard/KanbanBoard';

describe('KanbanBoard', () => {
  it('renders initial columns', () => {
    render(<KanbanBoard />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('adds a new column', () => {
    render(<KanbanBoard />);
    fireEvent.click(screen.getByText('Add Column'));
    expect(screen.getByText('New Column')).toBeInTheDocument();
  });

  it('adds a new task to a column', () => {
    render(<KanbanBoard />);
    const addTaskButtons = screen.getAllByLabelText('Add task');
    fireEvent.click(addTaskButtons[0]);
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });
});