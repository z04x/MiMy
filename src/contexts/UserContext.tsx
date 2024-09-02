import React, { createContext, useState, useContext, useEffect } from 'react';
import { initUser } from '../services/userService';
import User from '../interfaces/User';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await initUser();
        setUser(fetchedUser);
        setError(null); // сброс ошибки при успешном получении данных
      } catch (err) {
        setError("Error fetching user data");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false); // установка состояния загрузки в false в любом случае
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
