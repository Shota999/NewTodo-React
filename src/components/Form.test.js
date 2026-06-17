import { render, screen, fireEvent, act } from '@testing-library/react';
import Form from './Form';

const mockSetTodos = jest.fn();
const mockSetInputText = jest.fn();

beforeEach(() => {
  localStorage.clear();
  mockSetTodos.mockClear();
  mockSetInputText.mockClear();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

// ─── Empty input ──────────────────────────────────────────────────────────────

describe('empty input', () => {
  test('shows "Check input" popup on submit', () => {
    render(<Form setTodos={mockSetTodos} setInputText={mockSetInputText} inputText="" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Check input')).toBeInTheDocument();
  });

  test('does not call setTodos when input is empty', () => {
    render(<Form setTodos={mockSetTodos} setInputText={mockSetInputText} inputText="" />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockSetTodos).not.toHaveBeenCalled();
  });

  test('hides the popup after 1 second', () => {
    render(<Form setTodos={mockSetTodos} setInputText={mockSetInputText} inputText="" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Check input')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByText('Check input')).not.toBeInTheDocument();
  });
});

// ─── Valid input ──────────────────────────────────────────────────────────────

describe('valid input', () => {
  test('adds a todo with the correct text and completed: false', () => {
    render(
      <Form setTodos={mockSetTodos} setInputText={mockSetInputText} inputText="Buy milk" />
    );
    fireEvent.click(screen.getByRole('button'));
    const updater = mockSetTodos.mock.calls[0][0];
    const result = updater([]);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Buy milk');
    expect(result[0].completed).toBe(false);
    expect(result[0].id).toBeDefined();
  });

  test('appends to existing todos', () => {
    const existing = { id: 'old', text: 'Existing', completed: false };
    render(
      <Form setTodos={mockSetTodos} setInputText={mockSetInputText} inputText="New task" />
    );
    fireEvent.click(screen.getByRole('button'));
    const updater = mockSetTodos.mock.calls[0][0];
    const result = updater([existing]);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(existing);
    expect(result[1].text).toBe('New task');
  });

  test('saves the new todo to localStorage', () => {
    render(
      <Form setTodos={mockSetTodos} setInputText={mockSetInputText} inputText="Buy milk" />
    );
    fireEvent.click(screen.getByRole('button'));
    const updater = mockSetTodos.mock.calls[0][0];
    updater([]);
    const saved = JSON.parse(localStorage.getItem('todos'));
    expect(saved).toHaveLength(1);
    expect(saved[0].text).toBe('Buy milk');
  });

  test('clears the input after submitting', () => {
    render(
      <Form setTodos={mockSetTodos} setInputText={mockSetInputText} inputText="Buy milk" />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(mockSetInputText).toHaveBeenCalledWith('');
  });
});