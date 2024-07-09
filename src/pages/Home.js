import { Col, Container, Row } from "reactstrap";
import Base from "../components/Base";
import NewFeedForUser from "../components/NewFeedForUser";
import CategorySideMenu from "../components/CategorySideMenu";
import NewFeed from "../components/NewFeed";
import CategorySideMenuforNewFeed from "../components/CategorySideMenuforNewFeed";

const Home = () => {
  return (
    <Base>
  
      <Container className="mt-3">

        <Row>
          <Col md={2} className="pt-3">
            <CategorySideMenuforNewFeed/>
            
          </Col>
          <Col md={10}>
            <NewFeed/>
          {/* <NewFeedForUser/> */}
          </Col>
        </Row>
      </Container>
    </Base>
  );
};
export default Home;
