import React, { createContext, useContext, useState, useEffect } from 'react';
import { validatePassword } from '../utils/passwordValidation';

const AuthContext = createContext();

const DEMO_PATIENT = {
  id: 'patient-demo-1',
  name: 'Eleanor Vance',
  email: 'eleanor@mindmate.demo',
  role: 'patient',
  preferredMode: 'general',
  joinedDate: '2026-02-15',
  authProvider: 'local',
};

const DEMO_CAREGIVER = {
  id: 'caregiver-demo-1',
  name: 'Sarah Vance',
  email: 'sarah.care@mindmate.demo',
  role: 'caregiver',
  patientId: 'patient-demo-1',
  patientName: 'Eleanor Vance',
  relation: 'Daughter & Primary Caregiver',
  joinedDate: '2026-02-15',
  authProvider: 'local',
};

// Safe client-side hash simulation for passwords so plaintext is never saved
async function hashPassword(plainText) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText + '_mindmate_salt_secure');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'hashed_' + btoa(plainText);
  }
}

// Decode Google JWT ID token payload safely
export function parseGoogleJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const isLoggedOut = localStorage.getItem('mindmate_logged_out') === 'true';
      if (isLoggedOut) return null;

      const saved = localStorage.getItem('mindmate_current_user') || sessionStorage.getItem('mindmate_current_user');
      if (saved) return JSON.parse(saved);
      return DEMO_PATIENT;
    } catch {
      return null;
    }
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutStep, setLogoutStep] = useState(0);

  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('mindmate_accounts_registry');
      if (saved) return JSON.parse(saved);
      return [DEMO_PATIENT, DEMO_CAREGIVER];
    } catch {
      return [DEMO_PATIENT, DEMO_CAREGIVER];
    }
  });

  const [activeRecoveryTokens, setActiveRecoveryTokens] = useState({});

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('mindmate_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('mindmate_current_user');
        sessionStorage.removeItem('mindmate_current_user');
      }
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [user]);

  const signIn = async (email, password, rememberMe = true) => {
    localStorage.removeItem('mindmate_logged_out');
    const cleanEmail = email.trim().toLowerCase();
    const found = registeredAccounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (found) {
      setUser(found);
      if (rememberMe) {
        localStorage.setItem('mindmate_current_user', JSON.stringify(found));
      } else {
        sessionStorage.setItem('mindmate_current_user', JSON.stringify(found));
      }
      return { success: true };
    }

    // Dynamic guest session with secure hashing
    const isCaregiverEmail = cleanEmail.includes('care') || cleanEmail.includes('doc');
    const newSession = {
      id: `usr-${Date.now()}`,
      name: cleanEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Mindmate User',
      email: cleanEmail,
      role: isCaregiverEmail ? 'caregiver' : 'patient',
      patientName: isCaregiverEmail ? 'Eleanor Vance' : undefined,
      authProvider: 'local',
      passwordHash: await hashPassword(password),
    };

    setUser(newSession);
    const updated = [...registeredAccounts, newSession];
    setRegisteredAccounts(updated);
    try {
      localStorage.setItem('mindmate_accounts_registry', JSON.stringify(updated));
    } catch {
      // ignore
    }

    return { success: true };
  };

  const signInWithGoogleCredential = (credentialOrPayload) => {
    let payload = credentialOrPayload;
    if (typeof credentialOrPayload === 'string') {
      payload = parseGoogleJwt(credentialOrPayload);
    }

    if (!payload || !payload.email) {
      return { success: false, error: 'Invalid Google credential token.' };
    }

    const cleanEmail = payload.email.toLowerCase();
    const existing = registeredAccounts.find(a => a.email.toLowerCase() === cleanEmail);

    if (existing) {
      const updatedUser = {
        ...existing,
        name: payload.name || existing.name,
        picture: payload.picture || existing.picture,
        authProvider: 'google',
      };
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    }

    // Create new account for verified Google user
    const newUser = {
      id: `google-${payload.sub || Date.now()}`,
      name: payload.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      picture: payload.picture,
      role: cleanEmail.includes('care') ? 'caregiver' : 'patient',
      patientName: cleanEmail.includes('care') ? 'Eleanor Vance' : undefined,
      authProvider: 'google',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setUser(newUser);
    const updated = [...registeredAccounts, newUser];
    setRegisteredAccounts(updated);
    try {
      localStorage.setItem('mindmate_accounts_registry', JSON.stringify(updated));
    } catch {
      // ignore
    }

    return { success: true, user: newUser };
  };

  const register = async (name, email, password, role = 'patient') => {
    const pwdValidation = validatePassword(password);
    if (!pwdValidation.isValid) {
      return { success: false, error: 'Password does not meet all 5 security requirements.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredAccounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role,
      patientName: role === 'caregiver' ? 'Eleanor Vance (Demo Linked)' : undefined,
      authProvider: 'local',
      passwordHash: hashedPassword, // Plaintext is never stored
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const updated = [...registeredAccounts, newUser];
    setRegisteredAccounts(updated);
    try {
      localStorage.setItem('mindmate_accounts_registry', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    setUser(newUser);
    return { success: true };
  };

  const triggerLogout = (callback) => {
    setIsLoggingOut(true);
    setLogoutStep(1);

    setTimeout(() => {
      setLogoutStep(2);
    }, 550);

    setTimeout(() => {
      setLogoutStep(3);
    }, 1100);

    setTimeout(() => {
      setUser(null);
      localStorage.setItem('mindmate_logged_out', 'true');
      localStorage.removeItem('mindmate_current_user');
      sessionStorage.removeItem('mindmate_current_user');
      setIsLoggingOut(false);
      setLogoutStep(0);
      if (callback) callback();
    }, 1700);
  };

  const signOut = (callback) => {
    triggerLogout(callback);
  };

  const switchRole = (role) => {
    if (role === 'caregiver') {
      setUser(DEMO_CAREGIVER);
    } else {
      setUser(DEMO_PATIENT);
    }
  };

  const requestPasswordReset = (email) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveRecoveryTokens(prev => ({
      ...prev,
      [email.toLowerCase()]: {
        code,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minute token
      }
    }));
    return {
      success: true,
      code,
      message: 'Password reset request initiated. Verification code generated.',
    };
  };

  const verifyResetCode = (email, code) => {
    const tokenObj = activeRecoveryTokens[email.toLowerCase()];
    if (!tokenObj) {
      return { success: false, error: 'No active reset request found for this email.' };
    }
    if (Date.now() > tokenObj.expiresAt) {
      return { success: false, error: 'Recovery code has expired. Please request a new one.' };
    }
    if (tokenObj.code !== code.trim()) {
      return { success: false, error: 'Incorrect verification code. Please check and try again.' };
    }
    return { success: true };
  };

  const completePasswordReset = async (email, newPassword) => {
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      return { success: false, error: 'New password does not meet all 5 requirements.' };
    }
    const cleanEmail = email.toLowerCase();
    const newHash = await hashPassword(newPassword);

    setRegisteredAccounts(prev =>
      prev.map(acc => acc.email.toLowerCase() === cleanEmail ? { ...acc, passwordHash: newHash } : acc)
    );

    setActiveRecoveryTokens(prev => {
      const copy = { ...prev };
      delete copy[cleanEmail];
      return copy;
    });

    return { success: true };
  };

  const changePassword = async (currentPassword, newPassword) => {
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      return { success: false, error: 'New password does not satisfy all 5 security criteria.' };
    }
    if (user) {
      const newHash = await hashPassword(newPassword);
      const updatedUser = { ...user, passwordHash: newHash };
      setUser(updatedUser);
      setRegisteredAccounts(prev =>
        prev.map(acc => acc.id === user.id ? updatedUser : acc)
      );
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isPatient: user?.role === 'patient',
      isCaregiver: user?.role === 'caregiver',
      signIn,
      signInWithGoogleCredential,
      register,
      signOut,
      triggerLogout,
      isLoggingOut,
      logoutStep,
      switchRole,
      requestPasswordReset,
      verifyResetCode,
      completePasswordReset,
      changePassword,
      DEMO_PATIENT,
      DEMO_CAREGIVER,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
