import React from 'react';
import { Card, CardBody, CardHeader, Badge } from "reactstrap";
import * as FaIcons from "react-icons/fa";

const PackageInfoCard = ({ data }) => {
  const InfoField = ({ label, value }) => (
    <div className="package-field mb-3">
      <div className="package-label">{label}</div>
      <div className="package-value">{value}</div>
    </div>
  );

  return (
    <Card className="border-0 shadow-sm h-100">
      <CardHeader className="bg-light border-0 py-3">
        <div className="d-flex align-items-center">
          <FaIcons.FaBox className="text-warning me-2" size={18} />
          <h6 className="mb-0 fw-semibold">Package Information</h6>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <InfoField
          label="Selected Package"
          value={
            data?.selectedPackage ? (
              <Badge color="primary" className="package-badge">
                Package ID: {data.selectedPackage}
              </Badge>
            ) : (
              <span className="text-muted">No package selected</span>
            )
          }
        />
        <InfoField
          label="Package Details"
          value={
            <div className="package-details">
              {data?.packageDetails || (
                <span className="text-muted">No additional details</span>
              )}
            </div>
          }
        />
      </CardBody>
    </Card>
  );
};

export default PackageInfoCard; 