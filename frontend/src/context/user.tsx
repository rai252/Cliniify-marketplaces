"use client";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { createContext, useContext, ReactNode } from "react";
import { IUser } from "@/types/user/user";

type UserStore = {
  user: IUser | null;
  setUser: (user: IUser) => void;
  logout: () => void;
};

const UserContext = createContext<UserStore>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export default function UserStore({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getcurrentUser();
        setUser(userData);
      } catch (error) {}
    };

    fetchUserData();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
