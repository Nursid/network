import React from 'react';
import { Card, CardBody, Row, Col } from "reactstrap";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";

const BillingDetails = ({ data }) => {
  return (
    <Card className="shadow-sm" style={{ border: '1px solid #28a745', borderRadius: '8px' }}>
      <CardBody className="p-4">
        {/* Header with Title and Edit Icon */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 text-center w-100">Billing & Service Details </h4>
          <BsIcons.BsPencil className="text-warning" style={{ fontSize: '18px' }} />
        </div>

        {/* Customer Information */}
        <div className="customer-details mb-4">
          <Row className="g-3">
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaUser className="text-muted me-2" />
                <span className="text-muted">Plan Name:</span>
                <span className="fw-semibold ms-2">{data?.customer_id || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaMobile className="text-muted me-2" />
                <span className="text-muted">Plan Amount:</span>
                <span className="fw-semibold ms-2">{data?.mobile || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaMapMarkerAlt className="text-muted me-2" />
                <span className="text-muted">Total Balance:</span>
                <span className="fw-semibold ms-2">{data?.area || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaBuilding className="text-muted me-2" />
                <span className="text-muted">Previous Recharge Balance:</span>
                <span className="fw-semibold ms-2">{data?.block || ''}</span>
              </div>
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
                <FaIcons.FaGenderless className="text-muted me-2" />
                <span className="text-muted">Other Charges:</span>
                <span className="fw-semibold ms-2">{data?.gender || ''}</span>
              </div>
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
                <FaIcons.FaHome className="text-muted me-2" />
                <span className="text-muted">Recharge Till :</span>
                <span className="fw-semibold ms-2">{data?.apartment || ''}</span>
              </div>  
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
                <FaIcons.FaHome className="text-muted me-2" />
                    <span className="text-muted">Paid Till :</span>
                <span className="fw-semibold ms-2">{data?.apartment || ''}</span>
              </div>  
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
                <FaIcons.FaHome className="text-muted me-2" />
                <span className="text-muted">Last Payment Date :</span>
                <span className="fw-semibold ms-2">{data?.apartment || ''}</span>
              </div>  
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
                <FaIcons.FaHome className="text-muted me-2" />
                <span className="text-muted">Last Payment Amount :</span>
                <span className="fw-semibold ms-2">{data?.apartment || ''}</span>
              </div>  
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};

export default BillingDetails;