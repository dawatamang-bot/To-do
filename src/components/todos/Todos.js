import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTodoAsync, deleteTodoAsync } from '../../redux/slices/todoSlice';
import { FaTrash, FaCheck, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function Todos() {
    const { todos, darkMode, isLoading } = useSelector(state => state.todos);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [editingTodo, setEditingTodo] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const handleToggleComplete = async (todo) => {
        try {
            await dispatch(updateTodoAsync({
                todoId: todo.id,
                updates: { completed: !todo.completed }
            })).unwrap();
        } catch (error) {
            console.error('Failed to toggle todo completion:', error);
        }
    };

    const handleDelete = async (todoId) => {
        try {
            await dispatch(deleteTodoAsync(todoId)).unwrap();
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    const startEditing = (todo) => {
        setEditingTodo(todo);
        setEditTitle(todo.title);
        setEditDescription(todo.description || '');
    };

    const cancelEditing = () => {
        setEditingTodo(null);
        setEditTitle('');
        setEditDescription('');
    };

    const handleSaveEdit = async (todoId) => {
        if (!editTitle.trim()) return;

        try {
            await dispatch(updateTodoAsync({
                todoId,
                updates: {
                    title: editTitle.trim(),
                    description: editDescription.trim()
                }
            })).unwrap();
            cancelEditing();
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    };

    if (!user) return null;

    if (isLoading) {
        return (
            <div className={`text-center py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Loading todos...
            </div>
        );
    }

    if (!todos?.length) {
        return (
            <div className={`text-center py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No tasks yet. Add one above!
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Your Tasks
            </h2>
            <div className="space-y-4">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className={`${
                            darkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
                            todo.completed ? 'opacity-75' : ''
                        }`}
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                    <button
                                        onClick={() => handleToggleComplete(todo)}
                                        className={`p-2 rounded-full ${
                                            todo.completed
                                                ? 'bg-green-500 text-white'
                                                : darkMode
                                                ? 'bg-gray-700 text-gray-300'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}
                                    >
                                        <FaCheck className="h-4 w-4" />
                                    </button>
                                    <div className="flex-1">
                                        {editingTodo?.id === todo.id ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className={`w-full px-2 py-1 rounded ${
                                                        darkMode
                                                            ? 'bg-gray-700 text-white'
                                                            : 'bg-gray-50 text-gray-900'
                                                    }`}
                                                    placeholder="Task title"
                                                />
                                                <textarea
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    className={`w-full px-2 py-1 rounded ${
                                                        darkMode
                                                            ? 'bg-gray-700 text-white'
                                                            : 'bg-gray-50 text-gray-900'
                                                    }`}
                                                    placeholder="Description (optional)"
                                                    rows="2"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className={`text-lg font-medium ${
                                                    darkMode ? 'text-white' : 'text-gray-900'
                                                } ${todo.completed ? 'line-through' : ''}`}>
                                                    {todo.title}
                                                </h3>
                                                {todo.description && (
                                                    <p className={`mt-1 ${
                                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                                    } ${todo.completed ? 'line-through' : ''}`}>
                                                        {todo.description}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {editingTodo?.id === todo.id ? (
                                        <>
                                            <button
                                                onClick={() => handleSaveEdit(todo.id)}
                                                className={`p-2 ${
                                                    darkMode
                                                        ? 'text-green-400 hover:text-green-300'
                                                        : 'text-green-600 hover:text-green-700'
                                                }`}
                                            >
                                                <FaSave className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={cancelEditing}
                                                className={`p-2 ${
                                                    darkMode
                                                        ? 'text-gray-400 hover:text-gray-300'
                                                        : 'text-gray-600 hover:text-gray-700'
                                                }`}
                                            >
                                                <FaTimes className="h-5 w-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEditing(todo)}
                                                className={`p-2 ${
                                                    darkMode
                                                        ? 'text-blue-400 hover:text-blue-300'
                                                        : 'text-blue-600 hover:text-blue-700'
                                                }`}
                                            >
                                                <FaEdit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(todo.id)}
                                                className={`p-2 ${
                                                    darkMode
                                                        ? 'text-red-400 hover:text-red-300'
                                                        : 'text-red-600 hover:text-red-700'
                                                }`}
                                            >
                                                <FaTrash className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Todos;
