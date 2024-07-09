import React, { useState, useEffect } from "react";
import {
  deletePostService,
  loadAllPosts,
  loadAllPostsByUser,
  savePosts,
} from "../services/PostService";
import { useSpring, animated } from "react-spring";
import { Col, Row, Container } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { getCurrentUserDetail } from "../auth/Index";
import ContextUserProvider from "../context/ContextUserProvider";
import Post from "../components/Post";
import PostSaveByCategory from "../components/PostSave";

function SaveFeedForUser() {
  const navigate = useNavigate();

  const [postContent, setPostContent] = useState({
    totalElements: 0,
    content: [],
    totalPages: "",
    pageSize: "",
    lastPage: false,
    pageNumber: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    changePage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (typeof getCurrentUserDetail() !== "undefined") {
   
    savePosts(getCurrentUserDetail().id, 0, 5)
      .then((data) => {
        setPostContent(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    }
  }, []);

  const changePage = (pageNumber = 0, pageSize = 5) => {
    if (pageNumber > postContent.pageNumber && postContent.lastPage) {
      return;
    }
    if (pageNumber < postContent.pageNumber && postContent.pageNumber === 0) {
      return;
    }
    if (typeof getCurrentUserDetail() !== "undefined") {
    savePosts(getCurrentUserDetail().id, pageNumber, pageSize)
      .then((data) => {
        setPostContent({
          content: [...postContent.content, ...data.content],
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          pageSize: data.pageSize,
          lastPage: data.lastPage,
          pageNumber: data.pageNumber,
        });
       
      })
      .catch((error) => {
        toast.error("Error in loading post");
      });
    }
  };

  const [countProps, setCountProps] = useSpring(() => ({
    number: 0,
    from: { number: 0 },
    to: { number: postContent.totalElements },
    config: { duration: 1500 },
  }));

  useEffect(() => {
    setCountProps({ number: postContent.totalElements });
  }, [postContent.totalElements]);

  function deletePost(post) {
    deletePostService(post.postId)
      .then((res) => {
        console.log(res);
        toast.success("Post deleted successfully.");

        let newPostContent = postContent.content.filter(
          (p) => p.postId !== post.postId
        );
        setPostContent({
          ...postContent,
          content: newPostContent,
          totalElements: postContent.totalElements - 1,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error in deleting post");
      });
  }

  const changePageInfinite = () => {
    console.log("page changed");
    setCurrentPage(currentPage + 1);
  };
  const userName = "User Feed";
  return (
    <ContextUserProvider userName={userName}>
      <div className="container-fluid">
        <Row className="align-items-center">
          <Col md="auto">
            <h1 className="blogs-count-heading">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blogs Count:</h1>
          </Col>
          <Col>
            <animated.h1 className="animated-count">
              {countProps.number.interpolate((value) => value.toFixed(0))}
            </animated.h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 12 }}>
            <InfiniteScroll
              dataLength={postContent.content.length}
              next={changePageInfinite}
              hasMore={!postContent.lastPage}
            >
              {isLoading ? (
                <div className="loader-container">
                  <div className="loader"></div>
                </div>
              ) : (
                postContent?.content.map((post) => (
                  <PostSaveByCategory deletePost={deletePost} post={post} key={post.id} />
                ))
              )}
            </InfiniteScroll>
          </Col>
        </Row>
      </div>
    </ContextUserProvider>
  );
}

export default SaveFeedForUser;
