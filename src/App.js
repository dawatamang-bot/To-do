import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSun, FaMoon, FaGoogle } from 'react-icons/fa';
import { toggleDarkMode } from './redux/slices/todoSlice';
import { auth, signOutUser, signInWithGoogle, loginWithEmail, registerWithEmail } from './firebase';
import TodoList from './components/todos/TodoList';
import { setUser, clearUser, setLoading, setError } from './redux/slices/authSlice';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.todos);
  const { user, error: authError, isLoading } = useSelector(state => state.auth);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    
    try {
      if (isRegistering) {
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      
      setEmail('');
      setPassword('');
      setName('');
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleSignIn = async () => {
    dispatch(setLoading(true));
    try {
      await signInWithGoogle();
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Navbar */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Todo List
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {darkMode ? <FaSun className="h-6 w-6" /> : <FaMoon className="h-6 w-6" />}
              </button>
              {user && (
                <>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!user ? (
          <div className="max-w-md mx-auto">
            <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {isRegistering ? 'Create an Account' : 'Welcome Back'}
              </h2>
              
              {authError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`mt-1 block w-full rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-50 text-gray-900'
                      } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`mt-1 block w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-50 text-gray-900'
                    } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`mt-1 block w-full rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-50 text-gray-900'
                    } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Please wait...' : (isRegistering ? 'Register' : 'Sign In')}
                </button>
              </form>

              <div className="mt-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaGoogle className="w-5 h-5 text-red-500" />
                  Sign in with Google
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setEmail('');
                    setPassword('');
                    setName('');
                    dispatch(setError(null));
                  }}
                  disabled={isLoading}
                  className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isRegistering
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Register"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <TodoList />
        )}
      </div>
    </div>
  );
}

export default App;
