"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

type UserContextType = {
  userRole: string;
  firstName: string | null;
  setUserRole: (role: string) => void;
  setFirstName: (name: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<string>("guest");
  const [firstName, setFirstName] = useState<string | null>(null);

  // Initialize state from cookies
  useEffect(() => {
    const storedUserRole = Cookies.get("userRole") || "guest";
    const storedFirstName = Cookies.get("firstName") || null;

    setUserRole(storedUserRole);
    setFirstName(storedFirstName);
  }, []);

  // Update cookies whenever state changes
  useEffect(() => {
    Cookies.set("userRole", userRole);
    Cookies.set("firstName", firstName || "");
  }, [userRole, firstName]);

  return (
    <UserContext.Provider value={{ userRole, firstName, setUserRole, setFirstName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};