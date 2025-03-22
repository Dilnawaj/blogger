import Base from "../../components/Base";
import { forgotPassword } from "../services/Admin-Service";
import { useState } from "react";
import { Button, Form, FormGroup, Label, Input, CardBody, CardHeader, Container } from "reactstrap";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "reactstrap";
function AdminForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
    dob: "",
  });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let hasErrors = false;
  const handleChange = (event,field) => {
    console.log("Event",event)
    console.log("Field",field)
    let actualValue = event.target.value;
    let errorMessage = "";
    switch (field) {
      case "email":
        errorMessage = emailRegex.test(actualValue)
          ? ""
          : "Invalid email format";
        break;
      default:
        break;
    }
    setErrors({
      ...errors,
      [field]: errorMessage,
    });
    setFormData({
      ...formData,
      [field]: actualValue,
    });
  };
  const [errors, setErrors] = useState({
    email: "",
    dob: "",
  });

  const navigate = useNavigate();
  const submitForm = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (errors.email || errors.password) {
      hasErrors = true;
      toast.error("Form data is invalid or incomplete");
    }

    if (!hasErrors) {
      forgotPassword(formData)
        .then((resp) => {
          setFormData({
            dob: "",
            email: "",
          });

          toast.success(
            "For reset password, \n please check your email address."
          );

          navigate("/login/admin");
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            setErrors({
              isError: true,
              error: error.response.data.error || "An unknown error occurred",
            });
            toast.error(
              error.response.data.error ||
                "User not found. Please try again or contact support."
            );
          } else if (error.response) {
            // The API returned an error message
            setErrors({
              isError: true,
              error:
                error.response.data.message ||
                "User not found. Please try again or contact support.",
            });
          } else {
            // There was a network error
            setErrors({
              isError: true,
              error: "There was a network error. Please try again later.",
            });
            toast.error("There was a network error. Please try again later.");
          }
        });
    }
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
              height: "320px",
              display: "flex",
              justifyContent: "center",
              marginRight: "430px",
            }}
          >
            
        <CardHeader style={{ backgroundColor: "#333", color: "#fff"}}>
  <h3 style={{ margin: 0 }}>Forgot Password</h3>
</CardHeader>

            <CardBody>
     
          
          <Form onSubmit={submitForm}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email address"
                onChange={(e) => handleChange(e, "email")}
                value={formData.email}
                required
                invalid={errors.email !== ""}
              />
                  {errors.email && (
                    <p className="warning-message">{errors.email}</p>
                  )}
            </FormGroup>

            <FormGroup>
              <Label for="dob">Date of Birth</Label>
              <Input
                type="date"
                name="dob"
                id="dob"
                placeholder="Enter your date of birth"
                onChange={(e) => handleChange(e, "dob")}
                value={formData.dob}
                required
              />
            </FormGroup>
            <div className="text-center">
              <Button type="submit" color="primary">
                Submit
              </Button>

              <Link to="/login/admin">
                <Button color="info" size="mg" className="mr-2 mx-2">
                  Back
                </Button>
              </Link>
            </div>
          </Form>
          </CardBody>
          </Card>
        </Container>
      </div>
    </Base>
  );
}

export default AdminForgotPassword;
