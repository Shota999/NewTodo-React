import { useState } from "react";

let timeOute = null;

const Form = ({ setInputText, setTodos, inputText }) => {
  const [showPopup, setShowPopup] = useState(false);
  
  const inputTextHandler = (e) => {
    setInputText(e.target.value);
  };
  const submitTodoHandler = (e) => {
    e.preventDefault();

    if (!inputText) {
      clearInterval(timeOute);
      timeOute = setTimeout(() => {
        setShowPopup(false);
      }, 1000);
      return setShowPopup(true);
    }

    setTodos((prev) => {
      const list = [
        ...prev,
        { text: inputText, completed: false, id: Math.random() * 1000 },
      ];
      localStorage.setItem("todos", JSON.stringify(list));

      return list;
    });
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
      {showPopup && <div className="popup">Check input</div>}
    </form>
  );
};

export default Form;
