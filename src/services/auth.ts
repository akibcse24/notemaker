import type { IAuthService, User } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';

class AuthService implements IAuthService {
  public user: User | null = null;

  constructor() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (firebaseUser) => {
      this.user = this.mapUser(firebaseUser);
    });
  }

  private mapUser(firebaseUser: FirebaseUser | null): User | null {
    if (!firebaseUser) return null;
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || '',
    };
  }

  async login(): Promise<User> {
    // Force Mock Auth in Dev/Sandbox to prevent popup blocking issues in headless environments
    if (import.meta.env.DEV) {
        console.warn("Using Mock Auth (Forced for Dev/Testing)");
        const mockUser = { id: 'mock-user', email: 'demo@example.com', name: 'Demo User' };
        this.user = mockUser;
        localStorage.setItem('user', JSON.stringify(mockUser));
        return mockUser;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = this.mapUser(result.user);
      if (!user) throw new Error('Login failed');
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("Firebase Login Error:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
    this.user = null;
    localStorage.removeItem('user');
  }

  async getUser(): Promise<User | null> {
    return new Promise((resolve) => {
       const unsubscribe = onAuthStateChanged(auth, (user) => {
           unsubscribe();
           resolve(this.mapUser(user));
       });
    });
  }
}

export const authService = new AuthService();
