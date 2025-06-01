import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserData, createUserProfile } from '../services/firebase';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  userProfile: any;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user.uid, {
        email: result.user.email ?? undefined,
        displayName: result.user.displayName ?? undefined,
        defaultCurrency: 'USD',
        settings: {
          darkMode: false,
          emailNotifications: true
        }
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if this is a new user
      const userData = await getUserData(user.uid);
      if (!userData) {
        // Create new user profile if it doesn't exist
        await createUserProfile(user.uid, {
          email: user.email ?? undefined,
          displayName: user.displayName ?? undefined,
          defaultCurrency: 'USD',
          settings: {
            darkMode: false,
            emailNotifications: true
          }
        });
        toast.success('Welcome! Your account has been created.');
      } else {
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
      }
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async function updateProfile(data: any) {
    if (!currentUser) throw new Error('No user logged in');
    try {
      await createUserProfile(currentUser.uid, {
        ...userProfile,
        ...data,
        updatedAt: new Date().toISOString()
      });
      setUserProfile({ ...userProfile, ...data });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getUserData(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}