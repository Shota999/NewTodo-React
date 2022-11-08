const Todo = ({ text, todo, todos, setTodos }) => {
  const deleteHandler = () => {
    setTodos(todos.filter((el) => el.id !== todo.id));
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  const completeHandler = () => {
    // setTodos(
    //   todos.map((item) => {
    //     if (item.id === todo.id) {
    //       return {
    //         ...item,
    //         completed: !item.completed,
    //       };
    //     }
    //     return item;
    //   })
    // );
    setTodos((todo) => {
      const newList = todos.map((item) => {
        if (item.id === todo.id) {
          return {
            ...item,
            completed: !item.completed,
          };
        }
      });
      return newList;
    })
    
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  return (
    <div className="todo">
      <button
        onClick={completeHandler}
        className={`complete-btn ${todo.completed ? "completed" : ""}`}
      >
        <span className="check">
          <i className="fa-solid fa-check"></i>
        </span>
      </button>
      <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
        <p>{text}</p>
      </li>
      <button onClick={deleteHandler} className="trash-btn">
        <i className="fa-solid fa-x"></i>
      </button>
    </div>
  );
};

export default Todo;
