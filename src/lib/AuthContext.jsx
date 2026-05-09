import { createContext, useContext } from "react";

const AuthContext = createContext({
  isAuthenticated: true,
  isLoadingAuth: false,
  isLoadingPublicSettings: false,
  authChecked: true,
  authError: null,
  navigateToLogin: () => {},
  checkUserAuth: () => {}
});

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: true,
        isLoadingAuth: false,
        isLoadingPublicSettings: false,
        authChecked: true,
        authError: null,
        navigateToLogin: () => {},
        checkUserAuth: () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
