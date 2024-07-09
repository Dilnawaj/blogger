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
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { googleLogin, login } from "../services/User-Service";
import { Link, useNavigate } from "react-router-dom";
import { doLogin } from "../auth/Index";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const Login = () => {
  const navigate = useNavigate();
  const [loginDetail, setLoginDetail] = useState({
    email: "",
    password: "",
  });
  const resetData = () => {
    setLoginDetail({
      email: "",
      password: "",
    });
    setError({
      errors: {},
      isError: false,
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


  const [error, setError] = useState({
    errors: {},
    isError: false,
  });
  const clientId = process.env.REACT_APP_CLIENT_KEY;
  const submitForm = (event) => {
    event.preventDefault();
    let hasErrors = false;
console.log(1)
    // Check for validation errors
    if (error.errors.isError) {
      hasErrors = true;
      toast.error("Login credentials are invalid or incomplete");
    }
    console.log(2)
    if (!hasErrors) {
      console.log(3)
      console.log(loginDetail);
      login(loginDetail)
        .then((resp) => {
          console.log("success log", resp);
          doLogin(resp, () => {
            console.log("login detail is saved to local storage");
          });
          console.log(4)
          setLoginDetail({
            email: "",
            password: "",
          });

          setTimeout(() => {

            navigate("/user/dashboard");
          });
        })
        .catch((error) => {
          console.error(error);
          console.log("error log");
          console.log("error log response", error.response.data.error);
          console.log("error log response", error.response.data.error);

          toast.error(error.response.data.error);
          });
    }
  };
  console.log(5)
  const [showPassword, setShowPassword] = useState(false);
  const handleGoogleSuccess = (response) => {
    console.log("Google SUcess boom");
    // Get the Google code from the response
    const googleCode = response.code;
    var res = {};
    res["code"] = response.credential;
    console.log("Response", res);
    console.log(6)
    var code = res.code;
    console.log("Code", code);
    // Call your backend API with the Google code
    googleLogin(code)
      .then((resp) => {
        console.log("success log", resp);
        doLogin(resp, () => {
          console.log("login detail is saved to local storage");
        });

        setLoginDetail({
          email: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/user/dashboard");
        });
      })
      .catch((error) => {
        console.error(error);
          console.log("error log");
          console.log("error log response", error.response.data.error);

          toast.error(error.response.data.error);
      });
  };
  const handleChange = (event, field) => {
    let actualValue = event.target.value;
    let errorMessage = "";
    switch (field) {
      case "email":
        errorMessage = emailRegex.test(actualValue)
          ? ""
          : "Invalid email format";
        break;
      case "password":
        errorMessage = passwordRegex.test(actualValue)
          ? ""
          : "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one digit";
        break;
      default:
        break;
    }
    if(errorMessage!="")
    {
      error.errors.isError=true;
    }
    else{
      error.errors.isError=false;
    }
    setError({
      ...error,
      [field]: errorMessage,
    });
    setLoginDetail({
      ...loginDetail,
      [field]: actualValue,
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
              width: "700px",
              marginBottom: "170px",
              marginTop: "0px",
              height: "450px",
              display: "flex",
              justifyContent: "center",
             
            }}
          >
            <CardHeader>
              <h3>Login</h3>
            </CardHeader>
            <CardBody>
              <Form onSubmit={submitForm}>
                <FormGroup>
                  <Label for="email">Enter Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter Email here"
                    id="email"
                    value={loginDetail.email}
                    onChange={(e) => handleChange(e, "email")}
                    invalid={error.errors.isError}
                  />
                  <div > {error.email && (
                    <p className="warning-message">{error.email}</p>
                  )}</div>
                </FormGroup>
                <FormGroup>
                  <Label for="password">Enter Password</Label>
                  <div className="password-input-wrapper">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password here"
                      id="password"
                      value={loginDetail.password}
                      onChange={(e) => handleChange(e, "password")}
                      invalid={error.errors.isError}
                    />
                    
                    <div
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {error.password && (
                    <p className="warning-message">{error.password}</p>
                  )}
                  </div>
                  <div className="invalid-feedback">{error.password}</div>
                </FormGroup>

                <Container className="text-center">
                  <div className="d-flex justify-content-center">
                    <Button color="warning" className="mr-2 mx-2">
                      Login
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
                    <Link to="/signup">
                      <Button color="info" size="lg" className="mr-2 mx-2">
                        Signup
                      </Button>
                    </Link>
                    <Link to="/forgotpassword">
                      <Button color="dark" size="lg" className="mr-2 mx-2">
                        Forgot Password
                      </Button>
                    </Link>
                  </div>

                  <div className="row px-3 or_box mt-4 d-flex justify-content-center">
                    <div className="line"></div>
                    <small style={{ margin: "0 10px" }}>OR</small>
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
export default Login;
