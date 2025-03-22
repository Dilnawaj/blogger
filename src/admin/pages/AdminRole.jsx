import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Base from "../../components/Base";
import { FaHandLizard } from "react-icons/fa";
import { Button } from "reactstrap";
import { grantAdmin } from "../services/Admin-Service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminRole() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailAddress = searchParams.get("email");
  const [message, setMessage] = useState("Granting admin access");
  useEffect(() => {
    handleClick();
  }, []);
  const handleClick = () => {
    grantAdmin(emailAddress)
      .then(() => {
        setMessage("Admin role successfully granted.");
      })
      .catch(() => {
        setMessage("Unable to grant admin role");
      });
  };

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
        <div
          style={{
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.43)",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h1>{message}</h1>
        </div>
      </div>
    </Base>
  );
}

export default AdminRole;
