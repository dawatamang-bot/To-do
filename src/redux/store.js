import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './slices/todoSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    todos: todoReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['auth.user', 'todos.todos'],
        ignoredActions: ['auth/setUser', 'auth/clearUser', 'todos/setTodos']
      }
    })
});

export default store;
