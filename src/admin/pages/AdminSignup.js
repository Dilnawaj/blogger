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
import Base from "../../components/Base";
import "../../pages/style.css";
import { googleSignUp, signUp } from "../services/Admin-Service";
import { toast } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const baseUrl = process.env.REACT_APP_BASE_URL;

const AdminSignup = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    about: "",
    dob: "",
    password: "",
  });
  const [error, setError] = useState({
    errors: {},
    isError: false,
  });

  const clientId = process.env.REACT_APP_CLIENT_KEY;
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!data.name) {
      isValid = false;
      errors.name = "Please enter your name";
    }
    if (!data.password) {
      isValid = false;
      errors.password = "Please enter your passwordss";
    }
    if (!data.dob) {
      isValid = false;
      errors.dob = "Please enter your Date of Birth";
    }
    if (!data.email) {
      isValid = false;
      errors.email = "Please enter your email address";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      isValid = false;
      errors.email = "Please enter a valid email address";
    }

    setError({
      isError: true,
      errors: errors,
    });

    return isValid;
  };

  const resetData = () => {
    setData({
      name: "",
      email: "",
      about: "",
      password: "",
    });
  };
  const handleGoogleFailure = (error) => {
    if (error.error === "popup_closed_by_user") {
      console.error("Google Sign-In canceled by the user.");
      toast.error("Google Sign-In canceled by the user. Please try again.");
    } else {
      console.error("Google Sign-In failed:", error);
      toast.error("Google Sign-In failed. Please try again.");
    }
  };
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const submitForm = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Form data is invalid or incomplete");
      return;
    }
    console.log(data);
    signUp(data)
      .then((resp) => {
        console.log(resp);
        console.log("success log");
        setData({
          name: "",
          email: "",
          about: "",
          password: "",
        });
        console.log("Url", baseUrl);
        toast.success(resp.message, {
          style: {
            width: "700px",
          },
          autoClose: 14000, // Display the toast for 8 seconds
        });

        navigate("/login/admin");
      })
      .catch((error) => {
        console.error(error);
        console.log("error log", error.response.data.error);
        if (error.response) {
          // The API returned an error message
          setError({
            isError: true,
            errors: error.response?.data?.error || "An unknown error occurred",
          });
          toast.error(
            error.response?.data?.error ||
              "Signup failed. Please try again or contact support."
          );
        } else {
          // There was a network error
          setError({
            isError: true,
            errors: "There was a network error. Please try again later.",
          });
          toast.error("There was a network error. Please try again later.");
        }
      });
  };

  const handleChange = (event, property) => {
    const value = event.target.value;
    let errors = { ...error.errors }; // make a copy of the errors object

    setData({ ...data, [property]: value });

    // update the errors object if there is a validation error
    if (property === "name") {
      if (!value) {
        errors.name = "Please enter your name";
      } else {
        delete errors.name; // remove the error message from the errors object
      }
    } else if (property === "password") {
      if (!value) {
        errors.password = "Please enter your password";
      } else if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value)
      ) {
        errors.password =
          "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one digit";
      } else {
        delete errors.password;
      }
    } else if (property === "email") {
      if (!value) {
        errors.email = "Please enter your email address";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.email = "Please enter a valid email address";
      } else {
        delete errors.email; // remove the error message from the errors object
      }
    } else if (property === "dob") {
      if (value) {
        delete errors.dob; // remove the error message from the errors object
      }
    }
    // update the error state
    setError({
      isError: Object.keys(errors).length > 0, // set the isError field to true if there are any errors in the errors object
      errors: errors,
    });
  };
  const handleGoogleSuccess = (response) => {
    console.log("Google SUcess boom");
    // Get the Google code from the response
    const googleCode = response.code;
    var res = {};
    res["code"] = response.credential;
    console.log("Response", res);

    var code = res.code;
    console.log("Code", code);
    // Call your backend API with the Google code
    googleSignUp(code)
      .then((resp) => {
        console.log(resp);
        console.log("success log");
        setData({
          name: "",
          email: "",
          about: "",
        });
        console.log("Url", baseUrl);
        toast.success(resp.message, {
          style: {
            width: "700px",
          },
          autoClose: 14000, // Display the toast for 8 seconds
        });

        navigate("/login/admin");
      })
      .catch((error) => {
        console.error(error);
        console.log("error log", error.response.data.error);
        if (error.response) {
          // The API returned an error message
          setError({
            isError: true,
            errors: error.response?.data?.error || "An unknown error occurred",
          });
          toast.error(
            error.response?.data?.error ||
              "Signup failed. Please try again or contact support."
          );
        } else {
          // There was a network error
          setError({
            isError: true,
            errors: "There was a network error. Please try again later.",
          });
          toast.error("There was a network error. Please try again later.");
        }
        navigate("/login");
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
          height: "115vh",
        }}
      >
        <Container>
          <Card
            inverse
            style={{ backgroundColor: "#454545", marginBottom: "145px" }}
          >
            <CardHeader>
              <h3>Fill Information for Register</h3>
            </CardHeader>
            <CardBody>
              <Form onSubmit={submitForm}>
                <FormGroup>
                  <Label for="name">Enter Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter Name here"
                    id="name"
                    onChange={(e) => handleChange(e, "name")}
                    value={data.name}
                    invalid={!!error.errors.name}
                  />
                  {error.errors.name && (
                    <p className="warning-message">{error.errors.name}</p>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="email">Enter Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter Email here"
                    id="email"
                    onChange={(e) => handleChange(e, "email")}
                    value={data.email}
                    invalid={!!error.errors.email}
                  />
                  {error.errors.email && (
                    <p className="warning-message">{error.errors.email}</p>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="password">Enter Password</Label>
                  <Input
                    type="text"
                    placeholder="Enter Password here"
                    id="password"
                    onChange={(e) => handleChange(e, "password")}
                    value={data.password}
                    invalid={!!error.errors.password}
                  />
                  {error.errors.password && (
                    <p className="warning-message">{error.errors.password}</p>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="dob">Date of Birth:</Label>
                  <Input
                    type="date"
                    name="dob"
                    id="dob"
                    onChange={(e) => handleChange(e, "dob")}
                    value={data.dob}
                    invalid={!!error.errors.dob}
                    max={getTodayDate()}
                  />
                  {error.errors.dob && (
                    <p className="warning-message">{error.errors.dob}</p>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="about">Role</Label>
                  <Input type="text" required={false} value={"Admin"} />
                </FormGroup>
                <Container className="text-center">
                  <div className="d-flex justify-content-center">
                    <Button color="success" className="mr-2 mx-2">
                      Register
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
                    <Link to="/login/admin">
                      <Button color="info" size="lg" className="mr-2 mx-2">
                        Back
                      </Button>
                    </Link>
                  </div>

                  <div className="row px-3 or_box mt-4 d-flex justify-content-center">
                    <div className="line"></div>
                    <small style={{ margin: "0 1px" }}>OR</small>
                    <div className="line"></div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* Wrap the GoogleLogin component with GoogleOAuthProvider */}
                    <GoogleOAuthProvider clientId={clientId}>
                      <GoogleLogin
                        buttonText="Google Signup"
                        onSuccess={handleGoogleSuccess}
                        onFailure={handleGoogleFailure}
                      />
                    </GoogleOAuthProvider>
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

export default AdminSignup;
