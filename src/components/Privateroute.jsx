import React from "react";
import { Outlet } from "react-router";
import { Link, Navigate } from "react-router-dom";
import { isLoggedIn } from "../auth/Index";
const Privateroute = () => {

    
  if (isLoggedIn()) {
    return <Outlet />;
  } else {
    return <Navigate to={"/login"} />;
  }
};

export default Privateroute;
