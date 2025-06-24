import React from 'react';
import { Card, CardHeader, Row, Col, Button } from "reactstrap";
import * as FaIcons from "react-icons/fa";

const CustomerHeader = ({ toggleModal }) => {
  return (
    <Card className="mb-4 border-0 shadow-sm">
      <CardHeader className="bg-white border-0 py-3">
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center">
              <div className="header-icon me-3">
                <FaIcons.FaUser className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="mb-0 text-dark fw-bold">Customer Profile</h4>
                <p className="mb-0 text-muted small">Complete customer information overview</p>
              </div>
            </div>
          </Col>
          <Col md={4} className="text-end">
            <Button 
              color="outline-secondary" 
              size="sm" 
              onClick={toggleModal}
              className="border-0"
            >
              <FaIcons.FaTimes className="me-1" />
              Close
            </Button>
          </Col>
        </Row>
      </CardHeader>
    </Card>
  );
};

export default CustomerHeader; 