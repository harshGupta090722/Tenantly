import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  role: 'landlord' | 'tenant' | null;
  userId: string | null;
  login: (token: string, role: 'landlord' | 'tenant', userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'landlord' | 'tenant' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on initial load
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role') as 'landlord' | 'tenant' | null;
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
      setUserId(storedUserId);
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newRole: 'landlord' | 'tenant', newUserId: string) => {
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('userId', newUserId);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        userId,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};