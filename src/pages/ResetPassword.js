import React, { useState } from "react";
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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../services/User-Service";
import Base from "../components/Base";
import { getCurrentUserDetail } from "../auth/Index";

const ResetPassword = () => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  var email = "";
  const [forgetDetail, setForgetDetail] = useState({
    password: "",
    confirmPassword: "",
    code: code || "",
  });
 

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const hasErrors = Object.values(errors).some((error) => error);

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!forgetDetail.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(forgetDetail.password)) {
      errors.password =
        "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one digit";
      isValid = false;
    }

    if (!forgetDetail.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm Password is required";
      isValid = false;
    } else if (forgetDetail.confirmPassword !== forgetDetail.password) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const resetData = () => {
    setForgetDetail({
      confirmPassword: "",
      password: "",
      code: "",
      email: "",
    });
  };

  const submitForm = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      console.log("Password:", errors.password)
      console.log("Confirm Password:", errors.confirmPassword)
      const errorMessage = errors.password === ""|| errors.password===undefined ? errors.confirmPassword : errors.password;
      toast.error(errorMessage);
      return;
    }

    if (typeof getCurrentUserDetail() !== "undefined") {
      console.log("email", getCurrentUserDetail());

      email = getCurrentUserDetail().email;
      console.log("email Address", email);
    }

    resetPassword({
      ...forgetDetail,
      code: code,
      email: email,
    })
      .then((resp) => {
        setForgetDetail({
          confirmPassword: "",
          password: "",
        });

        toast.success("Password successfully updated.");

        navigate("/user/dashboard");
      })
      .catch((error) => {
        console.error(error);
        console.log("error log");
        console.log("error log response", error.response?.data.error);

        if (error.response && error.response.status === 400) {
          setErrors({
            ...errors,
            password: "An unknown error occurred",
          });
          toast.error(
            error.response?.data.error ||
              "User not found. Please try again or contact support."
          );
        } else if (error.response) {
          // The API returned an error message
          setErrors({
            ...errors,
            password:
              error.response.data.message ||
              "User not found. Please try again or contact support.",
          });
        } else {
          // There was a network error
          setErrors({
            ...errors,
            password: "There was a network error. Please try again later.",
          });
          toast.error("There was a network error. Please try again later.");
        }
      });
  };

  const handleChange = (event, field) => {
    let actualValue = event.target.value;
    let errorMessage = "";
    switch (field) {
      case "confirmPassword":
        if (actualValue !== forgetDetail.password) {
          errorMessage = "Passwords do not match";
        }
        break;
      case "password":
        errorMessage = passwordRegex.test(actualValue)
          ? ""
          : "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one digit";
        break;
      default:
        break;
    }

    setForgetDetail({
      ...forgetDetail,
      [field]: actualValue,
    });

    setErrors({
      ...errors,
      [field]: errorMessage,
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
        <Container>
          <Card
            inverse
            style={{
              backgroundColor: "#454545",
              marginBottom: "200px",
              width: "700px",
              height: "460px",
              display: "flex",
              justifyContent: "center",
              marginRight: "430px",
            }}
          >
            <CardHeader>
              <h3>Login</h3>
            </CardHeader>
            <CardBody>
              <Form onSubmit={submitForm}>
                <FormGroup>
                  <Label for="password">Enter Password</Label>
                  <div className="password-input-wrapper">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password here"
                      id="password"
                      value={forgetDetail.password}
                      onChange={(e) => handleChange(e, "password")}
                      invalid={errors.password !== ""}
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
                  <div className="invalid-feedback">{errors.password}</div>
                </FormGroup>

                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <div className="password-input-wrapper">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter Password here"
                      id="confirmPassword"
                      value={forgetDetail.confirmPassword}
                      onChange={(e) => handleChange(e, "confirmPassword")}
                      invalid={errors.confirmPassword !== ""}
                    />
                    <div
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                  </div>
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                </FormGroup>
                <Container className="text-center">
                  <div className="d-flex justify-content-center">
                    <Button color="warning" className="mr-2 mx-2" type="submit">
                      Submit
                    </Button>
                    <Button
                      onClick={resetData}
                      color="secondary"
                      type="reset"
                      className="mx-2"
                      size="lg"
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

export default ResetPassword;
