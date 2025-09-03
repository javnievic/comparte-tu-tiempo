import { useState } from "react";
import { UIContext } from "./UIContext";

export function UIProvider({ children }) {
  const [openLogin, setOpenLogin] = useState(false);

  const openLoginModal = () => setOpenLogin(true);
  const closeLoginModal = () => setOpenLogin(false);

  return (
    <UIContext.Provider value={{ openLogin, openLoginModal, closeLoginModal }}>
      {children}
    </UIContext.Provider>
  );
}
