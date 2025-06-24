import React from 'react';
import { Card, CardBody, CardHeader, Row, Col } from "reactstrap";
import * as BsIcons from "react-icons/bs";
import moment from "moment";

const BasicInfoCard = ({ data }) => {
  // Helper function to format date
  const formatDate = (date) => {
    return date ? moment(date).format('DD MMM YYYY') : 'N/A';
  };

  const InfoField = ({ label, value, icon }) => (
    <div className="info-field mb-3">
      <div className="info-label">
        {icon && <span className="me-2">{icon}</span>}
        {label}
      </div>
      <div className="info-value">{value || 'N/A'}</div>
    </div>
  );

  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardHeader className="bg-light border-0 py-3">
        <div className="d-flex align-items-center">
          <BsIcons.BsPersonFill className="text-primary me-2" size={20} />
          <h6 className="mb-0 fw-semibold">Basic Information</h6>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <Row>
          <Col md={6}>
            <InfoField 
              label="Full Name" 
              value={data?.name}
            />
          </Col>
          <Col md={6}>
            <InfoField 
              label="Username" 
              value={data?.username ? `@${data.username}` : 'N/A'}
            />
          </Col>
          <Col md={6}>
            <InfoField 
              label="Email Address" 
              value={data?.email}
            />
          </Col>
          <Col md={6}>
            <InfoField 
              label="Gender" 
              value={data?.gender}
            />
          </Col>
          <Col md={6}>
            <InfoField 
              label="Date of Birth" 
              value={formatDate(data?.dob)}
            />
          </Col>
          <Col md={6}>
            <InfoField 
              label="Anniversary Date" 
              value={formatDate(data?.doa)}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default BasicInfoCard; 