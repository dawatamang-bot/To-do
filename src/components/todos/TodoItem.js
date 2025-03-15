import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTodoAsync, deleteTodoAsync } from '../../redux/slices/todoSlice';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const TodoItem = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: todo.title,
    description: todo.description || '',
    dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : ''
  });
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.todos);

  const handleUpdate = async () => {
    if (!editForm.title.trim()) return;
    try {
      await dispatch(updateTodoAsync({
        todoId: todo.id,
        updates: {
          ...editForm,
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          dueDate: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : null
        }
      })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleComplete = async () => {
    try {
      await dispatch(updateTodoAsync({
        todoId: todo.id,
        updates: { completed: !todo.completed }
      })).unwrap();
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTodoAsync(todo.id)).unwrap();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
                placeholder="Task title"
              />
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
                placeholder="Description"
                rows="2"
              />
              <div className="flex items-center gap-2">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Due:</span>
                <input
                  type="datetime-local"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                  className={`p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <FaTimes />
                </button>
                <button
                  onClick={handleUpdate}
                  className="p-2 text-green-500 hover:text-green-600"
                >
                  <FaCheck />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} ${todo.completed ? 'line-through' : ''}`}>
                  {todo.title}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              {todo.description && (
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {todo.description}
                </p>
              )}
              {todo.dueDate && (
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Due: {new Date(todo.dueDate).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
