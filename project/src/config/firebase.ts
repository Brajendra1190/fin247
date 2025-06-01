import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDcuZVuxiq20SUZYaWmu4atBNf-ynPXXCk",
  authDomain: "finalyzepro.firebaseapp.com",
  projectId: "finalyzepro",
  storageBucket: "finalyzepro.appspot.com",
  messagingSenderId: "416026873897",
  appId: "1:416026873897:web:2f7347f3c32e7d36488c38",
  measurementId: "G-593JLMR2X1"
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