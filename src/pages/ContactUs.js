import React from "react";
import { Card, CardBody } from "reactstrap";
import Base from "../components/Base";

const ContactUs = () => {
  return (
    <Base>
      <div
        className="contact-page"
        style={{
          backgroundImage:
            'url("http://localhost:5000/post/image/background.png")',
          backgroundSize: "104% auto", // Increase the left side length
          backgroundPosition: "left center", // Align the image to the left side
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
      >
        <h2>Contact Admin</h2>
        <p>
          If you have any questions, suggestions, or concerns regarding our Blogger website, please feel free to reach out to the website admin. We value your feedback and are here to assist you.
        </p>

        <div className="contact-info">
          <Card>
            <CardBody>
              <ul>
                <li>
                  <span className="contact-title">Email:</span>{" "}
                  <span className="contact-detail">officialbloggerhub@gmail.com</span>
                </li>
                <li>
                  <span className="contact-title">Phone:</span>{" "}
                  <span className="contact-detail">+91 8837672536</span>
                </li>
                <li>
                  <span className="contact-title">Address:</span>{" "}
                  <span className="contact-detail">Near S.M.L isuzu, Ropar, Punjab,India 140001</span>
                </li>
                <li>
                  <span className="contact-title">Working Hours:</span>{" "}
                  <span className="contact-detail">Monday-Friday: 9am-11pm</span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </Base>
  );
};

export default ContactUs;
