import React, { useEffect, useState } from "react";
import Base from "../components/Base";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  FormGroup,
  Input,
  Label,
  Form,
  Button,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { updatePassword } from "../services/User-Service";
import { Link, useNavigate } from "react-router-dom";
import { doLogin, getCurrentUserDetail } from "../auth/Index";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleChange = (event, field) => {
    console.log("Event", event);
    console.log("Field", field);
    let actualValue = event.target.value;
    if (field == "newPassword") {
      setNewPassword(event.target.value);
    } else if (field == "confirmPassword") {
      setConfirmPassword(event.target.value);
    }
    let errorMessage = "";
    switch (field) {
      case "newPassword":
        errorMessage = passwordRegex.test(actualValue)
          ? ""
          : "Passwordss must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one digit";
        break;
      case "confirmPassword":
        if (actualValue !== newPassword) {
          errorMessage = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors({ ...errors, [field]: errorMessage });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Email is", getCurrentUserDetail().email);
    if (!password || !newPassword || !confirmPassword) {
      toast.error("Please fill in all the fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one digit"
      );
      return;
    }

    const user = {
      password: password,
      newPassword: newPassword,
      email: getCurrentUserDetail().email,
    };

    updatePassword(user)
      .then((response) => {
        // Handle the response
        console.log("Password updated successfully");
        // Reset the form
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password updated successfully");
        // Redirect to a success page or any other necessary action
      })
      .catch((error) => {
        // Handle the error
        console.error("Error updating password:", error);
        toast.error("Current password is wrong. Please try again.");
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
          backgroundSize: "104% auto",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <Container>
          <Card
            inverse
            style={{
              backgroundColor: "#454545",
              marginBottom: "120px",
              width: "700px",
              height: "450px",
              display: "flex",
              justifyContent: "center",
              marginLeft: "180px",
            }}
          >
            <CardHeader style={{ backgroundColor: "#333", color: "#fff" }}>
              <h3 style={{ margin: 0 }}>Update Password</h3>
            </CardHeader>

            <CardBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="password">Current Password</Label>
                  <div className="password-input-wrapper">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {errors.password && (
                      <p className="warning-message">{errors.password}</p>
                    )}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="newPassword">New Password</Label>
                  <div className="password-input-wrapper">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => handleChange(e, "newPassword")}
                    />
                    <div
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {errors.newPassword && (
                      <p className="warning-message">{errors.newPassword}</p>
                    )}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <div className="password-input-wrapper">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => handleChange(e, "confirmPassword")}
                    />
                    <div
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {errors.confirmPassword && (
                      <p className="warning-message">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </FormGroup>

                <Container className="text-center">
                  <div className="d-flex justify-content-center">
                    <Button color="warning" className="mr-2 mx-2" type="submit">
                      Update Password
                    </Button>
                    <Button
                      color="secondary"
                      type="reset"
                      className="mx-2"
                      size="lg"
                      onClick={() => {
                        setPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </Container>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </Base>
  );
};

export default UpdatePassword;
