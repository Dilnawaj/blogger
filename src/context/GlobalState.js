import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [globalVariable, setGlobalVariable] = useState("initial value");

  const updateGlobalVariable = (newValue) => {
    setGlobalVariable(newValue);
  };

  return (
    <GlobalContext.Provider value={{ globalVariable, updateGlobalVariable }}>
      {children}
    </GlobalContext.Provider>
  );
};
