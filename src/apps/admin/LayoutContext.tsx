import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
} from "react";

// All valid sidebar / layout sections that can be toggled
export type MenuKey = "site" | "element" | "ticket" | "task" | "hr" | "org";

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
};

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextProps => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
};
