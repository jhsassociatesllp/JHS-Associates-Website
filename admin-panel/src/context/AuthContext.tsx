import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'super_admin' | 'hr_admin';
  name: string;
  last_login?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
  canAccess: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin_token', token);
      fetchUserProfile();
    } else {
      localStorage.removeItem('admin_token');
      setUser(null);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:8000/admin/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid, logout
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  };

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const canAccess = (feature: string): boolean => {
    if (!user) return false;
    
    const permissions = {
      // Super Admin has access to everything
      super_admin: ['dashboard', 'articles', 'blogs', 'knowledge', 'contacts', 'alumni', 'users'],
      // HR Admin has access to HR features only (NO content management)
      hr_admin: ['dashboard', 'contacts', 'alumni'],
      // Regular Admin only has content access (NO HR features)
      admin: ['dashboard', 'articles', 'blogs', 'knowledge']
    };
    
    return permissions[user.role]?.includes(feature) || false;
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      login, 
      logout, 
      isAuthenticated: !!token && !!user,
      hasRole,
      canAccess
    }}>
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
