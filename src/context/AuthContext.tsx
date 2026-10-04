import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setAuthToken(token);
          setAdmin({
            id: firebaseUser.uid,
            email: firebaseUser.email || 'admin@pengawassekolah.id',
            name: firebaseUser.displayName || 'Administrator Portal',
            role: 'SUPERADMIN'
          });
        } catch {
          setAdmin(null);
        }
      } else {
        const localToken = getAuthToken();
        if (localToken) {
          try {
            const data = await api.getMe();
            setAdmin(data);
          } catch {
            removeAuthToken();
            setAdmin(null);
          }
        } else {
          setAdmin(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshMe = async () => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      setAuthToken(token);
      setAdmin({
        id: auth.currentUser.uid,
        email: auth.currentUser.email || 'admin@pengawassekolah.id',
        name: auth.currentUser.displayName || 'Administrator Portal',
        role: 'SUPERADMIN'
      });
    } else {
      const token = getAuthToken();
      if (!token) {
        setAdmin(null);
        return;
      }
      try {
        const data = await api.getMe();
        setAdmin(data);
      } catch {
        removeAuthToken();
        setAdmin(null);
      }
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // 1. Coba autentikasi menggunakan Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const token = await userCredential.user.getIdToken();
      setAuthToken(token);
      setAdmin({
        id: userCredential.user.uid,
        email: userCredential.user.email || credentials.email,
        name: userCredential.user.displayName || 'Administrator Portal',
        role: 'SUPERADMIN'
      });
    } catch (firebaseErr: any) {
      // Jika user belum terdaftar di Firebase Auth (misal saat inisiasi awal), buat akun secara otomatis
      if (
        firebaseErr.code === 'auth/user-not-found' ||
        firebaseErr.code === 'auth/invalid-credential' ||
        firebaseErr.code === 'auth/invalid-email'
      ) {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
          const token = await newCredential.user.getIdToken();
          setAuthToken(token);
          setAdmin({
            id: newCredential.user.uid,
            email: newCredential.user.email || credentials.email,
            name: 'Administrator Portal',
            role: 'SUPERADMIN'
          });
          return;
        } catch {
          // Lanjutkan ke fallback
        }
      }

      // Fallback ke server internal
      const res = await api.login(credentials);
      setAuthToken(res.token);
      setAdmin(res.admin);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    removeAuthToken();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        refreshMe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
