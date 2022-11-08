import React, { useState, useEffect } from "react";
import "./App.scss";
import Form from "./components/Form";
import TodoList from "./components/TodoList";

function App() {
  const [inputText, setInputText] = useState("");
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState([]);

  // ერთხელ გაშვება

  useEffect(() => {
    if (localStorage.getItem("todos")) {
      const todoLocal = JSON.parse(localStorage.getItem("todos"));
      setTodos(todoLocal);
    }
  }, []);

  useEffect(() => {
    switch (status) {
      case "completed":
        setFilteredTodos(todos.filter((todo) => todo.completed === true));
        break;
      case "uncompleted":
        setFilteredTodos(todos.filter((todo) => todo.completed === false));
        break;
      default:
        setFilteredTodos(todos);
        break;
    }
  }, [todos, status]);

  const clearHandle = () => {
    setTodos([]);
    localStorage.removeItem("todos");
  };
  return (
    <div className="App">
      <header>
        <h1>Todo</h1>
      </header>
      <Form
        todos={todos}
        setTodos={setTodos}
        setInputText={setInputText}
        inputText={inputText}
      />
      <section>
        <div className="length">
          <span>Active Tasks: {todos.length}</span>
        </div>
        <div
          onClick={(e) => setStatus(e.target.value)}
          name="todos"
          className="options"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
        </div>
        <div className="clear" onClick={clearHandle}>
          <span>Clear All</span>
        </div>
      </section>

      <TodoList
        setTodos={setTodos}
        todos={todos}
        filteredTodos={filteredTodos}
      />
    </div>
  );
}

export default App;
