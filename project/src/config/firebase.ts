import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBD3VHv0qsSWFT2owNNNQpIjA6kY3GR3Oc",
  authDomain: "chai-61ebd.chai-61ebd.firebaseapp.com",
  projectId: "chai-61ebd",
  storageBucket: "chai-61ebd.appspot.com",
  messagingSenderId: "907556775279",
  appId: "1:907556775279:web:48d115f85983bc3060749a",
  measurementId: "G-CCGTM7NTSD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});