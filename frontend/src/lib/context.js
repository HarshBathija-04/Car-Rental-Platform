import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);
export const ToastContext = createContext(() => {});

/** { user, ready, signIn, signOut } */
export const useAuth = () => useContext(AuthContext);
/** toast(message, tone?: 'success' | 'error' | 'info') */
export const useToast = () => useContext(ToastContext);
