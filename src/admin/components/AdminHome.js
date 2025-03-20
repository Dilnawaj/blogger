import React from 'react'
import Base from '../../components/Base'
import { Col, Container, Row } from 'reactstrap'
import NewFeedBloggers from './NewFeedBloggers'
import { Category } from '@mui/icons-material'
import CategorySideMenuforBloggersFeed from './CategorySideMenuforBloggersFeed'

function AdminHome() {
  return (
   
     <Base>
  
    <Container className="mt-3">

      <Row>
        <Col md={2} className="pt-3">
          <CategorySideMenuforBloggersFeed/>
        </Col>
        <Col md={10}>
        <NewFeedBloggers/>
         
        
        </Col>
      </Row>
    </Container>
  </Base>
  )
}

export default AdminHome