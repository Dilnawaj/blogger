import { Col, Container, Row } from "reactstrap";
import Base from "../components/Base";
import NewFeedForUser from "../components/NewFeedForUser";
import CategorySideMenu from "../components/CategorySideMenu";

import React from "react";
import NewFeed from "../components/NewFeed";

function UserFeed() {
  return (
    <Base>
      <Container className="mt-3">
        <Row>
          <Col md={2} className="pt-3">
            <CategorySideMenu />
          </Col>
          <Col md={10}>
            <NewFeedForUser />
          </Col>
        </Row>
      </Container>
    </Base>
  );
}

export default UserFeed;
