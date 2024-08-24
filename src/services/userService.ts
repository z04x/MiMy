import api from "./api";

import User from "../interfaces/User";

export const getUser = async (user_id: number = 123) => {
  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      return parsedUser;
    } else {
      const res = await api.get<User>(`/users/${user_id}`); // Пока что беру юзера 123
      const newUser = res.data;
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
