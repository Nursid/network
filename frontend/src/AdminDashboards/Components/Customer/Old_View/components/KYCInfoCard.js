import React from 'react';
import { Card, CardBody, CardHeader, Row, Col } from "reactstrap";
import * as FaIcons from "react-icons/fa";

const KYCInfoCard = ({ data }) => {
  const KYCField = ({ label, value }) => (
    <div className="kyc-field mb-3">
      <div className="kyc-label">{label}</div>
      <div className="kyc-value">{value || 'N/A'}</div>
    </div>
  );

  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardHeader className="bg-light border-0 py-3">
        <div className="d-flex align-items-center">
          <FaIcons.FaIdCard className="text-primary me-2" size={18} />
          <h6 className="mb-0 fw-semibold">KYC Information</h6>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <Row>
          <Col md={4}>
            <KYCField
              label="Aadhar Number"
              value={data?.aadhar_no}
            />
          </Col>
          <Col md={4}>
            <KYCField
              label="PAN Number"
              value={data?.pan_no}
            />
          </Col>
          <Col md={4}>
            <KYCField
              label="Other ID"
              value={data?.other_id}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default KYCInfoCard; 