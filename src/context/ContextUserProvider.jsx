import React, { useState, useEffect } from "react";
import UserContext from "./userContext";

const ContextUserProvider = ({ children, userName = "Newfeed" }) => {
  const [user, setUser] = useState({ name: userName });

  useEffect(() => {
    setUser((prevUser) => ({
      ...prevUser,
      name: userName,
    }));
  }, [userName]);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default ContextUserProvider;
