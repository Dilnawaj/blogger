import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardText } from "reactstrap";
import { getCurrentUserDetail, isLoggedIn } from "../auth/Index";
import { unSavePost } from "../services/PostService";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
function Post({
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
    // const urlParams = new URLSearchParams(window.location.search);
    // const pageNumberFromURL = parseInt(urlParams.get("pageNumber")) ;
    // setPageNumber(pageNumberFromURL);
    // console.log("DIl ka param",  pageNumberFromURL)
    setUser(getCurrentUserDetail());
    setLogin(isLoggedIn());
  }, []);

  const getPageNumber = () => {
    // Replace this with logic to get the current page number from state or props
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get("pageNumber"));
  };


  
  const getKeyword = () => {
    console.log("Keyword")
    // Replace this with logic to get the current page number from state or props
    const urlParams = new URLSearchParams(window.location.search);
    console.log("Parse Int",urlParams.get("keyword"))
   let keywords=urlParams.get("keyword");

    if (!keywords) {
      keywords = null; // Set it to 'newest' if it's null, empty, or undefined
    }
  
    return keywords;


  };
  const getSortBy = () => {
    console.log("Sort")
    const urlParams = new URLSearchParams(window.location.search);
    let sortBy = urlParams.get("sortBy");
    console.log("Sortest",sortBy)
    if (!sortBy) {
      sortBy = 'newest'; // Set it to 'newest' if it's null, empty, or undefined
    }
    console.log("Sortested",sortBy)
    return sortBy;
  };
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
            to={`/posts/${post.postId}/pageNumber/${getPageNumber()}/sortBy/${getSortBy()}/keyword/${getKeyword()}`}
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

export default Post;
