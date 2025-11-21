// src/context/AppContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthApi, LoginRequest, LoginResponse } from "../api/authApi.ts";

/* -------------------------------------------------------------------------- */
/*                                   AUTH                                     */
/* -------------------------------------------------------------------------- */

// What we store in memory
export interface AuthState {
  token: string | null;
  username: string | null;
  permissions: string[];
}

interface AuthContextValue {
  auth: AuthState;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "slcm_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    username: null,
    permissions: [],
  });

  // Load from localStorage on first render
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        const saved: AuthState = JSON.parse(raw);
        setAuth(saved);
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  // Persist into localStorage when auth changes
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [auth]);

  async function login(credentials: LoginRequest) {
    const response: LoginResponse = await AuthApi.login(credentials);
    const newState: AuthState = {
      token: response.token,
      username: response.username,
      permissions: response.permissions ?? [],
    };
    setAuth(newState);
  }

  function logout() {
    setAuth({ token: null, username: null, permissions: [] });
  }

  function hasPermission(perm: string) {
    return auth.permissions.includes(perm);
  }

  const value: AuthContextValue = {
    auth,
    isAuthenticated: !!auth.token,
    login,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*                                  LAYOUT                                    */
/* -------------------------------------------------------------------------- */

// All valid sidebar / layout sections that can be toggled
export type MenuKey =
  | "site"
  | "element"
  | "ticket"
  | "task"
  | "hr"
  | "org"
  | "iam";

// Shape of menu open/closed state
export type MenuState = Record<MenuKey, boolean>;

interface LayoutContextProps {
  // Full state
  menuState: MenuState;

  // Generic helpers
  toggleMenu: (key: MenuKey) => void;
  openMenu: (key: MenuKey) => void;
  closeMenu: (key: MenuKey) => void;
  closeAllMenus: () => void;

  // Optional: open one menu and close the others
  openMenuExclusive: (key: MenuKey) => void;

  // Convenience getters
  isSiteOpen: boolean;
  isElementOpen: boolean;
  isTicketOpen: boolean;
  isTaskOpen: boolean;
  isHrOpen: boolean;
  isOrgOpen: boolean;
  isIamOpen: boolean;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

// Initial state: all menus closed
const initialMenuState: MenuState = {
  site: false,
  element: false,
  ticket: false,
  task: false,
  hr: false,
  org: false,
  iam: false,
};

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [menuState, setMenuState] = useState<MenuState>(initialMenuState);

  const toggleMenu = useCallback((key: MenuKey) => {
    setMenuState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const openMenu = useCallback((key: MenuKey) => {
    setMenuState((prev) => ({
      ...prev,
      [key]: true,
    }));
  }, []);

  const closeMenu = useCallback((key: MenuKey) => {
    setMenuState((prev) => ({
      ...prev,
      [key]: false,
    }));
  }, []);

  const closeAllMenus = useCallback(() => {
    setMenuState(initialMenuState);
  }, []);

  const openMenuExclusive = useCallback((key: MenuKey) => {
    setMenuState(
      Object.keys(initialMenuState).reduce((acc, k) => {
        acc[k as MenuKey] = k === key;
        return acc;
      }, {} as MenuState)
    );
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        menuState,
        toggleMenu,
        openMenu,
        closeMenu,
        closeAllMenus,
        openMenuExclusive,
        // convenience flags
        isSiteOpen: menuState.site,
        isElementOpen: menuState.element,
        isTicketOpen: menuState.ticket,
        isTaskOpen: menuState.task,
        isHrOpen: menuState.hr,
        isOrgOpen: menuState.org,
        isIamOpen: menuState.iam,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext(): LayoutContextProps {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/*                             COMBINED APP PROVIDER                          */
/* -------------------------------------------------------------------------- */

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </AuthProvider>
  );
}
