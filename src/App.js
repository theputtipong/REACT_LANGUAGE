import { React, useState, useEffect } from "react";
// import logo from "./logo.svg";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState(() => {
    const saveTodos = localStorage.getItem("todos");
    if (saveTodos) {
      return JSON.parse(saveTodos);
    } else {
      return [];
    }
  });
  const [todo, setTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});

  function handleEditInputChange(e) {
    setCurrentTodo({
      ...currentTodo,
      text: e.target.value,
    });
    console.log("currentTodo", currentTodo);
  }

  useEffect(() => {
    //save data to web local
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  function handleFromSubmit(e) {
    e.preventDefault(); //event no refresh when submit

    if (todo !== "") {
      setTodos([
        ...todos,
        {
          id: todo.length + 1,
          text: todo.trim(),
        },
      ]);
    }

    setTodo("");
  }

  function handleDeleteClick(id) {
    const removeItem = todos.filter((todo) => {
      return todo.id !== id;
    });

    setTodos(removeItem);
  }

  function handleEditClick(todo) {
    setIsEditing(true);
    setCurrentTodo({ ...todo });
  }

  function handleUpdateTodo(id, updateTodo) {
    const updatedItem = todos.map((todo) => {
      return todo.id === id ? updateTodo : todo;
    });

    setIsEditing(false);
    setTodos(updatedItem);
  }

  function handleEditFromSubmit(e) {
    e.preventDefault();
    handleUpdateTodo(currentTodo.id, currentTodo);
  }

  function handleExportExcel(e) {
    const excelData = JSON.stringify(todos);
    console.log("handleExportExcel", excelData);
    const url = URL.createObjectURL(new Blob([excelData]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${Date.now()}.xls`);
    document.body.appendChild(link);
    link.click();
  }

  console.log(todos);

  return (
    <div className="App">
      <h1>TCSMGMT</h1>
      {isEditing ? (
        <form onSubmit={handleEditFromSubmit}>
          <h2>TCSMGMT EDIT TODO</h2>
          <label htmlFor="editTodo">Edit todo: </label>
          <input
            type="text"
            name="edit todo"
            placeholder="Edit this todo"
            value={currentTodo.text}
            onChange={handleEditInputChange}
          ></input>
          <button type="submit">Update</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <form onSubmit={handleFromSubmit}>
          <input
            type="text"
            name="todo"
            placeholder="Create new todo"
            value={todo}
            onChange={handleInputChange}
          ></input>
          <button type="submit">Add</button>
        </form>
      )}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}{" "}
            <button onClick={() => handleEditClick(todo)}>Edit</button>
            <button onClick={() => handleDeleteClick(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <button onClick={() => handleExportExcel(todo)}>Download Excel</button>
    </div>
  );
};

export default App;
