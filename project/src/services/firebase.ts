import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { UserProfile, UserData } from '../types/user';

export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserData : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

export async function updateUserData(userId: string, data: Partial<UserData>): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } else {
      await setDoc(docRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}

export async function createUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...data,
        uid: userId,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        transactions: [],
        recurringTransactions: [],
        budgets: [],
        categories: []
      });
    } else {
      await updateDoc(userRef, {
        ...data,
        lastLoginAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}