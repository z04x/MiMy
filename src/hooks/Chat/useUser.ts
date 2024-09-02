import { useState, useEffect } from 'react';
import { fetchUserData } from './apiHooks';
import User from '../../interfaces/User';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await fetchUserData();
        console.log(fetchedUser);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return user;
};
