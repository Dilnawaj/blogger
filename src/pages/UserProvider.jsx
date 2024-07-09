import React, { useState } from "react";
import UserContext from "./userContext";

function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Dilnawaj'
  });

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
