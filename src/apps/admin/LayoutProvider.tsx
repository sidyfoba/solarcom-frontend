// LayoutContext.tsx
import React, { createContext, useState, ReactNode, useContext } from "react";

interface LayoutContextProps {
  openSite: boolean;
  setOpenSite: React.Dispatch<React.SetStateAction<boolean>>;
  openElement: boolean;
  setOpenElement: React.Dispatch<React.SetStateAction<boolean>>;
  openTicket: boolean;
  setOpenTicket: React.Dispatch<React.SetStateAction<boolean>>;
  openTask: boolean;
  setOpenTask: React.Dispatch<React.SetStateAction<boolean>>;
  openHr: boolean;
  setOpenHr: React.Dispatch<React.SetStateAction<boolean>>;
  openOrg: boolean;
  setOpenOrg: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [openSite, setOpenSite] = useState(false);
  const [openElement, setOpenElement] = useState(false);
  const [openTicket, setOpenTicket] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [openHr, setOpenHr] = useState(false);
  const [openOrg, setOpenOrg] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        openSite,
        setOpenSite,
        openElement,
        setOpenElement,
        openTicket,
        setOpenTicket,
        openTask,
        setOpenTask,
        openHr,
        setOpenHr,
        openOrg,
        setOpenOrg,
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
