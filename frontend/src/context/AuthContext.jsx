import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Roles: 'guest', 'patient', 'doctor'
  // Start as guest (not logged in)
  const [user, setUser] = useState({ role: 'guest', name: null, id: null });

  const login = (role, name, id) => {
    setUser({ role, name, id });
  };

  const logout = () => {
    setUser({ role: 'guest', name: null, id: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
