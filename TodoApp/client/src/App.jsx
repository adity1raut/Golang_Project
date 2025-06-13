import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Edit, Loader2 } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/todos');
      const data = await response.json();
      // Ensure data is an array, fallback to empty array if null/undefined
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      // Set to empty array on error
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!task.trim()) return;
    
    try {
      const response = await fetch('http://localhost:8000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, status: false }),
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setTask('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      const updatedTodo = { ...todoToUpdate, status: !todoToUpdate.status };
      
      await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, status: !todo.status } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          task: editText,
          status: todos.find(todo => todo.id === id).status
        }),
      });
      
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">Todo App</h1>
        
        <div className="flex mb-6">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button 
            onClick={addTodo}
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition flex items-center"
          >
            <Plus className="mr-1" size={20} />
            Add
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={24} />
          </div>
        ) : (
          <ul className="space-y-3">
            {/* Add null check here */}
            {todos && todos.map((todo) => (
              <li 
                key={todo.id} 
                className={`p-4 border rounded-lg flex items-center justify-between ${
                  todo.status ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center flex-grow">
                  <button
                    onClick={() => toggleStatus(todo.id)}
                    className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                      todo.status ? 'bg-green-500 text-white' : 'border-2 border-gray-300'
                    }`}
                  >
                    {todo.status && <Check size={16} />}
                  </button>
                  
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-grow px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      autoFocus
                      onBlur={() => saveEdit(todo.id)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                    />
                  ) : (
                    <span 
                      className={`flex-grow ${todo.status ? 'line-through text-gray-500' : 'text-gray-800'}`}
                    >
                      {todo.task}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {editingId !== todo.id && (
                    <button
                      onClick={() => startEditing(todo.id, todo.task)}
                      className="text-gray-500 hover:text-indigo-600 transition"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-gray-500 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;