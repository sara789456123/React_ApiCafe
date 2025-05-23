import React, { useState, createContext } from 'react'

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!document.cookie.includes("isLoggedIn=true"));

  return (
    <UserContext.Provider value={{ isAdmin, setIsAdmin, isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};