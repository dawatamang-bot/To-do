import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addTodo as addTodoToFirebase, updateTodo as updateTodoInFirebase, deleteTodo as deleteTodoFromFirebase } from '../../firebase';

// Initial state
const initialState = {
  todos: [],
  isLoading: false,
  error: null,
  darkMode: localStorage.getItem('darkMode') === 'true'
};

// Async thunks
export const addTodoAsync = createAsyncThunk(
  'todos/addTodo',
  async ({ userId, todoData }, { rejectWithValue }) => {
    try {
      const response = await addTodoToFirebase(userId, todoData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTodoAsync = createAsyncThunk(
  'todos/updateTodo',
  async ({ todoId, updates }, { rejectWithValue }) => {
    try {
      await updateTodoInFirebase(todoId, updates);
      return { id: todoId, ...updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodoAsync = createAsyncThunk(
  'todos/deleteTodo',
  async (todoId, { rejectWithValue }) => {
    try {
      await deleteTodoFromFirebase(todoId);
      return todoId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add todo
      .addCase(addTodoAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos.unshift(action.payload);
      })
      .addCase(addTodoAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add todo';
      })
      // Update todo
      .addCase(updateTodoAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTodoAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = { ...state.todos[index], ...action.payload };
        }
      })
      .addCase(updateTodoAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update todo';
      })
      // Delete todo
      .addCase(deleteTodoAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete todo';
      });
  }
});

export const { setTodos, toggleDarkMode, clearError } = todoSlice.actions;
export default todoSlice.reducer;
