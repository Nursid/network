import React from 'react';
import { Card, CardBody, CardHeader, Row, Col } from "reactstrap";
import * as FaIcons from "react-icons/fa";
import { IMG_URL } from "../../../../../config";

const DocumentsCard = ({ data }) => {
  // Helper function to display document image
  const DocumentImage = ({ src, alt, title }) => {
    if (!src) {
      return (
        <div className="document-placeholder">
          <FaIcons.FaFileImage className="text-muted" size={30} />
          <div className="placeholder-text">Not uploaded</div>
        </div>
      );
    }
    
    return (
      <div className="document-preview">
        <img
          src={IMG_URL + src}
          alt={alt}
          className="document-image"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div className="document-error" style={{ display: 'none' }}>
          <FaIcons.FaExclamationTriangle className="text-warning" />
          <small>Image not found</small>
        </div>
      </div>
    );
  };

  const DocumentItem = ({ title, src, alt }) => (
    <Col lg={2} md={4} sm={6} className="mb-4">
      <div className="document-item">
        <div className="document-title mb-2">{title}</div>
        <DocumentImage src={src} alt={alt} title={title} />
      </div>
    </Col>
  );

  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardHeader className="bg-light border-0 py-3">
        <div className="d-flex align-items-center">
          <FaIcons.FaFileImage className="text-info me-2" size={18} />
          <h6 className="mb-0 fw-semibold">Document Images</h6>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <Row>
          <DocumentItem
            title="Front Aadhar"
            src={data?.frontAadharImage}
            alt="Front Aadhar"
          />
          <DocumentItem
            title="Back Aadhar"
            src={data?.backAadharImage}
            alt="Back Aadhar"
          />
          <DocumentItem
            title="PAN Card"
            src={data?.panImage}
            alt="PAN Card"
          />
          <DocumentItem
            title="Other ID"
            src={data?.otherIdImage}
            alt="Other ID"
          />
          <DocumentItem
            title="Signature"
            src={data?.signature}
            alt="Signature"
          />
        </Row>
      </CardBody>
    </Card>
  );
};

export default DocumentsCard; 