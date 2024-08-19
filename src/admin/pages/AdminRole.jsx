import React from 'react';
import { useLocation } from "react-router-dom";
import Base from "../../components/Base";
import { FaHandLizard } from 'react-icons/fa';
import { Button } from 'reactstrap';
import { grantAdmin } from '../services/Admin-Service';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminRole() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const emailAddress = searchParams.get("email");

    const handleClick = () => {
        grantAdmin(emailAddress).then(() => {
            toast.success(
                "Admin role successfully granted."
              );
            navigate("/login/admin");
        }).catch(() => {
            toast.error("Unable to grant admin role");
        });
    }

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
            <Button 
    onClick={handleClick} 
    style={{
        fontSize: "2rem",        // Increase font size
        padding: "20px 40px",    // Increase padding for larger button
        backgroundColor: "#6c757d",  // Grey background color
        color: "#fff",           // Button text color
        borderRadius: "10px",    // Button border radius
    }}
>
                    Grant Admin Access
                </Button>
            </div>
        </Base>
    )
}

export default AdminRole;
