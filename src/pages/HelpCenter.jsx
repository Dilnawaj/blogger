import React from "react";
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
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { createCategory, feedback } from "../services/PostService";
import { getCurrentUserDetail } from "../auth/Index";

function HelpCenter() {
  const navigate = useNavigate();
  const [feedbackDetail, setFeedbackDetail] = useState({
    userId: getCurrentUserDetail().id,
    subject: "",
    description: "",
  });

  const submitForm = (event) => {
    event.preventDefault();

    feedback(feedbackDetail)
      .then((data) => {
        // Handle the response data
        console.log("Response from CustomCategory API:", data);
        // Reset the form data
        setFeedbackDetail({
          subject: "",
          description: "",
        });
        toast.success("Feedback is added");
        // Navigate to the desired location after successful submission
        navigate("/user/Feed");
      })
      .catch((error) => {
        // Handle the error scenario
        toast.error("An error occurred while adding feedback.");
      });
  };

  const handleChange = (event, field) => {
    const value = event.target.value;
    setFeedbackDetail((prevDetail) => ({
      ...prevDetail,
      [field]: value,
    }));
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
          height: "100vh",
        }}
      >
        <Container>
          <Card
            inverse
            style={{
              backgroundColor: "#454545",
              marginBottom: "120px",
              width: "900px",
              height: "480px",
              display: "flex",
              justifyContent: "center",
              marginLeft: "120px",
            }}
          >
            <CardHeader>
              <h3>Help Center</h3>
            </CardHeader>
            <CardBody>
              <Form onSubmit={submitForm}>
                <FormGroup>
                  <Label for="categoryTitle">Enter Subject</Label>
                  <Input
                    type="text"
                    placeholder="Enter Subject here"
                    id="subject"
                    value={feedbackDetail.subject}
                    onChange={(e) => handleChange(e, "subject")}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="Description">Describe Issue</Label>
                  <Input
                    type="textarea"
                    placeholder="Enter Description here"
                    id="description"
                    style={{ height: "200px" }}
                    value={feedbackDetail.description}
                    onChange={(e) => handleChange(e, "description")}
                  />
                </FormGroup>
                <Container className="text-center">
                  <div className="d-flex justify-content-center">
                    <Button
                      color="info"
                      size="lg"
                      className="mr-2 mx-2"
                      type="submit"
                    >
                      Add Feedback
                    </Button>
                    <Link to="/user/Feed">
                      <Button color="secondary" size="lg" className="mx-2">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </Container>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </Base>
  );
}

export default HelpCenter;
