import React, { useEffect, useState, useRef, useMemo } from "react";
import Base from "../components/Base";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router";
import UserContext from "../context/userContext";
import { getCurrentUserDetail, isLoggedIn } from "../auth/Index";
import {
  loadPost,
  updatePosts,
  uploadPostImage,
} from "../services/PostService";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import JoditEditor from "jodit-react";
import { loadAllCategories } from "../services/CategoryServices";
function UpdateBlog() {
  const { blogId } = useParams();
  const editor = useRef(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(0);
  const [post, setPost] = useState(null);
    const { sortBy } = useParams();
    const { postId } = useParams();
    const { type } = useParams();
    const { pageNumber } = useParams();
    const { keyword } = useParams();
  const [resetPost, setResetPost] = useState(null);
  useEffect(() => {
    console.log("Post", post);
    
    if (post !== null) {
      console.log("Current User", getCurrentUserDetail().id);
      console.log("post Id", post.user.id);

      if (isLoggedIn() && getCurrentUserDetail().id !== post.user.id) {
        toast.error("This is not your post!!");
        navigate("/home");
      }
    }
  }, [post]);
  const handleGoBack = () => {
    const currentUrl = window.location.pathname;
       // Get dynamic values from state or props (assumed to be available in the component)
       const currentPageNumber = pageNumber; // or get from state/props
       const currentSortBy = sortBy; // or get from state/props
       const currentKeyword = keyword; // or get from state/props
       localStorage.setItem("sortBy", currentSortBy);
       localStorage.setItem("pageNumber", currentPageNumber);
       localStorage.setItem("keyword", currentKeyword);
     
    console.log("Current URL", `/user/Feed?pageNumber=${pageNumber}&keyword=${currentKeyword}`);
    //  window.location.reload();
    if(type==="home")
    {
      navigate(`/home?pageNumber=${currentPageNumber}&sortBy=${currentSortBy}&keyword=${currentKeyword}`);
     
    } else if(type==="save"){
      navigate(`/user/save`);
    }
    else{
      navigate(`/user/Feed?pageNumber=${pageNumber}&sortBy=${sortBy}&keyword=${currentKeyword}`);
    }
   
    //window.location.reload();
  };
  useEffect(() => {
    console.log("POST", post);
    loadPost(blogId)
      .then((data) => {
        console.log("Data", data);
        setPost({ ...data, category: data.category });
        setResetPost({ ...data });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error in loading blog");
        navigate("/home");
      });
    console.log("Category data", category);
  }, [blogId]);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      height: "400px", // Specify the desired height here
    }),
    []
  );
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      console.log(file);
      setImage(file);
    } else {
      toast.error("Invalid file type. Please select an image.");
      console.log("Invalid file type. Please select an image.");
      // Optionally, you can display an error message to the user
    }
  };
  const updatePost = (event) => {
    event.preventDefault();
    console.log(post);

    updatePosts({ ...post, category: post.category }, post.postId)
      .then((res) => {
        console.log(res);
        toast.success("Post updated successfully");
if(image!=null)
{
 uploadPostImage(image, post.postId)
          .then((data) => {})
          .catch((error) => {});
}
       
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error in updating post");
      });
      handleGoBack();
  };

  useEffect(() => {
    loadAllCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const resetForm = () => {
    console.log("kyu nhi chl rha");
    setPost({ ...post, title: resetPost.title, content: resetPost.content ,category: resetPost.category  });
    console.log("Bs chl gya bhai");
  };

  const handleChange = (event, fieldName) => {
    if (fieldName === "categoryId") {
      const selectedCategoryId = event.target.value;
      setCategory(selectedCategoryId);
      setPost({
        ...post,
        category: {
          ...post.category,
          categoryId: selectedCategoryId, // Update nested categoryId directly
        },
      });
    } else {
      setPost({
        ...post,
        [fieldName]: event.target.value,
      });
    }
  };

  const updateHtml = () => {
    return (
      <div className="body">
        <Card className="shadow-md">
          <CardBody>
            <h3>Update post from here!!</h3>
            <Form onSubmit={updatePost}>
              
              <div className="my-3">
                <Label for="title">Post Title</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Enter title here "
                  className="rounded-0"
                  name="title"
                  value={post.title}
                  onChange={(event) => handleChange(event, "title")}
                />
              </div>
              <div className="my-3">
                <Label for="content">Post Content</Label>
                <JoditEditor
                  ref={editor}
                  value={post.content}
                  config={config}
                  onChange={(newContent) =>
                    setPost({ ...post, content: newContent })
                  }
                />
              </div>

              <div className="mt-3">
                <Label for="image">Select post banner:</Label>
                <Input id="image" type="file" onChange={handleFileChange} />
              </div>
              <div className="my-6">
                <Label for="category">Post Category :</Label>
                &nbsp; &nbsp;
                <Input
                  type="select"
                  id="category"
                  className="rounded-0"
                  name="categoryId"
                  onChange={(event) => handleChange(event, "categoryId")}
                  value={post.category?.categoryId || 0} // Handle initial state gracefully
                >
                  <option disabled value={0}>
                    --Select category--
                  </option>
                  {categories.map((category) => (
                    <option
                      value={category.categoryId}
                      key={category.categoryId}
                    >
                      {category.categoryTitle}
                    </option>
                  ))}
                </Input>
              </div>

              <Container className="text-center">
                <Button type="submit" color="primary">
                  Update Post
                </Button>

                <span style={{ margin: "0 8px" }}></span>

                <Button className="ms-2" color="danger" onClick={resetForm}>
                  Rest Content
                </Button>
              </Container>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  };

  return (
    <Base>
      <Container>{post != null && updateHtml()}</Container>
    </Base>
  );
}

export default UpdateBlog;
