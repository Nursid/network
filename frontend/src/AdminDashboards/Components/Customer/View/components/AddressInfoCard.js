import React from 'react';
import { Card, CardBody, CardHeader, Row, Col } from "reactstrap";
import * as FaIcons from "react-icons/fa";

const AddressInfoCard = ({ data }) => {
  const AddressField = ({ label, value }) => (
    <div className="address-field mb-3">
      <div className="address-label">{label}</div>
      <div className="address-value">{value || 'N/A'}</div>
    </div>
  );

  return (
    <Card className="border-0 shadow-sm h-100">
      <CardHeader className="bg-light border-0 py-3">
        <div className="d-flex align-items-center">
          <FaIcons.FaMapMarkerAlt className="text-danger me-2" size={18} />
          <h6 className="mb-0 fw-semibold">Address Information</h6>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <AddressField
          label="Permanent Address"
          value={data?.address}
        />
        <AddressField
          label="Temporary Address"
          value={data?.t_address || 'Same as permanent'}
        />
        
        <Row className="mt-3">
          <Col md={4}>
            <AddressField
              label="Area"
              value={data?.area}
            />
          </Col>
          <Col md={4}>
            <AddressField
              label="Block"
              value={data?.block}
            />
          </Col>
          <Col md={4}>
            <AddressField
              label="Apartment"
              value={data?.apartment}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default AddressInfoCard; 