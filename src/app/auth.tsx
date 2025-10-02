import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Role = 'candidate' | 'hr';

type AuthState = {
  role: Role | null;
  candidateId: string | null;
  login: (role: Role, options?: { candidateId?: string }) => void;
  logout: () => void;
  setCandidateId: (id: string) => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = 'talentflow.role';
const CANDIDATE_ID_KEY = 'talentflow.candidateId';

export function AuthProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<Role | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Role | null;
    if (saved === 'candidate' || saved === 'hr') setRole(saved);
    const cid = localStorage.getItem(CANDIDATE_ID_KEY);
    if (cid) setCandidateId(cid);
  }, []);

  const login = useCallback((newRole: Role, options?: { candidateId?: string }) => {
    setRole(newRole);
    localStorage.setItem(STORAGE_KEY, newRole);
    if (newRole === 'candidate') {
      const id = options?.candidateId || `candidate-${Math.random().toString(36).slice(2, 8)}`;
      setCandidateId(id);
      localStorage.setItem(CANDIDATE_ID_KEY, id);
    }
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    localStorage.removeItem(STORAGE_KEY);
    setCandidateId(null);
    localStorage.removeItem(CANDIDATE_ID_KEY);
  }, []);

  const value = useMemo(() => ({ role, candidateId, login, logout, setCandidateId: (id: string) => { setCandidateId(id); localStorage.setItem(CANDIDATE_ID_KEY, id); } }), [role, candidateId, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useHasRole(roles: Role[] | Role): boolean {
  const { role } = useAuth();
  const list = Array.isArray(roles) ? roles : [roles];
  return role != null && list.includes(role);
}


