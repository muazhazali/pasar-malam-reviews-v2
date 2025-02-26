import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', userId));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function setAdminStatus(userId: string, email: string): Promise<void> {
  try {
    await setDoc(doc(db, 'admins', userId), {
      email,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error setting admin status:', error);
    throw error;
  }
} 