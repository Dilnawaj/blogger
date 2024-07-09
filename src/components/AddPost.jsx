import React, { useEffect, useState, useRef, useMemo } from "react";
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
import { loadAllCategories } from "../services/CategoryServices";
import JoditEditor from "jodit-react";

import {
  createPost as doCreatePost,
  uploadPostImage,
} from "../services/PostService";
import { getCurrentUserDetail } from "../auth/Index";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {isTokenExpired ,getToken} from "../auth/Index";
const AddPost = () => {
  const [categories, setCategories] = useState([]);
  const editor = useRef(null);
  const [user, setUser] = useState(undefined);
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState(0);
  const [post, setPost] = useState({
    title: "",
    content: "",
    categoryId: "0",
  });

  const [image, setImage] = useState(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing...",
      height: "400px", // Specify the desired height here
    }),
    []
  );

  const fieldChanged = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const contentFieldChanged = (data) => {
    setPost({ ...post, content: data });
  };

  const createPost = (event) => {
    let tempCategory=10;
console.log("Category",category)
console.log("POst Category",post.categoryId)
setCategory(tempCategory);
console.log("Category",category)
    event.preventDefault();
    const accessToken =getToken();
    if (isTokenExpired(accessToken)) {
      toast.error("Session expired");
      navigate("/login");
     return;
    }

    if (post.title.trim() === "") {
      toast.error("Post title is required!!");
      return;
    }
    if (post.content === "") {
      toast.error("Content is required!!");
      return;
    }
    if (post.categoryId === null || post.categoryId==0) {
      toast.error("Select a category");
      return;
    }
    post.userId = user.id;

    // Submit form to the server
    doCreatePost(post)
      .then((data) => {
        console.log("image", image);
    
        uploadPostImage(image, data.postId)
          .then((data) => {
           
          })
          .catch((error) => {
           
          });
          toast.success("Post published successfully");
        resetForm();
      })
      .catch((error) => {
        toast.error("Error creating post", error);
        navigate("/userFeed");
      });
  };
  const resetForm = () => {
    setPost({
      title: "",
      content: "",
      categoryId: 0,
    });
    setContent("");
    setCategory(0);
  };
  useEffect(() => {
    setUser(getCurrentUserDetail());

    loadAllCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //handling file change event
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

  return (
    <div className="body">
      <Card className="shadow-md">
        <CardBody>
          <h3>Whats going in your mind??</h3>
          <Form onSubmit={createPost}>
            <div className="my-3">
              <Label for="title">Post Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Enter title here "
                className="rounded-0"
                name="title"
                value={post.title}
                onChange={fieldChanged}
              />
            </div>
            <div className="my-3">
              <Label for="content">Post Content</Label>
              <JoditEditor
                ref={editor}
                value={post.content}
                config={config}
                onChange={contentFieldChanged}
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
                placeholder="Enter here"
                className="rounded-0"
                name="categoryId"
                onChange={fieldChanged}
                value={post.categoryId} // Update to use post.categoryId instead of category
                
              >
                <option disabled value={0}>
                  --Select category--
                </option>
                {categories.map((category) => (
                  <option value={category.categoryId} key={category.categoryId}>
                    {category.categoryTitle}
                  </option>
                ))}
              </Input>
            </div>

            <Container className="text-center">
              <Button type="submit" color="primary">
                Publish Post
              </Button>

              <span style={{ margin: "0 8px" }}></span>

              <Button className="ms-2" color="danger">
                Rest Content
              </Button>
           
            </Container>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddPost;
