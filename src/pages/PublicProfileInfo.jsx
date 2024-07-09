import React, { useContext, useEffect, useState, useRef } from "react";
import userContext from "../context/userContext";
import Base from "../components/Base";
import { useParams } from "react-router";
import { getUser, updateUser } from "../services/User-Service";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import { toast } from "react-toastify";
import { getCurrentUserDetail, isLoggedIn } from "../auth/Index";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/helper";
import { uploadPostImage, uploadUserImage } from "../services/PostService";

const PublicProfileInfo = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleGoBack = () => {
    // Redirect to the previous page URL
    navigate(-1);
  };
  useEffect(() => {
    getUser(userId).then((data) => {
      console.log(data);
      setUser({ ...data });
    });
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      console.log(file);
      setImage(file);
    } else {
      toast.error("Invalid file type. Please select an image.");
      console.log("Invalid file type. Please select an image.");
    }
  };

  const handleUpdateUser = () => {
    setEditMode(true);
  };

  const handlePlusButtonClick = () => {
    if (editMode) {
      fileInputRef.current.click();
    } else {
      toast.error("Edit mode is not active.");
    }
  };

  const handleSubmitUser = () => {
    const updatedData = {
      ...user,
      ...updatedUser,
    };
    console.log("User submitted for saving:", updatedData);

    updateUser(updatedData)
      .then((data) => {
        console.log("User saved:", data);
        if (image) {
          uploadUserImage(image, getCurrentUserDetail().id)
            .then(() => {
              getUser(userId) // Fetch the updated user data
                .then((data) => {
                  setUser({ ...data }); // Update the user state with the updated data
                })
                .catch((error) => {
                  toast.error("Error fetching updated user data");
                });
            })
            .catch((error) => {
              toast.error("Error in uploading image");
            });
        }
        toast.success("Updated user data");
      })
      .catch((error) => {
        console.error("Error saving user:", error);
        toast.error("Error in updating user data");
      });
  };

  const userView = () => {
    return (
      <Row>
        <Col md={{ size: 7, offset: 3 }}>
          <Card className="mt-3 border-0 rounded-0 shadow-sm">
            <CardBody>
              <h3 className="text-uppercase mb-4 text-center">
                <span className="underline">Blogger Information</span>
              </h3>
              <div className="image-container mt-3 container text-center">
                <div className="image-wrapper">
                  <img
                    className="img-fluid rounded-circle"
                    src={
                      BASE_URL +
                      (user.imageName
                        ? "post/image/" + user.imageName
                        : "post/image/" + "default.PNG")
                    }
                    alt=""
                  />
                </div>
              </div>

              <Table
                responsive
                striped
                hover
                bordered={true}
                className="text-center mt-5"
              >
                <tbody>
                  <tr>
                    <td className="font-bold">USER NAME</td>
                    <td>{user.name}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">USER EMAIL</td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">ABOUT</td>
                    <td>{user.about}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">ROLE</td>
                    <td>{user.role.userType}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">VIEWS</td>
                    <td>{user.numberOfViews}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">SUBSCRIBERS</td>
                    <td>{user.totalSubscriber}</td>
                  </tr>

                  <tr>
                    <td className="font-bold">LIKE</td>
                    <td>{user.likeCount}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">DISLIKE</td>
                    <td>{user.dislikeCount}</td>
                  </tr>
                </tbody>
              </Table>

              {/* <Button color="danger" onClick={handleGoBack}>
                Back
              </Button> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  };

  return <Base>{user ? userView() : "Loading user data"}</Base>;
};

export default PublicProfileInfo;
