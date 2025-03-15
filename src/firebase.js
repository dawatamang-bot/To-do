import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCnbkRrfXAzoiXyEBHx6d90lVqK9Gdto2E",
  authDomain: "todo-list-app-bd60a.firebaseapp.com",
  projectId: "todo-list-app-bd60a",
  storageBucket: "todo-list-app-bd60a.appspot.com",
  messagingSenderId: "41631197069",
  appId: "1:41631197069:web:832f16e6aed85f7f2651c4"
};

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Set persistence to LOCAL (this will help with auth state persistence)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

// Create a Google provider instance
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth functions
export const registerWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    return result.user;
  } catch (error) {
    console.error('Error registering with email:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Error logging in with email:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in popup was closed. Please try again.');
    }
    throw new Error(getErrorMessage(error.code));
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in or use a different email.';
    case 'auth/invalid-email':
      return 'Invalid email address. Please check and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please register first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Only one popup request allowed at a time. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};

// Todo functions
const TODOS_COLLECTION = 'todos';

export const addTodo = async (userId, todoData) => {
  try {
    const todosRef = collection(db, TODOS_COLLECTION);
    const docRef = await addDoc(todosRef, {
      ...todoData,
      userId,
      completed: false,
      createdAt: serverTimestamp()
    });
    return {
      id: docRef.id,
      ...todoData,
      userId,
      completed: false,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const updateTodo = async (todoId, updates) => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (todoId) => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await deleteDoc(todoRef);
    return true;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const getTodos = (userId, callback) => {
  try {
    const todosRef = collection(db, TODOS_COLLECTION);
    const q = query(
      todosRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, 
      (snapshot) => {
        const todos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toMillis() || Date.now()
        }));
        callback(todos);
      },
      (error) => {
        console.error('Error in todos listener:', error);
        callback([]);
      }
    );
  } catch (error) {
    console.error('Error setting up todos listener:', error);
    callback([]);
    return () => {};
  }
};

export default app;
