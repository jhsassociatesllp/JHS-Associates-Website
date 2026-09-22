// import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string
console.log("API Base URL", API_BASE_URL)

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
  /** True until we've resolved whether a stored token is still valid — while
   * true, ProtectedRoute should wait rather than bounce to /login, otherwise
   * every refresh (and the instant after a successful login) looks logged
   * out for the one render before the profile fetch resolves. */
  initializing: boolean;
  hasRole: (roles: string | string[]) => boolean;
  canAccess: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Reads the `exp` (seconds since epoch) claim out of a JWT without a
 * verification library — we only need it to schedule a client-side
 * auto-logout timer; the server independently rejects an expired token on
 * every request regardless of what the client does with this value. */
function readTokenExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json);
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin_token', token);
      // Re-enter the loading state on every new token (not just the first
      // mount) — otherwise a fresh login leaves `initializing` at whatever
      // it settled to before (false, from the "no token" branch below on
      // first render), and ProtectedRoute bounces straight back to /login
      // during the brief window before this profile fetch resolves.
      setInitializing(true);
      fetchUserProfile();
    } else {
      localStorage.removeItem('admin_token');
      setUser(null);
      setInitializing(false);
    }
  }, [token]);

  // Auto-logout when the session's own 2-hour expiry is reached, even if
  // the admin leaves the tab open and idle (a 401 on the next API call
  // would otherwise be the only thing that ever caught this).
  useEffect(() => {
    if (!token) return;
    const expiresAt = readTokenExpiry(token);
    if (!expiresAt) return;

    const msRemaining = expiresAt - Date.now();
    if (msRemaining <= 0) {
      logout();
      return;
    }
    const timer = window.setTimeout(logout, msRemaining);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchUserProfile = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/me`, {
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
    } finally {
      setInitializing(false);
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
      super_admin: ['dashboard', 'articles', 'blogs', 'knowledge', 'white_papers', 'regulatory', 'excellencia', 'newsletters', 'contacts', 'alumni', 'feedback', 'careers', 'appointments', 'users'],
      // HR Admin has access to HR features only (NO content management)
      hr_admin: ['dashboard', 'contacts', 'alumni', 'feedback', 'careers', 'appointments', 'users'],
      // Regular Admin only has content access (NO HR features)
      admin: ['dashboard', 'articles', 'blogs', 'knowledge', 'white_papers', 'regulatory', 'excellencia', 'newsletters']
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
      initializing,
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
