import React from 'react';
import { Row, Col, Button } from "reactstrap";
import * as FaIcons from "react-icons/fa";
import "./CustomerView.css";

// Import separate components
import CustomerHeader from './components/CustomerHeader';
import CustomerProfile from './components/CustomerProfile';
import BasicInfoCard from './components/BasicInfoCard';
import ContactInfoCard from './components/ContactInfoCard';
import AddressInfoCard from './components/AddressInfoCard';
import PackageInfoCard from './components/PackageInfoCard';
import InventoryInfoCard from './components/InventoryInfoCard';
import BillingInfoCard from './components/BillingInfoCard';
import KYCInfoCard from './components/KYCInfoCard';
import DocumentsCard from './components/DocumentsCard';

export default function CustomerView({ data, toggleModal }) {
  console.log(data);

  return (
    <div className="customer-view-professional">
      <div className="container-fluid">
        {/* Header */}
        <CustomerHeader toggleModal={toggleModal} />

        {/* Main Content */}
        <Row className="g-4">
          {/* Left Column - Profile */}
          <Col lg={4}>
            <CustomerProfile data={data} />
          </Col>

          {/* Right Column - Information Cards */}
          <Col lg={8}>
            <div className="info-cards-container">
              <BasicInfoCard data={data} />
              
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <ContactInfoCard data={data} />
                </Col>
                <Col md={6}>
                  <AddressInfoCard data={data} />
                </Col>
              </Row>

              <Row className="g-4 mb-4">
                <Col md={6}>
                  <PackageInfoCard data={data} />
                </Col>
                <Col md={6}>
                  <InventoryInfoCard data={data} />
                </Col>
              </Row>

              <BillingInfoCard data={data} />
              <KYCInfoCard data={data} />
              <DocumentsCard data={data} />
            </div>
          </Col>
        </Row>

        {/* Footer */}
        <div className="customer-view-footer">
          <Button 
            color="secondary" 
            size="sm"
            onClick={toggleModal}
            className="close-btn"
          >
            <FaIcons.FaTimes className="me-2" />
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
