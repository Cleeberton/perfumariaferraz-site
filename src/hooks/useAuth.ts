import { useApp } from '../context/AppContext';

export function useAuth() {
  const { auth, login, register, logout } = useApp();
  return { auth, login, register, logout };
}
