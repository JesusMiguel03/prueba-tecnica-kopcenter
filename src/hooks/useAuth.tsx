import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  errors: ErrorType;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearErrors: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

type ErrorType = {
  username: string | null;
  password: string | null;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [errors, setErrors] = useState<ErrorType>({
    username: null,
    password: null,
  });

  useEffect(() => {
    const findUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    findUser();
  }, []);

  useEffect(() => {
    const persistUser = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error saving user to storage:', error);
      }
    };

    persistUser();
  }, [user]);

  async function login(username: string, password: string) {
    setIsLoading(true);

    setErrors({ username: null, password: null });

    const newErrors: ErrorType = { username: null, password: null };
    let hasError = false;

    if (!username) {
      newErrors.username = 'Debe ingresar el usuario';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Debe ingresar la contraseña';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setIsLoading(false);
      return Promise.reject(new Error('Ocurrió un error al iniciar sesión'));
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const credentials = { username: 'admin', password: '1234' };

    if (username === credentials.username && password === credentials.password) {
      const userData = { name: 'Admin', email: 'admin@email.com' };
      setUser(userData);
      setIsLoading(false);
      return Promise.resolve();
    } else {
      if (username !== credentials.username) {
        setErrors({ ...newErrors, username: 'El usuario es incorrecto' });
      }

      if (password !== credentials.password) {
        setErrors({ ...newErrors, password: 'La contraseña es incorrecta' });
      }

      setIsLoading(false);
      return Promise.reject(new Error('Credenciales incorrectas'));
    }
  }

  async function logout() {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    setUser(null);
    setErrors({ username: null, password: null });
    setIsLoading(false);
  }

  function clearErrors() {
    setErrors({ username: null, password: null });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isInitialLoading,
        login,
        logout,
        errors,
        clearErrors,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
