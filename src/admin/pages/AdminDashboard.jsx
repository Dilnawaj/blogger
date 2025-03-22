import React, { useEffect, useState } from 'react'
import { Button } from 'reactstrap'
import {
  doLogout,
  getToken,
  isTokenExpired,
  getCurrentUserDetail,
  isLoggedIn,
} from "../../auth/Index";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
function AdminDashboard() {
  const navigate = useNavigate();
  
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(undefined);
  const logout = (sessionExpire) => {
    console.log("Seeesiosn", sessionExpire);

    setTimeout(() => {
      if (sessionExpire == true) {
        toast.error(
          "Session expired, Please do login again to continue using BloggerHub.",
          {
            style: {
              width: "580px",
            },
            autoClose: 12000, // Display the toast for 8 seconds
          }
        );
      }
      doLogout(() => {
        console.log("LOGOUT Boom");
        setLogin(false);
        navigate("/login/admin");
      });
    }); // Adjust delay time as needed (in milliseconds)
  };
  
  useEffect(() => {
    if (typeof getCurrentUserDetail() !== "undefined") {
      setLogin(isLoggedIn());
      setUser(getCurrentUserDetail());
    }
  }, [login]);
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Welcome to the admin dashboard</h2>
    <Button onClick={logout}> LOGOUT</Button>
    </div>
  )
}

export default AdminDashboard