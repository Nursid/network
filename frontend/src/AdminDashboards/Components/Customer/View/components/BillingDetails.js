import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from "reactstrap";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
import BillingDetailsModal from './BillingDetailsModal';

const BillingDetails = ({ data, onDataUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSave = (updatedData) => {
    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  return (
    <Card className="shadow-sm" style={{ border: '1px solid #28a745', borderRadius: '8px' }}>
      <CardBody className="p-4">
        {/* Header with Title and Edit Icon */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 text-center w-100">Billing & Service Details </h4>
          <BsIcons.BsPencil 
            className="text-warning" 
            style={{ fontSize: '18px', cursor: 'pointer' }} 
            onClick={handleEdit}
            title="Edit billing details"
          />
        </div>

        {/* Customer Information */}
        <div className="customer-details mb-4">
          <Row className="g-3">
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <span className="text-muted">Package Name:</span>
                <span className="fw-semibold ms-2">{data?.selected_package || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <span className="text-muted">Plan Amount:</span>
                <span className="fw-semibold ms-2">{data?.billing_amount || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <span className="text-muted">Total Balance:</span>
                <span className="fw-semibold ms-2">{parseFloat(data?.balance + data?.previous_dues).toFixed(2) || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <span className="text-muted">Pre Recharge Bal:</span>
                <span className="fw-semibold ms-2">{data?.previous_dues || ''}</span>
              </div>
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
                <span className="text-muted">Other Charges:</span>
                <span className="fw-semibold ms-2">{data?.other_charges || ''}</span>
              </div>
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
               
                <span className="text-muted">Paid Till :</span>
                <span className="fw-semibold ms-2">{data?.bill_date || ''}</span>
              </div>  
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
                <span className="text-muted">Last Pay Date :</span>
                <span className="fw-semibold ms-2">{data?.received_date || ''}</span>
              </div>  
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
                <span className="text-muted">Last Payment Amount :</span>
                <span className="fw-semibold ms-2">{data?.received_amount || ''}</span>
              </div>  
            </Col>
          </Row>
        </div>
      </CardBody>
      
      {/* Modal for editing */}
      <BillingDetailsModal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
        data={data}
        onSave={handleSave}
      />
    </Card>
  );
};

export default BillingDetails;