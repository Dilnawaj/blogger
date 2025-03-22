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
import Base from '../../components/Base';
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
    
    <Base>
    <div
       style={{
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
         backgroundImage:
           'url("http://localhost:5000/post/image/background.png")',
         backgroundSize: "104% auto", // Increase the left side length
         backgroundPosition: "left center", // Align the image to the left side
         backgroundRepeat: "no-repeat",
         height: "100vh",
       }}
     >
 <div>
      <h1>Admin Dashboard</h1>
      <h2>Welcome to the admin dashboard</h2>
    <Button onClick={logout}> LOGOUT</Button>
    </div>
      </div>
      </Base>
   
  )
}

export default AdminDashboard