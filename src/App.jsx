import { useEffect, useState } from "react"
import { NewTodoForm } from "./NewTodoForm"
import "./styles.css"
import { TodoList } from "./TodoList"

export default function App() {
  const [todos, setTodos] = useState(() => {
    const localValue = localStorage.getItem("ITEMS")
    if (localValue == null) return []

    return JSON.parse(localValue)
  })

  const [sortMethod, setSortMethod] = useState("default");

  function handleSortMethodChange(event) {
    setSortMethod(event.target.value);
  }

  function handleSort() {
    // Sort the todos array based on the selected method
    let sortedTodos = [...todos];
    if (sortMethod === "alphabetical-asc") {
      sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortMethod === "alphabetical-desc") {
      sortedTodos.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortMethod === "date-asc") {
      sortedTodos.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortMethod === "date-desc") {
      sortedTodos.sort((a, b) => b.id.localeCompare(a.id));
    }
  
    setTodos(sortedTodos);
  }

  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos])

  function addTodo(title) {
    setTodos((currentTodos) => {
      const newTodo = { id: crypto.randomUUID(), title, completed: false };
      const updatedTodos = [...currentTodos, newTodo];
  
      // Sort the updated todos array if needed
      if (sortMethod !== "default") {
        updatedTodos.sort((a, b) => {
          if (sortMethod === "alphabetical-asc") {
            return a.title.localeCompare(b.title);
          } else if (sortMethod === "alphabetical-desc") {
            return b.title.localeCompare(a.title);
          } else if (sortMethod === "date-asc") {
            return a.id.localeCompare(b.id);
          } else if (sortMethod === "date-desc") {
            return b.id.localeCompare(a.id);
          }
        });
      }
  
      return updatedTodos;
    });
  }
  
  function toggleTodo(id, completed) {
    setTodos((currentTodos) => {
      const updatedTodos = currentTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed };
        }
        return todo;
      });
  
      return updatedTodos;
    });
  }
  
  function deleteTodo(id) {
    setTodos((currentTodos) => {
      const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
  
      return updatedTodos;
    });
  }
  

  return (
  <>
    <h1 className="header">Todo List</h1>
    <div className="search-bar">
      <NewTodoForm onSubmit={addTodo} />
    </div>
    <div className="sort-controls">
      <label htmlFor="sort-method">Sort by:</label>
      <select id="sort-method" value={sortMethod} onChange={handleSortMethodChange}>
        <option value="default">Default</option>
        <option value="alphabetical-asc">Alphabetical A-Z</option>
        <option value="alphabetical-desc">Alphabetical Z-A</option>
        <option value="date-asc">Oldest First</option>
        <option value="date-desc">Newest First</option>
      </select>
      <button onClick={handleSort} className="btn">Sort</button>
    </div>
    <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
  </>
);
}