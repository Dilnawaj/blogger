import React, { useEffect, useState } from "react";
import Base from "../components/Base";
import AddPost from "../components/AddPost";
import { Button, Col, Container, Row, Modal, ModalBody, ModalFooter } from "reactstrap";
import {  getCurrentUserDetail } from "../auth/Index";
import {
  deletePostService,
  loadPostCategoryWise,
  loadPostUserWise,
  updatePasswordAlert,
} from "../services/PostService";
import { toast } from "react-toastify";
import Post from "../components/Post";
import CategorySideMenu from "../components/CategorySideMenu";
import { Link } from "react-router-dom";
import { cancelUpdatePassword, updatePassword } from "../services/User-Service";
import {  useNavigate } from "react-router-dom";
const UserDashboard = () => {
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // State to manage the visibility of the popup
  const navigate = useNavigate();
  useEffect(() => {
      // Check if the access token is expired
  // const accessToken =getToken();
  // console.log("AccessToken",accessToken)
  // if (accessToken && isTokenExpired(accessToken)) {
  //   doLogout(); // Call the logout function
  //   console.log("LOGOUT")
  //   return; // Stop further processing
  // }
    console.log("User", getCurrentUserDetail());
    setUser(getCurrentUserDetail());
    updatePasswordAlert()
      .then((data) => {
        console.log(data);
        // Show the popup when the updatePasswordAlert response is successful
        setShowPopup(true);
      })
      .catch((error) => {
        console.log(error);
       // toast.error("Error is updatePasswordAlert");
      });
    loadPostData();
  }, []);

  function loadPostData() {
    loadPostUserWise(getCurrentUserDetail().id)
      .then((data) => {
        console.log(data);
        setPosts([...data]);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error is loading posts");
      });
  }

  function handleCancel() {
    // cancelUpdatePassword(getCurrentUserDetail().id)
    //   .then((data) => {
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
      setShowPopup(false);
  }

  function handleAdd() {
    navigate("/resetpassword");
  }

  return (
    <Base>
      <Container className="mt-3">
        <Row>
          <Col md={10} className="pt-3">
            <AddPost />
          </Col>
          <Col md={2}>
            <Button color="secondary" size="lg">
              <Link
                to="/user/custom/category"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Add Custom Category
              </Link>
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Popup */}
      <Modal isOpen={showPopup} centered>
  <ModalBody style={{ height: '100px', overflowY: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
      <div style={{ textAlign: 'center', fontSize: '30px', fontWeight: 'bold', color: 'black', textDecoration: 'underline' }}>
        Please Add Password
      </div>
    </div>
    {/* Add any additional content you want here */}
  </ModalBody>
  <ModalFooter className="d-flex justify-content-center">
    <Button color="danger" onClick={handleCancel}>
      Later
    </Button>
    <Button color="success" onClick={handleAdd}>
      ADD
    </Button>
  </ModalFooter>
</Modal>


    </Base>
  );
};

export default UserDashboard;
