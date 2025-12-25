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
  const [member, setMember] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('member_token'));
  const [isLoading, setIsLoading] = useState(true);

  const refreshMember = async () => {
    const storedToken = localStorage.getItem('member_token');
    if (storedToken) {
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
        } else {
          localStorage.removeItem('member_token');
          setToken(null);
          setMember(null);
        }
      } catch (error) {
        console.error('Member check error:', error);
        localStorage.removeItem('member_token');
        setToken(null);
        setMember(null);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await refreshMember();
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
    setToken(data.token);
    localStorage.setItem('member_token', data.token);
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
    setToken(data.token);
    localStorage.setItem('member_token', data.token);
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
    setToken(null);
    localStorage.removeItem('member_token');
  };

  const hasTier = (...tiers: string[]) => {
    if (!member) return false;
    return tiers.includes(member.membershipTier);
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
        refreshMember
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};
