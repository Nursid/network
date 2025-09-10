import React from 'react';
import { Card, CardBody, CardHeader, Row, Col, Badge } from "reactstrap";
import * as FaIcons from "react-icons/fa";
import moment from "moment";

const BillingInfoCard = ({ data }) => {
  // Helper function to format currency
  const formatCurrency = (amount) => {
    return amount ? `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'N/A';
  };

  // Helper function to format date
  const formatDate = (date) => {
    return date ? moment(date).format('DD MMM YYYY') : 'N/A';
  };

  const BillingField = ({ label, value, highlight = false }) => (
    <div className="billing-field mb-3">
      <div className="billing-label">{label}</div>
      <div className={`billing-value ${highlight ? 'text-success fw-bold' : ''}`}>
        {value}
      </div>
    </div>
  );

  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardHeader className="bg-light border-0 py-3">
        <div className="d-flex align-items-center">
          <FaIcons.FaMoneyBillWave className="text-success me-2" size={18} />
          <h6 className="mb-0 fw-semibold">Billing Information</h6>
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <Row>
          <Col md={3}>
            <BillingField
              label="Billing Amount"
              value={formatCurrency(data?.billing_amount)}
              highlight={true}
            />
          </Col>
          <Col md={3}>
            <BillingField
              label="Payment Method"
              value={
                data?.payment_method ? (
                  <Badge color="info" className="payment-method-badge">
                    {data.payment_method}
                  </Badge>
                ) : 'N/A'
              }
            />
          </Col>
          <Col md={3}>
            <BillingField
              label="Bill Date"
              value={formatDate(data?.bill_date)}
            />
          </Col>
          <Col md={3}>
            <BillingField
              label="Registration Date"
              value={formatDate(data?.registrationDate || data?.createdAt)}
            />
          </Col>
        </Row>
        
        {/* Legacy billing fields */}
        {(data?.cash || data?.online) && (
          <>
            <hr className="my-4" />
            <div className="legacy-billing">
              <h6 className="text-muted mb-3">Legacy Payment Details</h6>
              <Row>
                <Col md={6}>
                  <BillingField
                    label="Cash Payment"
                    value={formatCurrency(data?.cash)}
                  />
                </Col>
                <Col md={6}>
                  <BillingField
                    label="Online Payment"
                    value={formatCurrency(data?.online)}
                  />
                </Col>
              </Row>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default BillingInfoCard; 