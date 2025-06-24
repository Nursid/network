import React from 'react';
import { Card, CardBody, Badge } from "reactstrap";
import * as FaIcons from "react-icons/fa";
import { IMG_URL } from "../../../../../config";

const CustomerProfile = ({ data }) => {
  // Helper function to format currency
  const formatCurrency = (amount) => {
    return amount ? `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <CardBody className="text-center p-4">
        {/* Profile Image */}
        <div className="profile-image-wrapper mb-4">
          {data?.image ? (
            <img
              src={IMG_URL + data.image}
              alt="Customer Profile"
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">
              <FaIcons.FaUser size={40} className="text-muted" />
            </div>
          )}
        </div>

        {/* Customer Name & Username */}
        <div className="customer-info mb-4">
          <h5 className="customer-name mb-1">{data?.name || 'Unknown Customer'}</h5>
          <p className="text-muted mb-2">@{data?.username || 'N/A'}</p>
          <Badge 
            color={data?.status === 'active' ? 'success' : 'warning'} 
            className="status-badge"
          >
            {data?.status || 'Active'}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="customer-stats">
          <div className="stat-item">
            <div className="stat-value">{data?.selectedPackage ? '1' : '0'}</div>
            <div className="stat-label">Active Package</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">{formatCurrency(data?.billing_amount)}</div>
            <div className="stat-label">Monthly Bill</div>
          </div>
        </div>

        {/* Customer ID */}
        {data?.id && (
          <div className="customer-id mt-4">
            <small className="text-muted">Customer ID: <strong>{data.id}</strong></small>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CustomerProfile; 