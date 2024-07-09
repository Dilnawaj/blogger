import React, { useState, useEffect } from "react";
import userContext from "./userContext";

const ContextUserProvider = ({ children, userName = "Newfeed" }) => {
  const [user, setUser] = useState({ name: userName });

  useEffect(() => {
    setUser((prevUser) => ({
      ...prevUser,
      name: userName,
    }));
  }, [userName]);

  console.log("UserName", userName);

  return <userContext.Provider value={user}>{children}</userContext.Provider>;
};

export default ContextUserProvider;
