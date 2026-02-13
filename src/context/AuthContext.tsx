import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, UserRole, OnboardingData } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Admin credentials
const ADMIN_EMAIL = 'admin@apdsport.com';
const ADMIN_PASSWORD = 'APDSport2024!Admin';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedUser = await SecureStore.getItemAsync('currentUser');
      const storedUsers = await SecureStore.getItemAsync('allUsers');
      if (storedUsers) {
        setAllUsers(JSON.parse(storedUsers));
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveUsers(users: User[]) {
    setAllUsers(users);
    await SecureStore.setItemAsync('allUsers', JSON.stringify(users));
  }

  async function login(email: string, password: string) {
    // Admin login
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin-001',
        email: ADMIN_EMAIL,
        name: 'APD Sport Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
        onboardingCompleted: true,
      };
      setUser(adminUser);
      await SecureStore.setItemAsync('currentUser', JSON.stringify(adminUser));
      return { success: true };
    }

    // Client login
    const storedPasswords = await SecureStore.getItemAsync('passwords');
    const passwords: Record<string, string> = storedPasswords ? JSON.parse(storedPasswords) : {};

    const matchedUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser) {
      return { success: false, error: 'No existe una cuenta con este email' };
    }
    if (passwords[matchedUser.id] !== password) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    setUser(matchedUser);
    await SecureStore.setItemAsync('currentUser', JSON.stringify(matchedUser));
    return { success: true };
  }

  async function register(email: string, password: string, name: string) {
    if (email.toLowerCase() === ADMIN_EMAIL) {
      return { success: false, error: 'Este email no está disponible' };
    }

    const exists = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Ya existe una cuenta con este email' };
    }

    const newUser: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      name,
      role: 'client',
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
    };

    const updatedUsers = [...allUsers, newUser];
    await saveUsers(updatedUsers);

    const storedPasswords = await SecureStore.getItemAsync('passwords');
    const passwords: Record<string, string> = storedPasswords ? JSON.parse(storedPasswords) : {};
    passwords[newUser.id] = password;
    await SecureStore.setItemAsync('passwords', JSON.stringify(passwords));

    setUser(newUser);
    await SecureStore.setItemAsync('currentUser', JSON.stringify(newUser));
    return { success: true };
  }

  async function completeOnboarding(data: OnboardingData) {
    if (!user) return;
    const updatedUser = { ...user, onboardingCompleted: true };
    setUser(updatedUser);
    await SecureStore.setItemAsync('currentUser', JSON.stringify(updatedUser));

    const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
    await saveUsers(updatedUsers);

    // Store onboarding data
    await SecureStore.setItemAsync(`onboarding_${user.id}`, JSON.stringify(data));
  }

  async function logout() {
    setUser(null);
    await SecureStore.deleteItemAsync('currentUser');
  }

  async function resetPassword(email: string) {
    const matchedUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser) {
      return { success: false, message: 'No existe una cuenta con este email' };
    }
    // In a real app, send email. Here we reset to a default.
    const storedPasswords = await SecureStore.getItemAsync('passwords');
    const passwords: Record<string, string> = storedPasswords ? JSON.parse(storedPasswords) : {};
    passwords[matchedUser.id] = 'Reset1234!';
    await SecureStore.setItemAsync('passwords', JSON.stringify(passwords));
    return { success: true, message: 'Tu contraseña temporal es: Reset1234! Por favor cámbiala al iniciar sesión.' };
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, completeOnboarding, resetPassword, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
