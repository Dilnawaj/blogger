import React from "react";
import { Card, CardBody } from "reactstrap";
import Base from "../components/Base";
import { BASE_URL } from "../services/helper";

const About = () => {
  return (
    <Base>
      <div className="about-page">
        <div
          className="background-container"
          style={{
            backgroundImage: 'url("http://localhost:5000/post/image/background.png")',
            backgroundSize: "104% auto",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            position: "relative",
          }}
        >
          <div className="content-container">
            <h2>Welcome to BloggerHub!</h2>
            <p>
              We are a premier blogging platform designed to empower bloggers like
              you to create, share, and monetize your unique content. Our platform
              offers a range of exceptional features tailored to enhance your
              blogging experience and help you reach a wider audience.
            </p>

            <div className="features">
              <h3>Key Features:</h3>
              <Card>
                <CardBody>
                  <ul>
                    <li>
                      <span className="feature-title">User-Friendly Interface:</span>{" "}
                      Our intuitive and user-friendly interface makes it easy for
                      bloggers of all skill levels to create and manage their blogs.
                      You don't need any technical expertise or coding knowledge to
                      get started.
                    </li>
                    <li>
                      <span className="feature-title">Customization Options:</span>{" "}
                      Highlight the flexibility of your Blogger website, allowing
                      bloggers to customize the look and feel of their blogs.
                      Mention the availability of various templates, themes, and
                      layout options, enabling bloggers to create unique and
                      visually appealing blogs.
                    </li>

                    <li>
                      <span className="feature-title">Mobile Responsive Design:</span>{" "}
                      With the increasing number of mobile users, it's crucial to
                      have a website that looks great on any device. Our platform
                      ensures your blog is fully responsive, providing an optimal
                      viewing experience for your readers, whether they're on
                      desktop, tablet, or mobile.
                    </li>
                    <li>
                      <span className="feature-title">Strong Community and Support:</span>{" "}
                      Emphasize that your Blogger website fosters a strong community
                      of bloggers, offering a platform for networking and
                      collaboration. Mention the availability of forums, discussion
                      boards, and support resources where bloggers can connect with
                      fellow writers, share ideas, and seek assistance.
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </div>
            <div className="image-container mt-3 container text-center">
              <div className="image-wrapper">
                {/* Add your image component or content here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default About;
