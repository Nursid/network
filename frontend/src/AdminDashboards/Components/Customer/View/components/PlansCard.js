import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Table, Badge, Button } from "reactstrap";
import * as FaIcons from "react-icons/fa";
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../../../config';

const PlansCard = ({ data }) => {

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/customer/get-plans`, {
          plan_id: data?.selected_package
      });
      console.log("response-", response.data);
      if (response.data.status === true) {
        setPlans(response.data.data);
      }
      else {
        setError(response.data.message);
      }
    }
    catch (error) {
      setError(error);
    }
    finally {
      setLoading(false);
    }
  }

  console.log("plans-", plans);


  useEffect(() => {
    fetchPlans();
  }, [data?.customer_id]);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return amount ? `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
  };

  // Helper function to format date
  const formatDate = (date) => {
    return date ? moment(date).format('DD MMM YYYY hh:mm A') : 'N/A';
  };

  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardHeader className="bg-white border-0 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">Plans</h5>
          {/* <Button color="primary" size="sm">
            <FaIcons.FaPlus className="me-1" />
            Add Plan
          </Button> */}
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="table-responsive">
          <Table className="mb-0">
            <thead className="bg-black text-white">
              <tr>
                <th className="border-0 text-muted fw-semibold">Plan Details</th>
                <th className="border-0 text-muted fw-semibold">Pricing</th>
                <th className="border-0 text-muted fw-semibold">Duration</th>
                <th className="border-0 text-muted fw-semibold">Added On</th>
                <th className="border-0 text-muted fw-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {plans && plans.plan ? (
                <tr>
                  <td className="border-0 py-3">
                    <div>
                      <div className="fw-semibold">{plans?.plan}</div>
                      <div className="small text-muted">
                        Type: {plans?.connectionType || 'N/A'}
                      </div>
                      <div className="small text-muted">
                        Code: {plans?.code || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="border-0 py-3">
                    <div>
                      <div className="fw-semibold text-success">
                        {formatCurrency(plans?.finalPrice)}
                      </div>
                      {plans?.basePrice && plans?.basePrice !== plans?.finalPrice && (
                        <div className="small text-muted text-decoration-line-through">
                          {formatCurrency(plans?.basePrice)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="border-0 py-3">
                    <div className="d-flex align-items-center text-muted">
                      <FaIcons.FaClock className="me-2" size={14} />
                      <div>{plans?.days} Days</div>
                    </div>
                  </td>
                  <td className="border-0 py-3">
                    <div className="d-flex align-items-center text-muted">
                      <FaIcons.FaCalendar className="me-2" size={14} />
                      <div>{formatDate(plans.createdAt)}</div>
                    </div>
                  </td>
                  <td className="border-0 py-3">
                    <Button color="danger" size="sm" className="rounded-circle p-2">
                      <FaIcons.FaTrash size={12} />
                    </Button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No plans found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default PlansCard;
