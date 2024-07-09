import React from 'react'
import { Col, Container, Row } from "reactstrap";
import Base from "../components/Base";
import CategorySideMenu from "../components/CategorySideMenu";
import SaveFeedForUser from './SaveFeedForUser';
import SaveCategorySideMenu from './SaveCategorySideMenu';

function SaveFeed() {
  return (
    <Base>
    <Container className="mt-3">
      <Row>
        <Col md={2} className="pt-3">
          <SaveCategorySideMenu/>
          
        </Col>
        <Col md={10}>
          <SaveFeedForUser />
        </Col>
      </Row>
    </Container>
  </Base>
  )
}

export default SaveFeed