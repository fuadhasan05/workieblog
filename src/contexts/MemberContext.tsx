import React, { createContext, useContext, useState, useEffect } from 'react';

interface Member {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  membershipTier: 'FREE' | 'PREMIUM' | 'VIP';
  membershipStatus?: string;
  emailVerified: boolean;
  createdAt?: string;
}

interface MemberContextType {
  member: Member | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasTier: (...tiers: string[]) => boolean;
  refreshMember: () => Promise<void>;
  setMemberSession: (member: Member, token?: string | null) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const useMember = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
};

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const MEMBER_TOKEN_KEY = 'member_token';
  const MEMBER_PROFILE_KEY = 'member_profile';

  const getStoredMember = (): Member | null => {
    const stored = localStorage.getItem(MEMBER_PROFILE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as Member;
    } catch (error) {
      console.error('Failed to parse stored member profile:', error);
      localStorage.removeItem(MEMBER_PROFILE_KEY);
      return null;
    }
  };

  const [member, setMember] = useState<Member | null>(getStoredMember);
  const [token, setToken] = useState<string | null>(localStorage.getItem(MEMBER_TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  const refreshMember = async () => {
    const storedToken = localStorage.getItem(MEMBER_TOKEN_KEY);
    const storedProfile = localStorage.getItem(MEMBER_PROFILE_KEY);

    // If we have a stored profile, use it immediately (for Firebase auth)
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as Member;
        setMember(parsed);
        console.log('[MemberContext] Restored member from localStorage:', parsed.email);
      } catch (error) {
        console.error('Failed to restore member profile:', error);
        localStorage.removeItem(MEMBER_PROFILE_KEY);
        setMember(null);
      }
    }

    // If no token, we're done (Firebase-only auth)
    if (!storedToken) {
      setToken(null);
      return;
    }

    // Try to verify with backend (optional - for token-based auth)
    try {
      const response = await fetch('http://localhost:3001/api/members/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
        setToken(storedToken);
        localStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(data.member));
      } else {
        // Token invalid but keep localStorage profile if exists
        localStorage.removeItem(MEMBER_TOKEN_KEY);
        setToken(null);
      }
    } catch (error) {
      console.warn('[MemberContext] Backend check failed (non-critical):', error);
      // Keep existing member from localStorage, just clear invalid token
      localStorage.removeItem(MEMBER_TOKEN_KEY);
      setToken(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      console.log('[MemberContext] Starting auth check...');
      await refreshMember();
      console.log('[MemberContext] Auth check complete, isAuthenticated:', !!member);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (email: string, name: string, password: string) => {
    const response = await fetch('http://localhost:3001/api/members/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, name, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    setMember(data.member);
    localStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(data.member));
    setToken(data.token);
    localStorage.setItem(MEMBER_TOKEN_KEY, data.token);
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3001/api/members/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setMember(data.member);
    localStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(data.member));
    setToken(data.token);
    localStorage.setItem(MEMBER_TOKEN_KEY, data.token);
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3001/api/members/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    setMember(null);
    localStorage.removeItem(MEMBER_PROFILE_KEY);
    setToken(null);
    localStorage.removeItem(MEMBER_TOKEN_KEY);
  };

  const hasTier = (...tiers: string[]) => {
    if (!member) return false;
    return tiers.includes(member.membershipTier);
  };

  const setMemberSession = (nextMember: Member, sessionToken?: string | null) => {
    setMember(nextMember);
    localStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(nextMember));

    if (sessionToken !== undefined) {
      if (sessionToken) {
        setToken(sessionToken);
        localStorage.setItem(MEMBER_TOKEN_KEY, sessionToken);
      } else {
        setToken(null);
        localStorage.removeItem(MEMBER_TOKEN_KEY);
      }
    }
  };

  return (
    <MemberContext.Provider
      value={{
        member,
        token,
        isLoading,
        register,
        login,
        logout,
        isAuthenticated: !!member,
        hasTier,
        refreshMember,
        setMemberSession
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};
