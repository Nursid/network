import React from 'react';
import { Card, CardBody, Row, Col } from "reactstrap";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";

const Inventory = ({ data }) => {
  return (
    <Card className="shadow-sm" style={{ border: '1px solid #28a745', borderRadius: '8px' }}>
      <CardBody className="p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 text-center w-100">Inventory Details</h4>
          <BsIcons.BsPencil className="text-warning" style={{ fontSize: '18px' }} />
        </div>
        {/* Customer Information */}
        <div className="customer-details mb-4">
          <Row className="g-3">
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaMobile className="text-muted me-2" />
                <span className="text-muted">Inventory Name:</span>
                <span className="fw-semibold ms-2">{data?.inventory_name || 'Test'}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaMapMarkerAlt className="text-muted me-2" />
                <span className="text-muted">Inventory Quantity:</span>
                <span className="fw-semibold ms-2">{data?.inventory_quantity || '5'}</span>
              </div>
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};

export default Inventory; 