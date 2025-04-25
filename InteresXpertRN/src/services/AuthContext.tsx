import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definición del tipo de usuario
export interface User {
  username: string;
  password: string;
  fingerprint?: string; // La huella digital como cadena (para la simulación)
  name?: string;
  useBiometrics?: boolean; // Indica si el usuario ha habilitado la autenticación biométrica
}

// Interface para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  users: User[]; // Lista de usuarios registrados
  login: (username: string, password: string, fingerprint?: string) => Promise<boolean>;
  loginWithBiometrics: (username: string) => Promise<boolean>;
  register: (newUser: User) => boolean;
  logout: () => void;
  isBiometricAvailable: boolean;
  checkBiometricAvailability: () => Promise<boolean>;
  enableBiometrics: (username: string) => Promise<boolean>;
}

// Clave para el almacenamiento local
const USERS_STORAGE_KEY = '@interesxpert_users';

// Creación del contexto con un valor inicial
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    { username: 'demo', password: '123456', name: 'Usuario Demo', useBiometrics: false }
  ]);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState<boolean>(false);

  // Cargar usuarios guardados al iniciar
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };

    loadUsers();
    checkBiometricAvailability();
  }, []);

  // Guardar usuarios cuando cambien
  useEffect(() => {
    const saveUsers = async () => {
      try {
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } catch (error) {
        console.error('Error al guardar usuarios:', error);
      }
    };

    saveUsers();
  }, [users]);

  // Verificar si la autenticación biométrica está disponible
  const checkBiometricAvailability = async (): Promise<boolean> => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const available = compatible && enrolled;
      setIsBiometricAvailable(available);
      return available;
    } catch (error) {
      console.error('Error al verificar biometría:', error);
      return false;
    }
  };

  // Función para iniciar sesión
  const login = async (username: string, password: string, fingerprint?: string): Promise<boolean> => {
    const foundUser = users.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      // Si se proporciona huella digital (simulada), verificarla si ya existe
      if (fingerprint && foundUser.fingerprint && foundUser.fingerprint !== fingerprint) {
        return false;
      }
      
      // Actualizar la huella si se proporciona una nueva
      if (fingerprint && !foundUser.fingerprint) {
        const updatedUsers = users.map(u => 
          u.username === username ? { ...u, fingerprint } : u
        );
        setUsers(updatedUsers);
      }
      
      setUser(foundUser);
      return true;
    }
    
    return false;
  };

  // Función para iniciar sesión con biometría
  const loginWithBiometrics = async (username: string): Promise<boolean> => {
    try {
      const foundUser = users.find(u => u.username === username && u.useBiometrics);
      
      if (!foundUser) {
        return false;
      }
      
      // La autenticación biométrica ya se hizo en la pantalla de login antes de llamar a esta función
      setUser(foundUser);
      return true;
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      return false;
    }
  };

  // Función para habilitar la autenticación biométrica para un usuario
  const enableBiometrics = async (username: string): Promise<boolean> => {
    try {
      // Verificar si la biometría está disponible
      const available = await checkBiometricAvailability();
      if (!available) {
        return false;
      }
      
      // Autenticar al usuario con biometría antes de habilitar
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verifica tu identidad para habilitar la autenticación biométrica',
        fallbackLabel: 'Usar contraseña',
        disableDeviceFallback: false,
      });
      
      if (biometricAuth.success) {
        // Actualizar el estado de biometría del usuario
        const updatedUsers = users.map(u => 
          u.username === username ? { ...u, useBiometrics: true } : u
        );
        setUsers(updatedUsers);
        
        // Si el usuario actual es el que se está actualizando, actualizar también el estado del usuario
        if (user && user.username === username) {
          setUser({ ...user, useBiometrics: true });
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error al habilitar biometría:', error);
    }
    
    return false;
  };

  // Función para registrar un nuevo usuario
  const register = (newUser: User): boolean => {
    // Verificar si el usuario ya existe
    if (users.some(u => u.username === newUser.username)) {
      return false;
    }
    
    setUsers([...users, { ...newUser, useBiometrics: newUser.useBiometrics || false }]);
    return true;
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      users,
      login, 
      loginWithBiometrics,
      register, 
      logout,
      isBiometricAvailable,
      checkBiometricAvailability,
      enableBiometrics
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 