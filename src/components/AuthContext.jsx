// AuthContext.jsx (Sample implementation)
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Your auth logic here
  const [isAdmin, setIsAdmin] = useState(false); // Your admin check logic here

  const value = {
    currentUser,
    isAdmin,
    // Add login/logout functions as needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);