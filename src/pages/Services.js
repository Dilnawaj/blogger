import React, { useContext } from "react";
import UserContext from "../context/userContext";

import { BASE_URL } from "../services/helper";
import Base from "../components/Base";
import { Card, CardBody } from "reactstrap";

const Services = () => {
  const user = useContext(UserContext);

  return (
    <Base>
      <div
        className="about-page"
        style={{
          backgroundImage:
            'url("http://localhost:5000/post/image/background.png")',
          backgroundSize: "104% auto", // Increase the left side length
          backgroundPosition: "left center", // Align the image to the left side
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
      >
        <h2> Our Top Services for Bloggers.</h2>
        <p>
          BloggerHub aims to provide a user-friendly interface for bloggers,
          offering the ability to create and read posts while also providing
          monetization opportunities. Our platform offers a diverse range of
          exceptional features designed to enhance your blogging experience and
          help you maximize your earnings.
        </p>

        <div className="features">
          <h3>Salient Features:</h3>
          <Card>
            <CardBody>
              <ul>
                <li>
                  <span className="feature-title">Customize Category:</span> We
                  offer a customizable feature that allows you to add a custom
                  category of your choice.
                </li>
                <li>
                  <span className="feature-title">Easily Add Post Images:</span>{" "}
                  Our unique feature allows bloggers to effortlessly include
                  images in their posts.
                </li>
                <li>
                  <span className="feature-title">Secure:</span> We enhance
                  Blogger security by implementing token-based authentication.
                </li>
                <li>
                  <span className="feature-title">Cutomer Care Support:</span>{" "}
                  We have a strong community and support system in place. If
                  users have any feedback or suggestions, they can utilize our
                  Help Center to submit their queries.
                </li>
                <li>
                  <span className="feature-title">
                    Engaging Blogging Experience:
                  </span>{" "}
                  Bloggers can effortlessly create and publish their own posts,
                  while also accessing a diverse array of captivating content
                  from fellow bloggers.
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
        
      </div>
    </Base>
  );
};

export default Services;
