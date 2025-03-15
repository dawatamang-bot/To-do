import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodoAsync } from '../../redux/slices/todoSlice';

function AddTodo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { darkMode } = useSelector(state => state.todos);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await dispatch(addTodoAsync({
                userId: user.uid,
                todoData: {
                    title: title.trim(),
                    description: description.trim()
                }
            })).unwrap();

            // Clear form
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    if (!user) return null;

    return (
        <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Task Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className={`mt-1 block w-full rounded-md ${
                            darkMode 
                                ? 'bg-gray-700 text-white placeholder-gray-400' 
                                : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                        } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add more details..."
                        rows="3"
                        className={`mt-1 block w-full rounded-md ${
                            darkMode 
                                ? 'bg-gray-700 text-white placeholder-gray-400' 
                                : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                        } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Task
                </button>
            </div>
        </form>
    );
}

export default AddTodo;
