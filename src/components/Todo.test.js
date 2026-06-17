import { render, screen, fireEvent } from '@testing-library/react';
import Todo from './Todo';

const mockSetTodos = jest.fn();

const makeTodo = (overrides = {}) => ({
  id: '1',
  text: 'Test todo',
  completed: false,
  ...overrides,
});

beforeEach(() => {
  localStorage.clear();
  mockSetTodos.mockClear();
});

// ─── Rendering ────────────────────────────────────────────────────────────────

test('displays the todo text', () => {
  const todo = makeTodo({ text: 'Buy milk' });
  render(<Todo text={todo.text} todo={todo} todos={[todo]} setTodos={mockSetTodos} />);
  expect(screen.getByText('Buy milk')).toBeInTheDocument();
});

test('adds "completed" class when todo is done', () => {
  const todo = makeTodo({ completed: true });
  const { container } = render(
    <Todo text={todo.text} todo={todo} todos={[todo]} setTodos={mockSetTodos} />
  );
  expect(container.querySelector('.complete-btn')).toHaveClass('completed');
  expect(container.querySelector('.todo-item')).toHaveClass('completed');
});

// ─── Delete ───────────────────────────────────────────────────────────────────

describe('deleteHandler', () => {
  test('calls setTodos with the deleted item removed', () => {
    const todo1 = makeTodo({ id: '1', text: 'First' });
    const todo2 = makeTodo({ id: '2', text: 'Second' });
    const { container } = render(
      <Todo text={todo1.text} todo={todo1} todos={[todo1, todo2]} setTodos={mockSetTodos} />
    );
    fireEvent.click(container.querySelector('.trash-btn'));
    expect(mockSetTodos).toHaveBeenCalledWith([todo2]);
  });

  test('saves the filtered list to localStorage immediately (not the stale list)', () => {
    const todo1 = makeTodo({ id: '1', text: 'First' });
    const todo2 = makeTodo({ id: '2', text: 'Second' });
    const { container } = render(
      <Todo text={todo1.text} todo={todo1} todos={[todo1, todo2]} setTodos={mockSetTodos} />
    );
    fireEvent.click(container.querySelector('.trash-btn'));
    expect(JSON.parse(localStorage.getItem('todos'))).toEqual([todo2]);
  });
});

// ─── Complete ─────────────────────────────────────────────────────────────────

describe('completeHandler', () => {
  test('toggles the completed state of the target todo', () => {
    const todo = makeTodo({ id: '1', completed: false });
    const { container } = render(
      <Todo text={todo.text} todo={todo} todos={[todo]} setTodos={mockSetTodos} />
    );
    fireEvent.click(container.querySelector('.complete-btn'));
    expect(mockSetTodos).toHaveBeenCalledWith([{ ...todo, completed: true }]);
  });

  test('does not wipe other todos (missing-return-item regression)', () => {
    const target = makeTodo({ id: '1', text: 'Target', completed: false });
    const other1 = makeTodo({ id: '2', text: 'Other 1', completed: false });
    const other2 = makeTodo({ id: '3', text: 'Other 2', completed: true });
    const { container } = render(
      <Todo
        text={target.text}
        todo={target}
        todos={[target, other1, other2]}
        setTodos={mockSetTodos}
      />
    );
    fireEvent.click(container.querySelector('.complete-btn'));
    const updated = mockSetTodos.mock.calls[0][0];
    expect(updated).toHaveLength(3);
    expect(updated[1]).toEqual(other1);
    expect(updated[2]).toEqual(other2);
  });

  test('saves the toggled list to localStorage (not the pre-toggle list)', () => {
    const todo = makeTodo({ id: '1', completed: false });
    const { container } = render(
      <Todo text={todo.text} todo={todo} todos={[todo]} setTodos={mockSetTodos} />
    );
    fireEvent.click(container.querySelector('.complete-btn'));
    expect(JSON.parse(localStorage.getItem('todos'))).toEqual([
      { ...todo, completed: true },
    ]);
  });
});