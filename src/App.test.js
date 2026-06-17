import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  document.body.className = '';
});

afterEach(() => {
  document.body.className = '';
});

// ─── Theme ────────────────────────────────────────────────────────────────────

describe('theme', () => {
  test('starts in dark mode by default', () => {
    render(<App />);
    expect(document.body.className).toBe('dark');
  });

  test('reads saved theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'light');
    render(<App />);
    expect(document.body.className).toBe('light');
  });

  test('toggles from dark to light', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /switch to light mode/i }));
    expect(document.body.className).toBe('light');
  });

  test('toggles from light back to dark', () => {
    localStorage.setItem('theme', 'light');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /switch to dark mode/i }));
    expect(document.body.className).toBe('dark');
  });

  test('persists theme change to localStorage', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /switch to light mode/i }));
    expect(localStorage.getItem('theme')).toBe('light');
  });
});

// ─── Active tasks count ───────────────────────────────────────────────────────

describe('active tasks count', () => {
  test('counts only incomplete todos', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([
        { id: '1', text: 'Todo 1', completed: false },
        { id: '2', text: 'Todo 2', completed: true },
        { id: '3', text: 'Todo 3', completed: false },
      ])
    );
    render(<App />);
    expect(screen.getByText('Active Tasks: 2')).toBeInTheDocument();
  });

  test('shows 0 when all todos are completed', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([{ id: '1', text: 'Done', completed: true }])
    );
    render(<App />);
    expect(screen.getByText('Active Tasks: 0')).toBeInTheDocument();
  });

  test('shows 0 when there are no todos', () => {
    render(<App />);
    expect(screen.getByText('Active Tasks: 0')).toBeInTheDocument();
  });
});

// ─── Filter ───────────────────────────────────────────────────────────────────

describe('filter', () => {
  beforeEach(() => {
    localStorage.setItem(
      'todos',
      JSON.stringify([
        { id: '1', text: 'Incomplete todo', completed: false },
        { id: '2', text: 'Completed todo', completed: true },
      ])
    );
  });

  test('shows all todos by default', () => {
    render(<App />);
    expect(screen.getByText('Incomplete todo')).toBeInTheDocument();
    expect(screen.getByText('Completed todo')).toBeInTheDocument();
  });

  test('shows only completed todos when filter is "completed"', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'completed' } });
    expect(screen.queryByText('Incomplete todo')).not.toBeInTheDocument();
    expect(screen.getByText('Completed todo')).toBeInTheDocument();
  });

  test('shows only incomplete todos when filter is "uncompleted"', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'uncompleted' } });
    expect(screen.getByText('Incomplete todo')).toBeInTheDocument();
    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
  });

  test('shows all todos again when switching back to "all"', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'completed' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'all' } });
    expect(screen.getByText('Incomplete todo')).toBeInTheDocument();
    expect(screen.getByText('Completed todo')).toBeInTheDocument();
  });
});

// ─── Clear all ────────────────────────────────────────────────────────────────

describe('clear all', () => {
  test('removes all todos from the list', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([{ id: '1', text: 'Todo to clear', completed: false }])
    );
    render(<App />);
    expect(screen.getByText('Todo to clear')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear All'));
    expect(screen.queryByText('Todo to clear')).not.toBeInTheDocument();
  });

  test('removes todos from localStorage', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([{ id: '1', text: 'Todo to clear', completed: false }])
    );
    render(<App />);
    fireEvent.click(screen.getByText('Clear All'));
    expect(localStorage.getItem('todos')).toBeNull();
  });

  test('resets active tasks count to 0', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([{ id: '1', text: 'Todo 1', completed: false }])
    );
    render(<App />);
    fireEvent.click(screen.getByText('Clear All'));
    expect(screen.getByText('Active Tasks: 0')).toBeInTheDocument();
  });
});

// ─── Load from localStorage ───────────────────────────────────────────────────

describe('persistence', () => {
  test('loads todos from localStorage on mount', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([{ id: '1', text: 'Persisted todo', completed: false }])
    );
    render(<App />);
    expect(screen.getByText('Persisted todo')).toBeInTheDocument();
  });

  test('renders nothing when localStorage has no todos', () => {
    render(<App />);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});