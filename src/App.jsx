import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await axios.post(API_URL, { title: newTitle });
      setTodos([...todos, res.data]);
      setNewTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCompleted = async (todo) => {
    try {
      const res = await axios.put(`${API_URL}/${todo.id}`, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? res.data : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Nueva tarea"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button onClick={addTodo}>Agregar</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompleted(todo)}
            />
            {todo.title}
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
