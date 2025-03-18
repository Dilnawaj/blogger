
import React from "react";
import Base from "../components/Base";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import NewFeed from "../components/NewFeed";
import CategorySideMenu from "../components/CategorySideMenu";
import {
  loadPostCategoryAndUserWise,
  loadPostCategoryWise,
} from "../services/PostService";
import { toast } from "react-toastify";
import Post from "../components/PostByCategory";
import { useState } from "react";
import { getCurrentUserDetail } from "../auth/Index";
import CategorySideMenuforNewFeed from "../components/CategorySideMenuforNewFeed";

function Categorie() {
    const { categoryId } = useParams();

    const [posts, setPosts] = useState([]); // Corrected line
  
    useEffect(() => {
      console.log("ID is", categoryId);
    
        console.log("ID is", categoryId);
        loadPostCategoryWise(categoryId)
          .then((data) => {
            setPosts([...data]);
          })
          .catch((error) => {
            console.log(error);
            toast.error("error in loading posts");
          });
      
    }, [categoryId]);
  
  return (
    <Base>
      <Container className="mt-3">
        <Row>
          <Col md={2} className="pt-3">
            <CategorySideMenuforNewFeed/>
          </Col>
          <Col md={10}>
            <h1>Blogs Counts: ( {posts.length} )</h1>

            {posts && posts.length > 0 ? (
              posts.map((post, index) => {
                return <Post key={index} post={post} />;
              })
            ) : (
              <div style={{ textAlign: "center" }}>
              <h1 style={{ color: "#4B4B4B" }}> {/* Dark grey color */}
                ⚠️  No post in this category !!
              </h1>
            </div>
            
            )}
          </Col>
        </Row>
      </Container>
    </Base>
  )
}

export default Categorie