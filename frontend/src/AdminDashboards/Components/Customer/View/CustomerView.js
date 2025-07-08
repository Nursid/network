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

  return (
    <div className="customer-view-professional">
      <div className="container-fluid">
        {/* Header */}
        <CustomerHeader toggleModal={toggleModal} />

        {/* Main Content */}
        <div className="customer-view-content">
          {/* Profile and Basic Info Row */}
          <Row className="g-3 mb-4"> 
            <Col xl={4} lg={5} md={12} sm={12} xs={12}>
              <CustomerProfile data={data} />
            </Col>
            <Col xl={8} lg={7} md={12} sm={12} xs={12}>
              <BasicInfoCard data={data} />
            </Col>
          </Row>

          {/* Information Cards */}
          <Row className="g-3 mb-4">
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                  <ContactInfoCard data={data} />
                </Col>
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                  <AddressInfoCard data={data} />
                </Col>
              </Row>

          <Row className="g-3 mb-4">
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                  <PackageInfoCard data={data} />
                </Col>
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                  <InventoryInfoCard data={data} />
                </Col>
              </Row>

          <Row className="g-3 mb-4">
            <Col xs={12}>
              <BillingInfoCard data={data} />
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col xs={12}>
              <KYCInfoCard data={data} />
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col xs={12}>
              <DocumentsCard data={data} />
          </Col>
        </Row>
        </div>
      </div>
    </div>
  );
}
