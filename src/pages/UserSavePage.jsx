import React, { useEffect, useState } from "react";
import Base from "../components/Base";
import { useParams } from "react-router";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Input,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FaSave } from "react-icons/fa";
import Buttons from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ReportIcon from '@mui/icons-material/Report'
import {
  createComment,
  createPost,
  createReport,
  createSavePost,
  downloadPost,
  isPostSave,
  isSubscribe,
  loadPost,
  saveSubscriber,
  search,
  unSaveSubscriber,
} from "../services/PostService";
import { toast } from "react-toastify";
import { BASE_URL } from "../services/helper";
import { isLoggedIn } from "../auth/Index";
import { getCurrentUserDetail } from "../auth/Index";
import { addLikeANdDislike } from "../services/PostService";
import { shareEmail } from "../services/PostService";
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';

function UserSavePage() {
  const { postId } = useParams();
  const { pageNumber } = useParams();
  const { sortBy } = useParams();
  const { categorieId } = useParams();
  const [totalSubscriber, setTotalSubscriber] = useState("");
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(undefined);
  const [authorUserId, setAuthorUserId] = useState(undefined);
  const [isSavedSymbol, setIsSavedSymbol] = useState(true);
  const [isSaved, setIsSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [isLogin,setIsLogin]=useState(false);
  const [isSubscribeButtonDisabled, setIsSubscribeButtonDisabled] =
    useState(false);
  var postUserId = "";

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [likeOrDislike, setLikeOrDislike] = useState(null);
  const [comment, setComment] = useState({
    comment: "",
    userName: "",
  });
  const navigate = useNavigate();
  const handleGoBack = () => {
    

    navigate(`/user/save`);
    //window.location.reload();
  };

  const handleDownload = ()=>{
    console.log("Button was clicked")
    if (!isLoggedIn()) {
      toast.error("Need to login first!!");
      return;
    }
    console.log("yah dekhte h")
    downloadPost(postId).then((data)=>{
      console.log("Download",data)
      const byteCharacters = atob(data.Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
  
      // Create a blob from the byte array
      const blob = new Blob([byteArray], { type: 'application/pdf' });
  
      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'downloaded-file.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch((error)=>
    {
      console.log("Error in downloading post", error);
      toast.error("Error in downloading post");
    })

  }
  const handleReportClick = () => {
    
    if (!isLoggedIn()) {
      toast.error("Need to login first!!");
      return;
    }

    createReport(postId,user?.id).then((data)=>{

console.log(data);
    }
    ).catch((error) => {
      console.log("Error in downloading post", error);
    });
    toast.error("Thanks for reporting!\nIf we find this feed inappropriate, we will remove it!");

  };
  const toggleEmailModal = () => {
    if (!isLoggedIn()) {
      toast.error("Need to login first!!");
      return;
    }
    setIsEmailModalOpen(!isEmailModalOpen);
  };

  useEffect(() => {


    loadPost(postId)
      .then((data) => {
        console.log(data);
        //user?.id
        setAuthorUserId(data.user?.userId);
        setPost(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error in loading post");
      });

    if (isLoggedIn()) {
      setIsLogin(true);
      setUser(getCurrentUserDetail());
    }
    else
    {
      setIsLogin(false);
      console.log("Dekhte h yaha")
      //  disabled={isLoading || isSaved === null || isSaved}
      setIsLoading(false);
    }
    console.log("Dekhte h yaha bbahiiiiiiiiiiiiissssssssssssssssssssssssssssssss...",authorUserId)
  }, []);

  const printDate = (number) => {
    return new Date(number).toLocaleDateString();
  };
  const handleUserClick = () => {
    // Handle the click action here (e.g., navigate to a user profile page)
    // You can define the behavior based on your application's requirements
  };
  const addEmail = () => {
    if (!isLoggedIn()) {
      toast.error("Need to login first!!");
      return;
    }
    if (emailInput.trim() !== "") {
      setEmailList([...emailList, emailInput.trim()]);
      setEmailInput("");
    }
  };

  
  const submitPost = () => {
    if (!isLoggedIn()) {
      toast.error("Need to login first!!");
      return;
    }

    if (comment.comment.trim() === "") {
      return;
    }
    setUser(getCurrentUserDetail());

    createComment(comment, post.postId, user?.id)
      .then((data) => {
        console.log("bebo", data);
        toast.success("Comment added.");
        setPost({
          ...post,
          comments: [...post.comments, data],
        });
        setComment({
          comment: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("There is an error in Comment.");
      });
  };
  const subscribePost = () => {
    if (!isLoggedIn()) {
      toast.error("Need to login first!!");
      return;
    }
    console.log("UserId", user?.id);
    console.log("PostUserId", post.user?.id);
    if (post.user?.id === user?.id) {
      toast.error("same user");
      return;
    }
    postUserId = post.user?.id;
    setIsSubscribeButtonDisabled(true); // Disable the button

    saveSubscriber(user?.id, post.user?.id)
      .then((data) => {
        console.log("bebo", data);

        setTotalSubscriber(data);
        toast.success(
          "Subscribe successful. When User post, you will receive a notification via email.",
          {
            style: {
              width: "660px",
            },
          }
        );

        setIsSubscribeButtonDisabled(true); // Set the button state to disabled
      })
      .catch((error) => {
        console.log(error);

        toast.error("There is an error in the subscription process.");
      });
  };

  const unsubscribePost = () => {
    console.log("UserId", user?.id);
    console.log("PostUserId", post.user?.id);
    if (post.user?.id === user?.id) {
      toast.error("same user");
      return;
    }

    unSaveSubscriber(user?.id, post.user?.id)
      .then((data) => {
        console.log("bebo", data);
        setTotalSubscriber(data);
        toast.success(
          "Unsubscribe successful. You will not receive a notification via email.",
          {
            style: {
              width: "570px",
            },
          }
        );

        setIsSubscribeButtonDisabled(false); // Enable the button
      })
      .catch((error) => {
        console.log(error);
        toast.error("There is an error in the unsubscribe process.");
      });
  };

  const submitPostLikeAndDislike = (likeOrDislike) => {
    if (!isLoggedIn()) {
      toast.error("Need to login first!!");
      return;
    }
    addLikeANdDislike(post.postId, likeOrDislike, user?.id)
      .then((data) => {
        console.log("bebo", data);
        toast.success(data.message);

        setPost({
          ...post,
          likePost: data.like,
          disLikePost: data.disLike,
        });

        setLikeCount(data.likeCount);
        setDislikeCount(data.dislikeCount);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeEmail = (index) => {
    const updatedList = [...emailList];
    updatedList.splice(index, 1);
    setEmailList(updatedList);
  };

  const shareEmailtoFriend = () => {
    const shareEmailRequest = {
      postId: post.postId,
      userId: user?.id,
      emails: emailList,
    };

    shareEmail(shareEmailRequest)
      .then((data) => {
        console.log("bebo", data);
        toast.success("Post Successfully Share with your Friends");
        setIsEmailModalOpen(false); // Close the modal here
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error in sending email to your friend");
      });
  };

  useEffect(() => {
    if (isLoggedIn() && postId && user && user?.id) {
      isPostSave(postId, user?.id)
        .then((data) => {
          setIsSaved(data.isSaved);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [postId, user]);

  useEffect(() => {
    if (
      isLoggedIn() &&
      post &&
      post.user &&
      post.user?.id &&
      user &&
      user?.id
    ) {
      if (post.user?.id === user?.id) {
        setIsSubscribeButtonDisabled(true);
        return;
      }
      isSubscribe(user?.id, post.user?.id)
        .then((data) => {
          console.log(data);
          setIsSubscribeButtonDisabled(true);
        })
        .catch((error) => {
          console.log(error);
          setIsSubscribeButtonDisabled(false);
        });
    }
  }, [isLoggedIn, post, user]);
  const submitSavePost = () => {
    console.log("yah aaya ki nhi")
    if (!isLoggedIn()) {
      toast.error("Need to login first!!");
      return;
    }

    createSavePost(post.postId, user?.id)
      .then((data) => {
        console.log("bebo", data);
        toast.success("Post saved.");
        setIsSaved(true);
      })
      .catch((error) => {
        setIsSaved(false);
        console.log(error);
        toast.error("There is an error in saving post.");
      });
  };

  const submitErrorPost = () => {
    console.log("Toast message error");
    toast.error("Need to login first!!");
  };

  useEffect(() => {
    if (isLoggedIn() && postId && user && user?.id) {
      isPostSave(postId, user?.id)
        .then((data) => {
          setIsSaved(data.isSaved);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  }, [postId, user]);

  return (
    <Base>
      <Container className="mt-4">
      

        <Row>
          <Col md={{ size: 12 }}>
            <Card className="mt-3 ps-2">
              {post && (
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <CardText>
                      Posted By:{" "}
                      <b>
                        <a
                          href={`http://localhost:3000/viewprofile/${post.user.id}`}
                          onClick={handleUserClick}
                          style={{
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {post.user.name}
                        </a>
                      </b>{" "}
                      on {printDate(post.date)}
                    </CardText>
                    <div>
                    <Buttons
      variant="contained"
      color="primary"
      size="small"
      startIcon={<DownloadIcon />}
      download
      onClick={handleDownload}
    >
      Download
    </Buttons>
                      <Button
                        color="link"
                        onClick={submitSavePost}
                        disabled={isLogin&&(isLoading || isSaved === null || isSaved)}
                      >
                        {isLoading ? (
                          <>
                            <FaSave
                              size={20}
                              onClick={submitErrorPost}
                              style={{ color: "blue" }}
                            />{" "}
                            Save
                          </>
                        ) : isSaved ? (
                          <>
                            <FaSave size={20} /> Saved
                          </>
                        ) : (
                          <>
                            <FaSave size={20} /> Save
                          </>
                        )}
                      </Button>
                      <Button color="link" onClick={toggleEmailModal}>
                        <span role="img" aria-label="share">
                          📧
                        </span>
                        {"  "}
                        Share
                      </Button>
                      <Tooltip title="Report">
                      <IconButton
      onClick={handleReportClick}
      aria-label="report"
      color="primary"
    >
      <ReportIcon />
    </IconButton>
    </Tooltip>
                      <Button
                        color="link"
                        onClick={handleGoBack}
                        style={{
                          color: "purple",
                          fontSize: "12px",
                          border: "2px solid purple", // Add a border
                          padding: "6px 10px", // Add padding for better spacing
                          borderRadius: "3px", // Add rounded corners
                          margin: "3px", // Add margin to separate from other elements
                          transition:
                            "background-color 0.3s, color 0.3s, border 0.3s", // Add a smooth transition
                        }}
                      >
                        Back
                      </Button>
                    </div>
                  </div>

                  <CardText>
                    <span className="text-muted" style={{ fontSize: "19px" }}>
                      <b>{post.category.categoryTitle}</b>
                    </span>
                  </CardText>

                  <div
                    className="divider"
                    style={{
                      width: "100%",
                      height: "1px",
                      background: "#e2e2e2",
                    }}
                  ></div>

                  <CardText>
                    <h3>{post.title}</h3>
                  </CardText>
                  <div
                    className="image-container mt-3 container text-center"
                    style={{ maxWidth: "50%" }}
                  >
                    <img
                      className="img-fluid"
                      src={
                        BASE_URL +
                        (post.imageName
                          ? "post/image/" + post.imageName
                          : "post/image/" + "default.PNG")
                      }
                      alt=""
                    />
                  </div>

                  <CardText
                    className="mt-5"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        marginRight: "10px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {post.numberOfViews}
                    </span>
                    {/* You can style the view count in an eye-catching way */}
                    <span
                      style={{
                        fontSize: "12px",
                        color: "gray",
                        fontWeight: "bold",
                      }}
                    >
                      👁️
                    </span>
                  </div>
                
             
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {post.user?.id !== user?.id && (
                      <>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            style={{
                              marginRight: "8px",
                              fontSize: "25px",
                              fontWeight: "bold",
                            }}
                          >
                            {totalSubscriber === ""
                              ? post.user.totalSubscriber
                              : totalSubscriber}
                          </span>
                          {isSubscribeButtonDisabled ? (
                            <Button
                              onClick={unsubscribePost}
                              className="mt-2"
                              color="danger"
                              style={{ width: "110px" }}
                            >
                             Unfollow
                            </Button>
                          ) : (
                            <Button
                              onClick={subscribePost}
                              className="mt-2"
                              color="danger"
                              disabled={isSubscribeButtonDisabled}
                              style={{ width: "110px" }}
                            >
                              Follow
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                 
                  <div>
                    <Button
                      color="link"
                      onClick={() => {
                        submitPostLikeAndDislike(true);
                      }}
                    >
                      {likeOrDislike === true ? "👍" : "👍"}
                      <span style={{ marginLeft: "0.5rem" }}>
                        {post.likePost}
                      </span>
                    </Button>
                    <Button
                      color="link"
                      onClick={() => {
                        submitPostLikeAndDislike(false);
                      }}
                    >
                      {likeOrDislike === false ? "👎" : "👎"}
                      <span style={{ marginLeft: "0.5rem" }}>
                        {post.disLikePost}
                      </span>
                    </Button>
                    {
  (() => {
    const spaces = [];
    for (let i = 0; i < 195; i++) {
      spaces.push('\u00a0');
    }
    return spaces;
  })()
}
<Button
  color="link"
  onClick={handleGoBack}
  style={{
    color: "white", // Text color
    backgroundColor: "#A9A9A9", // Light Grey Background color
    fontSize: "16px", // Font size
    border: "2px solid #696969", // Dark Grey Border
    padding: "7px 20px", // Padding
    borderRadius: "3px",
    margin: "3px",
    transition: "background-color 0.3s, color 0.3s, border 0.3s",
  }}
>
  Back
</Button>
                  </div>
                </CardBody>
              )}
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={{ size: 9 }}>
            <h3>Comments: ({post ? post.comments.length : 0})</h3>

            {post &&
              post.comments.map((c, index) => (
                <Card className="mt-2 border-0" key={index}>
                  <CardBody>
                    <CardText>
                      <span style={{ position: "relative", fontSize: "15px" }}>
                        <span
                          style={{
                            position: "absolute",
                            left: "-12px",
                            top: "10",
                            content: "'\u00a0\u00a0\u00a0\u00a0'",
                            fontSize: "14px",
                            color: "black",
                          }}
                        >
                          &rarr;
                        </span>
                      </span>
                      {c.comment} by <b>{c.userName}</b>
                    </CardText>
                  </CardBody>
                </Card>
              ))}

            <Card className="mt-4 border-0">
              <CardBody>
                <Input
                  type="textarea"
                  rows={7}
                  placeholder="Add a comment........."
                  value={comment.comment}
                  onChange={(event) =>
                    setComment({ comment: event.target.value })
                  }
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={submitPost}
                    className="mt-2"
                    color="secondary"
                  >
                    Submit
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Share Button and Email Modal */}
            <div className="d-flex justify-content-between mt-3">
              {/* <Button color="link" onClick={toggleEmailModal}>
                <span role="img" aria-label="share">
                  📤
                </span>{" "}
                Share
              </Button> */}
              {/* <Button
                color="link"
                onClick={submitSavePost}
                disabled={isLoading || isSaved === null || isSaved}
              >
                {isLoading ? (
                  <>
                    <FaSave
                      size={20}
                      onClick={submitErrorPost}
                      style={{ color: "blue" }}
                    />{" "}
                    Saves
                  </>
                ) : isSaved ? (
                  <>
                    <FaSave size={20} /> Saved
                  </>
                ) : (
                  <>
                    <FaSave size={20} /> Save
                  </>
                )}
              </Button> */}
            </div>

            <Modal isOpen={isEmailModalOpen} toggle={toggleEmailModal}>
              <ModalHeader toggle={toggleEmailModal}>Enter Email</ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  placeholder="Enter email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <Button color="primary" onClick={addEmail}>
                  Add
                </Button>
                <ul>
                  {emailList.map((email, index) => (
                    <li key={index}>
                      {email}{" "}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => removeEmail(index)}
                      >
                        ❌
                      </span>
                    </li>
                  ))}
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={shareEmailtoFriend}>
                  Share
                </Button>{" "}
                <Button color="secondary" onClick={toggleEmailModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </Container>
    </Base>
  );
}

export default UserSavePage;
