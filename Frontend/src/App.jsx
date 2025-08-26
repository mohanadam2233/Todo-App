import { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClipboardOutline } from "react-icons/io5";

function App() {
  const [newTodo, setnewTodo] = useState("");
  const [todos, setTodo] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  // Fetch existing todos on load
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("/api/todos");
        setTodo(response.data);
      } catch (error) {
        console.error("Error fetching todos", error);
      }
    };
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  }
  const AddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodo([...todos, response.data]); // Add new todo to state
      setnewTodo(""); // Clear input
    } catch (error) {
      console.error("Error adding todo", error);
    }
  };
  const updateTodo = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText
      });
      setTodo(todos.map(todo => todo._id === id ? response.data : todo));
      setEditingTodo(null); // Exit editing mode
    } catch (error) {
      console.log("Error updating todo", error);
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodo(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };
  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodo(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (error) {
      console.log("Error toggline todo:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 ">
      <div className="bg-gray-850 rounded-3xl shadow-stone-500 shadow-2xl w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-gray-300 mb-8 text-center">
          Task Manager
        </h1>
        <form onSubmit={AddTodo} className="flex items-center gap-4">
          <input
            value={newTodo}
            onChange={(e) => setnewTodo(e.target.value)}
            type="text"
            placeholder="Enter task title"
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
           className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded-md font-medium cursor-pointer w-full sm:w-auto flex items-center gap-1 sm:gap-2 justify-center"
          >
            Add Task
          </button>
        </form>

        <div className="mt-4">
          <div className="flex flex-col gap-4">
            {todos.length === 0 ? (
              <p className="text-gray-400 text-center">No tasks yet</p>
            ) : (
              todos.map((todo) => (
                <div key={todo._id} className="text-white py-2 border-b border-gray-700">
                  {editingTodo === todo._id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        className="flex-1 p-3 border border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-green-700 shadow-inner"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(
                          e.target.value)} />
                      <div className="flex gap-x-2">
                        <button onClick={() => updateTodo(todo._id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer">
                          <MdOutlineDone />
                        </button>

                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
                          onClick={() => setEditingTodo(null)}>
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-4 overflow-hidden">
                          <button
                            onClick={() => toggleTodo(todo._id)}
                            className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center ${todo.completed
                                ? "bg-green-500 border-green-500"
                                : "border-gray-700 cursor-pointer"
                              }`}
                          >
                            {todo.completed && <MdOutlineDone />}
                          </button>
                          <span className="text-gray-400 font-medium">{todo.text}</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <button
                            className="text-green-500 hover:text-green-600 transition-colors duration-200 p-2 rounded-lg cursor-pointer"
                            onClick={() => startEditing(todo)}>
                            <MdModeEditOutline />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="text-red-500 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg cursor-pointer"
                          ><FaTrash /></button>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
