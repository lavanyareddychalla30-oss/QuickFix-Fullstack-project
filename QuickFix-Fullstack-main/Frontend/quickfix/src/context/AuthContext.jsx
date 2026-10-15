import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getUsers } from '../utils/userStore.js';
import { loadJSON, saveJSON } from '../utils/storage.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Demo session only: stores a user id, never passwords or tokens.
export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    const id = loadJSON('qf_session', null);
    return getUsers().some((u) => u.id === id) ? id : null;
  });
  const user = useMemo(() => getUsers().find((u) => u.id === userId) || null, [userId]);

  const login = useCallback((id) => { setUserId(id); saveJSON('qf_session', id); }, []);
  const logout = useCallback(() => { setUserId(null); localStorage.removeItem('qf_session'); }, []);
  const switchRole = useCallback((role) => {
    const next = getUsers().find((u) => u.role === role && u.active);
    if (next) login(next.id);
  }, [login]);

  return <AuthContext.Provider value={{ user, role: user?.role, login, logout, switchRole }}>{children}</AuthContext.Provider>;
}
