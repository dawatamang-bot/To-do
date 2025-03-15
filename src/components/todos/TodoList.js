import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTodos } from '../../firebase';
import { setTodos } from '../../redux/slices/todoSlice';
import AddTodo from './AddTodo';
import Todos from './Todos';

function TodoList() {
    const dispatch = useDispatch();
    const { darkMode } = useSelector((state) => state.todos);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) return;

        let unsubscribe;
        try {
            // Set up real-time listener for todos
            unsubscribe = getTodos(user.uid, (updatedTodos) => {
                dispatch(setTodos(updatedTodos));
            });
        } catch (err) {
            console.error('Error setting up Firebase listener:', err);
        }

        // Cleanup listener on unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user, dispatch]);

    if (!user) {
        return (
            <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <h2 className="text-2xl font-bold mb-4">Welcome to Todo List</h2>
                <p className="text-lg">Please sign in to manage your todos</p>
            </div>
        );
    }

    return (
        <div className={`space-y-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <AddTodo />
            <Todos />
        </div>
    );
}

export default TodoList;
