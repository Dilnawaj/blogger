import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardText } from "reactstrap";
import { getCurrentUserDetail, isLoggedIn } from "../auth/Index";
import { unSavePost } from "../services/PostService";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
function PostSave({
  post = {
    postId: 0,
    title: "This is the default post title",
    content: "This is the default content",
  },
  deletePost,
}) {
  const currentPath = window.location.pathname;
  const containsKeyword = currentPath.includes("saveFeed");
  const formattedContent = post.content.replace(/ {2,}/g, " ");
  const truncatedContent =
    formattedContent.length > 500
      ? formattedContent.substring(0, 500) + "..."
      : formattedContent;
  const [login, setLogin] = useState(null);
  const [user, setUser] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  useEffect(() => {

    console.log("Bebo")
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('categorie'); // categoryId will be '2'
    console.log("Category bhai",categoryId)
    // const urlParams = new URLSearchParams(window.location.search);
    // const pageNumberFromURL = parseInt(urlParams.get("pageNumber")) ;
    // setPageNumber(pageNumberFromURL);
    // console.log("DIl ka param",  pageNumberFromURL)
    setUser(getCurrentUserDetail());
    setLogin(isLoggedIn());
  }, []);


  const unsavePostOfUser = () => {
    if (!isLoggedIn()) {
      toast.error("Need to login first!!");
      return;
    }

    unSavePost(post.postId, user.id)
      .then((data) => {
        console.log("bebo", data);
        toast.success("Post unSaved successfully");
        window.location.href = window.location.href;
      })
      .catch((error) => {
        console.log(error);
        toast.error("This post is already unSaved");
      });
  };

  return (
    <Card className="border-0 shadow-sm mb-3">
      <CardBody>
        <h2 className="mb-4">{post.title}</h2>
        <CardText dangerouslySetInnerHTML={{ __html: truncatedContent }} />

        <div className="text-center">
          <Link
            className="btn btn-secondary mr-2"
            to={`/user/saved/${post.postId}/categorie/${post.category.categoryId}`}
          >
            Read More
          </Link>

          {containsKeyword && (
            <Button onClick={unsavePostOfUser} color="info">
              Remove
            </Button>
          )}
          {isLoggedIn() && getCurrentUserDetail().id === post.user.id && (
            <>
              &nbsp;&nbsp;
              <Button onClick={() => deletePost(post)} color="danger">
                Delete
              </Button>
              &nbsp;&nbsp;
              <Button
                tag={Link}
                to={`/user/updateblog/${post.postId}`}
                color="warning"
              >
                Update
              </Button>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default PostSave;
