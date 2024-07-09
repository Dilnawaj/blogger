import React, { useContext, useEffect, useState, useRef } from "react";
import userContext from "../context/userContext";
import Base from "../components/Base";
import { useParams } from "react-router";
import { getUser, updateUser } from "../services/User-Service";
import {
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

const ProfileInfo = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    getUser(userId).then((data) => {
      console.log(data);
      setUser({ ...data });
    });

    if (isLoggedIn() && getCurrentUserDetail().id != userId) {
      console.log("Chlo ji");
      toast.error("This is not your profile!!");
      navigate("/home");
    }
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    console.log("Yaha dekhte hai")
  
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      toast.error("Invalid file type. Please select an image.");
    }
  };
  const handleImageSelect = () => {
    console.log("Waha dekhte hai")
      if(!editMode)
    {
      toast.error("Click the Update User button to enter in update mode.");
      return;
    }
    fileInputRef.current.click();
  };
  const handleUpdateUser = () => {
    setEditMode(true);
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
  
        // Reset the editMode state to false after successfully updating the user
        setEditMode(false);
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
                <span className="underline">User Information</span>
              </h3>
              <div className="image-container mt-3 container text-center">
                <div className="image-wrapper">
                  <img
                    className="img-fluid rounded-circle"
                    src={
                      image // Display the selected image if available, otherwise the user's current image
                        ? URL.createObjectURL(image)
                        : BASE_URL +
                          (user.imageName
                            ? "post/image/" + user.imageName
                            : "post/image/" + "default.PNG")
                    }
                    alt=""
                  />
                  <div className="overlay">
                    <div className="file-input-container">
                      <input
                        id="image"
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                       
                      />
                      <label
                        className="plus-button"
                        onClick={handleImageSelect}
                      >
                        +
                      </label>
                    </div>
                  </div>
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
                    <td className="font-bold">BLOGGER ID</td>
                    <td>{user.id}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">User Name</td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={
                          editMode ? updatedUser?.name || user.name : user.name
                        }
                        onChange={handleFieldChange}
                        className="form-control"
                        disabled={!editMode}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">User Email</td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={
                          editMode
                            ? updatedUser?.email || user.email
                            : user.email
                        }
                        onChange={handleFieldChange}
                        className="form-control"
                        disabled={!editMode}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">About</td>
                    <td>
                      <textarea
                        name="about"
                        value={
                          editMode
                            ? updatedUser?.about || user.about
                            : user.about
                        }
                        onChange={handleFieldChange}
                        className="form-control"
                        disabled={!editMode}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">Profile Created Date</td>
                    <td>{user.profileCreatedDate}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Role</td>
                    <td>{user.role.userType}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Posts</td>
                    <td>{user.numberOfPosts}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Views</td>
                    <td>{user.numberOfViews}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Subscribers</td>
                    <td>{user.totalSubscriber}</td>
                  </tr>

                  <tr>
                    <td className="font-bold">Like</td>
                    <td>{user.likeCount}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Dislike</td>
                    <td>{user.dislikeCount}</td>
                  </tr>
                </tbody>
              </Table>
              <div className="text-center mt-4">
                {!editMode && (
                  <button
                    onClick={handleUpdateUser}
                    className="btn btn-primary mr-2"
                  >
                    Update User
                  </button>
                )}
                {editMode && (
                  <button
                    onClick={handleSubmitUser}
                    className="btn btn-success"
                  >
                    Submit
                  </button>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  };

  return <Base>{user ? userView() : ""}</Base>;
};

export default ProfileInfo;
