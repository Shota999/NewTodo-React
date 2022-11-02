import React, { useState } from 'react';
import './App.scss';
import Form from './components/Form';
import TodoList from './components/TodoList';

function App() {

  const [ inputText, setInputText ] = useState("");
  const [ todos, setTodos ] = useState([]);

  return (
    <div className="App">
      <header>
        <h1>Todo List</h1>
        <Form 
          todos={todos} 
          setTodos={setTodos} 
          setInputText={setInputText} 
          inputText={inputText} />
        <TodoList
          setTodos={setTodos}
          todos={todos} />
    </header>
    </div>
  );
}

export default App;
