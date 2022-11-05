const Form = ({ setInputText, todos, setTodos, inputText, setStatus }) => {
  const inputTextHandler = (e) => {
    setInputText(e.target.value);
  };
  const submitTodoHandler = (e) => {
    e.preventDefault();
    setTodos([
      ...todos,
      { text: inputText, completed: false, id: Math.random() * 1000 },
    ]);
    setInputText("");
  };

  return (
    <form>
      <div className="container add">
        <button
          className="todo_button"
          type="submit"
          onClick={submitTodoHandler}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
        <input
          value={inputText}
          onChange={inputTextHandler}
          type="text"
          className="todo_input"
          placeholder="Create a new Todo..."
        />
      </div>
    </form>
  );
};

export default Form;
