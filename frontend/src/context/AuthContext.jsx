import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'karmayogi_auth_session';

// Standard demo employee seed profile matched with backend MongoDB record
const DEMO_EMPLOYEE = {
  _id: '6a93d343d6ff1fa539394c77', // Active seeded user ID in MongoDB
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  role: 'employee',
  department: {
    _id: '6a93cd3ad282f2b383042cbd',
    name: 'Ministry of Statistics and Programme Implementation',
    shortName: 'MoSPI',
  },
  position: {
    _id: '6a93cd3ad282f2b383042cbf',
    title: 'Statistical Officer',
  },
  roleInfo: {
    _id: '6a93cd3ad282f2b383042cda',
    name: 'Statistical Analysis and Reporting',
  },
};

// Standard demo administrator profile for workforce capacity building
const DEMO_ADMIN = {
  _id: '65e000000000000000000001',
  name: 'Dr. Arvind Mehta',
  email: 'admin@karmayogi.gov.in',
  role: 'system_admin',
  department: {
    name: 'Ministry of Statistics and Programme Implementation',
    shortName: 'MoSPI',
  },
  designation: 'Principal Director (Capacity Building)',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'employee' | 'admin' | null
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user && parsed?.userType) {
          if (parsed.userType === 'admin') {
            setUser({ ...DEMO_ADMIN, ...parsed.user });
            setUserType('admin');
          } else {
            // Employee session: sync active seeded _id
            const syncedUser = {
              ...DEMO_EMPLOYEE,
              ...parsed.user,
              _id: DEMO_EMPLOYEE._id,
            };
            setUser(syncedUser);
            setUserType('employee');
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ user: syncedUser, userType: 'employee' })
            );
          }
        }
      }
    } catch (e) {
      console.warn('Failed to restore session:', e);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Prototype Employee Login
   */
  const loginEmployee = async ({ email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (cleanEmail === 'rahul@example.com') {
      if (cleanPassword !== 'password123') {
        throw new Error('Invalid password. Please check your credentials.');
      }

      const sessionData = {
        user: { ...DEMO_EMPLOYEE, email: cleanEmail },
        userType: 'employee',
      };

      setUser(sessionData.user);
      setUserType('employee');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      return sessionData;
    }

    if (cleanEmail.includes('@') && cleanPassword.length >= 6) {
      const customEmployee = {
        _id: DEMO_EMPLOYEE._id,
        name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        email: cleanEmail,
        role: 'employee',
        department: DEMO_EMPLOYEE.department,
        position: DEMO_EMPLOYEE.position,
        roleInfo: DEMO_EMPLOYEE.roleInfo,
      };

      const sessionData = {
        user: customEmployee,
        userType: 'employee',
      };

      setUser(customEmployee);
      setUserType('employee');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      return sessionData;
    }

    throw new Error('Employee account not found. Use demo credentials (rahul@example.com / password123).');
  };

  /**
   * Prototype Admin Login
   */
  const loginAdmin = async ({ email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (cleanEmail === 'admin@karmayogi.gov.in') {
      if (cleanPassword !== 'admin123') {
        throw new Error('Invalid administrator password. Use admin123.');
      }

      const sessionData = {
        user: { ...DEMO_ADMIN, email: cleanEmail },
        userType: 'admin',
      };

      setUser(sessionData.user);
      setUserType('admin');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      return sessionData;
    }

    if (cleanEmail.includes('admin') && cleanPassword.length >= 6) {
      const customAdmin = {
        _id: DEMO_ADMIN._id,
        name: 'Administrator (' + cleanEmail.split('@')[0].toUpperCase() + ')',
        email: cleanEmail,
        role: 'system_admin',
        department: DEMO_ADMIN.department,
        designation: 'MDO / Ministry Capacity Administrator',
      };

      const sessionData = {
        user: customAdmin,
        userType: 'admin',
      };

      setUser(customAdmin);
      setUserType('admin');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      return sessionData;
    }

    throw new Error('Administrator not found. Use demo credentials (admin@karmayogi.gov.in / admin123).');
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user,
    userType,
    isAuthenticated: !!user,
    loading,
    loginEmployee,
    loginAdmin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
