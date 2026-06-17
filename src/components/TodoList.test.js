import { render, screen } from '@testing-library/react';
import TodoList from './TodoList';

const mockSetTodos = jest.fn();

const makeTodo = (id, text, completed = false) => ({ id, text, completed });

beforeEach(() => {
  localStorage.clear();
  mockSetTodos.mockClear();
});

test('renders every todo in filteredTodos', () => {
  const todos = [
    makeTodo('1', 'First'),
    makeTodo('2', 'Second'),
    makeTodo('3', 'Third'),
  ];
  render(<TodoList todos={todos} setTodos={mockSetTodos} filteredTodos={todos} />);
  expect(screen.getByText('First')).toBeInTheDocument();
  expect(screen.getByText('Second')).toBeInTheDocument();
  expect(screen.getByText('Third')).toBeInTheDocument();
});

test('only renders filteredTodos, not the full todos list', () => {
  const all = [makeTodo('1', 'Visible'), makeTodo('2', 'Hidden')];
  render(
    <TodoList todos={all} setTodos={mockSetTodos} filteredTodos={[all[0]]} />
  );
  expect(screen.getByText('Visible')).toBeInTheDocument();
  expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
});

test('renders an empty list when filteredTodos is empty', () => {
  const { container } = render(
    <TodoList todos={[]} setTodos={mockSetTodos} filteredTodos={[]} />
  );
  expect(container.querySelector('.todo_list').children).toHaveLength(0);
});