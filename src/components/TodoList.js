import Todo from "./Todo";

const TodoList = ({ todos , setTodos, filteredTodos}) => {

  return (
    <div className="todo_container">
      <ul className="todo_list">
        {filteredTodos.map(todo => (
            <Todo 
                setTodos={setTodos}
                todos={todos}
                key={todo.id}
                todo={todo}
                text={todo.text} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
