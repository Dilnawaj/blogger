import React, { useState, useEffect } from "react";
import {
  deletePostService,
  loadAllPosts,
  loadAllPostsByUser,
  search,
  searchByUser,
} from "../services/PostService";

import { Col, Row, Container, Button } from "reactstrap";
import Post from "./UserPost";
import { toast } from "react-toastify";
import { FaArrowLeft, FaSearch, FaUndo } from "react-icons/fa";
import { doLogout, getCurrentUserDetail } from "../auth/Index";
import { useSpring, animated } from "react-spring";
import { getToken, isTokenExpired } from "../auth/Index";
import { useNavigate } from "react-router";
function NewFeedForUser() {
  
  const navigate = useNavigate();
  const pageSize = 10;
  const [postContent, setPostContent] = useState({
    totalElements: 0,
    content: [],
    totalPages: "",
    pageSize: "",
    lastPage: false,
    pageNumber: "",
  });
  const [countProps, setCountProps] = useSpring(() => ({
    number: 0,
    from: { number: 0 },
    to: { number: postContent.totalElements },
    config: { duration: 1500 },
  }));
  const [navigatingBack, setNavigatingBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const initialSortBy = localStorage.getItem("sortBy") || "newest";
  const [sortBy, setSortBy] = useState(initialSortBy);
  
  
  useEffect(() => {
    let key=getKeyword();
    let keyword=key!=null ?key:'';
    setSortBy(getSortBy());
    setKeyword(keyword);

    const urlParams = new URLSearchParams(window.location.search);
    const pageNumber = parseInt(urlParams.get("pageNumber")) || 0;
    setSortBy(getSortBy());
    setCurrentPage(pageNumber);
    setCurrentPageAndUpdateURL(pageNumber);

    if (keyword == '')
    {
      loadPostsByPage(pageNumber, sortBy);
    }
else
{
  searchKeyword(pageNumber);
}
   
    window.scrollTo(0, 0);
  }, [sortBy,currentPage]);


  useEffect(() => {
    setCountProps({ number: postContent.totalElements });
  }, [postContent.totalElements]);

  
  const getKeyword = () => {
    console.log("charger");
    console.log("charger ka keyword",keyword);
    // Check if 'keyword' is defined and not null
    if (typeof keyword !== 'undefined' && keyword !== null &&  keyword != '') {
      return keyword;
    }
  console.log("Checl url is");
   const urlParams = new URLSearchParams(window.location.search);
     let keywordData = urlParams.get("keyword");

    console.log("my keyword: " + keywordData);
  
    if (!keywordData || keywordData === ''||keywordData=='null') {
      keywordData = null; // Set it to null if it's null, empty, or undefined
    }
  
    console.log("my keyword: " + keywordData);
  
    // If 'keyword' is still null or empty, return 'keywordData' if it's not null, otherwise return null
    if (keyword === null || keyword === '') {
      if (keywordData !== null) {
        return keywordData;
      }
      return null;
    }
  
    return keywordData;
  };
  const getSortBy = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let sortBy = urlParams.get("sortBy");
  
    if (!sortBy) {
      sortBy = 'newest'; // Set it to 'newest' if it's null, empty, or undefined
    }
  
    return sortBy;
  };
  function handleLoadMore() {
    setIsLoading(true); // Set isLoading to true before fetching new posts
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    if (keyword.trim() === "") {
      loadPostsByPage(nextPage, sortBy);
    } else {
      searchKeyword(nextPage);
    }

    updateURLWithPage(nextPage); // Update the URL with the new page number

    setCurrentPage(nextPage); // Update the currentPage state
    window.scrollTo(0, 0);
  }

  function loadPostsByPage(pageNumber, sortBy) {
    const urlParams = new URLSearchParams(window.location.search);
    const pageNumberHere = parseInt(urlParams.get("pageNumber")) || 0;
    if (keyword.trim() !== "") {
      return;
    }
    if (pageNumber === pageNumberHere && sortBy===getSortBy()) {
      loadAllPostsByUser(
        getCurrentUserDetail()?.id,
        pageNumber,
        pageSize,
        sortBy
      )
        .then((data) => {
          setPostContent((prevPostContent) => ({
            ...prevPostContent,
            ...data,
          }));
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  }
  function resetPostsByPage(pageNumber, sortBy) {
    setSortBy("newest");
    setCurrentPageAndUpdateURL(pageNumber);
    loadAllPostsByUser(getCurrentUserDetail()?.id, 0, pageSize, sortBy)
      .then((data) => {
        setPostContent((prevPostContent) => ({
          ...prevPostContent,
          ...data,
        }));
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }
  function updateURLWithPage(pageNumber) {
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("pageNumber", pageNumber);
    window.history.pushState({ path: newURL.href }, "", newURL.href);
  }
  const handleReset = () => {
    console.log("hey");
    setKeyword("");
    setSortBy("newest");
    handleKeywordChange("");
    handleSortChange("newest");
    console.log("bey", sortBy);
    // const urlParams = new URLSearchParams(window.location.search);
    // // Call your API reset function here...
    // const pageNumberHere = parseInt(urlParams.get("pageNumber")) || 0;

    resetPostsByPage(0, "newest");
    updateURLWithPageAndSortAndKeyword(0, "newest", null);
  };

  function handlePrevious() {
    if (navigatingBack) {
      // If navigating back from a post, don't load data again
      setNavigatingBack(false); // Reset navigatingBack state
      return;
    }

    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    updateURLWithPage(newPage);
  }
  // function search() {
  //   setKeyword("")
  //       // Update the API call to include the `sortBy` parameter
  //       loadAllPosts(currentPage, pageSize, sortBy)
  //       .then((data) => {
  //         setPostContent((prevPostContent) => ({
  //           ...prevPostContent,
  //           ...data,
  //         }));
  //         setIsLoading(false);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setIsLoading(false);
  //       });
  //    }

  function setCurrentPageAndUpdateURL(pageNumber) {
    setCurrentPage(pageNumber);
    updateURLWithPage(pageNumber);
  }
  function searchKeyword(pageNumber = 0) {
    console.log("yaha koi dikkat hai kya")
    let key=getKeyword();
    let keyword=key!=null ?key :'';
    console.log('Gulafsha');
    setKeyword(keyword);
    console.log("krrishna",keyword);
    if (!keyword) {
      return;
    }
    updateURLWithPageAndSortAndKeyword(pageNumber, sortBy,keyword);
    // Update the API call to include the `sortBy` parameter
    searchByUser(keyword, pageNumber, pageSize, sortBy)
      .then((data) => {
        console.log("data is", ...data.content);
        setPostContent(data);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error("Error in loading post");
      });
  }

  function handleKeywordChange(e) {
    setKeyword(e);
  }

  function handleSearch(e) {
    e.preventDefault();
    console.log("Searching for:", keyword);
    setCurrentPageAndUpdateURL(0);
    searchKeyword(0);
  }
  function updateURLWithPageAndSort(pageNumber, sortValue) {
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("pageNumber", pageNumber);
    newURL.searchParams.set("sortBy", sortValue);
    window.history.pushState({ path: newURL.href }, "", newURL.href);
  }
  function updateURLWithPageAndSortAndKeyword(pageNumber, sortValue,keyword) {
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("pageNumber", pageNumber);
    newURL.searchParams.set("sortBy", sortValue);
    newURL.searchParams.set("keyword", keyword);
    window.history.pushState({ path: newURL.href }, "", newURL.href);
  }
  function handleSortChange(e) {
    const selectedSortBy = e;
    setSortBy(selectedSortBy);
    setCurrentPage(0); // Reset to the first page when changing sorting
    updateURLWithPageAndSort(0, selectedSortBy);
    setIsLoading(true);
    setPostContent({
      totalElements: 0,
      content: [],
      totalPages: "",
      pageSize: "",
      lastPage: false,
      pageNumber: "",
    });
  }

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

  return (
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
      <Row className="align-items-center">
        <Col>
          {currentPage > 0 && (
            <Button
              color="secondary"
              style={{ color: "white", textDecoration: "inherit" }}
              onClick={handlePrevious}
            >
              <FaArrowLeft /> Previous
            </Button>
          )}
        </Col>
        <Col md="auto"></Col>
        <Col></Col>
        <Col md="auto">
          <form onSubmit={handleSearch}>
            <div className="search-container" style={{ marginBottom: "20px" }}>
              <input
                type="text"
                value={keyword}
                onChange={(e)=>handleKeywordChange(e.target.value)}
                placeholder="Search by Title & Content"
                style={{ width: "250px" }}
              />
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
              <span style={{ marginLeft: "5px" }}></span>
              <button
                type="button"
                className="reset-button"
                onClick={handleReset}
              >
                <FaUndo />
              </button>
            </div>
          </form>
        </Col>
      </Row>

      <Row>
        <Col md="auto"></Col>
        <Col></Col>
        <Col md="auto">
          <div style={{ marginBottom: "10px" }}>
            <span>Sort By: </span>
            <select value={sortBy} onChange={(e)=>handleSortChange(e.target.value)}>
              <option value="newest">New Posts</option>
              <option value="oldest">Old Posts</option>

              {/* Add more sorting options if needed */}
            </select>
          </div>
        </Col>

        <Col md={{ size: 12 }}>
          {isLoading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            postContent?.content.map((post) => (
              <Post deletePost={deletePost} post={post} key={post.id} />
            ))
          )}
        </Col>
      </Row>

      {!isLoading && !postContent.lastPage && (
        <Col md={{ size: 12 }} className="d-flex justify-content-center">
          <Button
            color="secondary"
            style={{ color: "white", textDecoration: "inherit" }}
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </Col>
      )}
    </div>
  );
}

export default NewFeedForUser;
