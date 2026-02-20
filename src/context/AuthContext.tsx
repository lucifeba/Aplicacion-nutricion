import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User, OnboardingData } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ADMIN_EMAIL = 'admin@apdsport.com';
const ADMIN_PASSWORD = 'APDSport2024!Admin';
const ADMIN_USER: User = {
  id: 'admin-001',
  email: ADMIN_EMAIL,
  name: 'APD Sport Admin',
  role: 'admin',
  createdAt: new Date().toISOString(),
  onboardingCompleted: true,
};

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  return SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  return SecureStore.deleteItemAsync(key);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    const usersJson = await getItem('allUsers');
    if (usersJson) {
      setAllUsers(JSON.parse(usersJson));
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const currentUserJson = await getItem('currentUser');
        if (currentUserJson) {
          setUser(JSON.parse(currentUserJson));
        }
        await loadUsers();
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    })();
  }, [loadUsers]);

  const login = async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      await setItem('currentUser', JSON.stringify(ADMIN_USER));
      setUser(ADMIN_USER);
      return { success: true };
    }

    const passwordsJson = await getItem('passwords');
    const passwords: Record<string, string> = passwordsJson ? JSON.parse(passwordsJson) : {};
    const usersJson = await getItem('allUsers');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    const foundUser = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!foundUser) return { success: false, error: 'Usuario no encontrado' };
    if (passwords[foundUser.id] !== password) return { success: false, error: 'Contraseña incorrecta' };

    await setItem('currentUser', JSON.stringify(foundUser));
    setUser(foundUser);
    return { success: true };
  };

  const register = async (email: string, password: string, name: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail === ADMIN_EMAIL) return { success: false, error: 'Este email no está disponible' };

    const usersJson = await getItem('allUsers');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'Este email ya está registrado' };
    }

    const newUser: User = {
      id: uuidv4(),
      email: trimmedEmail,
      name: name.trim(),
      role: 'client',
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
    };

    const updatedUsers = [...users, newUser];
    const passwordsJson = await getItem('passwords');
    const passwords: Record<string, string> = passwordsJson ? JSON.parse(passwordsJson) : {};
    passwords[newUser.id] = password;

    await setItem('allUsers', JSON.stringify(updatedUsers));
    await setItem('passwords', JSON.stringify(passwords));
    await setItem('currentUser', JSON.stringify(newUser));

    setAllUsers(updatedUsers);
    setUser(newUser);
    return { success: true };
  };

  const logout = async () => {
    await deleteItem('currentUser');
    setUser(null);
  };

  const completeOnboarding = async (data: OnboardingData) => {
    if (!user) return;
    await setItem(`onboarding_${user.id}`, JSON.stringify(data));

    const updatedUser = { ...user, onboardingCompleted: true, name: data.name || user.name };
    const usersJson = await getItem('allUsers');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);

    await setItem('allUsers', JSON.stringify(updatedUsers));
    await setItem('currentUser', JSON.stringify(updatedUser));

    setAllUsers(updatedUsers);
    setUser(updatedUser);
  };

  const resetPassword = async (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const usersJson = await getItem('allUsers');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    const foundUser = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!foundUser) return { success: false, error: 'No se encontró una cuenta con ese email' };

    const passwordsJson = await getItem('passwords');
    const passwords: Record<string, string> = passwordsJson ? JSON.parse(passwordsJson) : {};
    passwords[foundUser.id] = 'Reset1234!';
    await setItem('passwords', JSON.stringify(passwords));

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, allUsers, isLoading, login, register, logout, completeOnboarding, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
