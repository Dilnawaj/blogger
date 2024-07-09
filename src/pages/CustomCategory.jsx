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
import { createCategory } from "../services/PostService";

function CustomCategory() {
  const navigate = useNavigate();
  const [categoryDetail, setCategoryDetail] = useState({
    categoryTitle: "",
    categoryDescription: "",
  });

  const submitForm = (event) => {
    event.preventDefault();

    createCategory(categoryDetail)
      .then((data) => {
        // Handle the response data
        console.log("Response from CustomCategory API:", data);
        // Reset the form data
        setCategoryDetail({
          categoryTitle: "",
          categoryDescription: "",
        });
        toast.success("Category has been submitted for admin approval");
        // Navigate to the desired location after successful submission
        navigate("/user/dashboard");
      })
      .catch((error) => {
        console.error("Error in CustomCategory API call:", error);
        // Handle the error scenario
        toast.error(
          "An error occurred while creating the custom category. Please try again later."
        );
      });
  };

  const handleChange = (event, field) => {
    const value = event.target.value;
    setCategoryDetail((prevDetail) => ({
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
          backgroundImage: 'url("http://localhost:5000/post/image/background.png")',
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
              marginBottom: "90px",
              width: "900px",
              height: "480px",
              display: "flex",
              justifyContent: "center",
              marginRight: "720px",
            }}
          >
            <CardHeader>
              <h3>Custom Category</h3>
            </CardHeader>
            <CardBody>
              <Form onSubmit={submitForm}>
                <FormGroup>
                  <Label for="categoryTitle">Enter Category Title</Label>
                  <Input
                    type="text"
                    placeholder="Enter Category Title here"
                    id="categoryTitle"
                    value={categoryDetail.categoryTitle}
                    onChange={(e) => handleChange(e, "categoryTitle")}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="categoryDescription">
                    Enter Category Description
                  </Label>
                  <Input
                    type="textarea"
                    placeholder="Enter Category Description here"
                    id="categoryDescription"
                    style={{ height: "200px" }}
                    value={categoryDetail.categoryDescription}
                    onChange={(e) => handleChange(e, "categoryDescription")}
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
                      Add Category
                    </Button>
                    <Link to="/user/dashboard">
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

export default CustomCategory;
