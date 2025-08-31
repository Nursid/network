import React from 'react';
import { Card, CardBody, CardHeader, Table, Badge, Button } from "reactstrap";
import * as FaIcons from "react-icons/fa";
import moment from 'moment';

const PlansCard = ({ data }) => {
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
          <Button color="primary" size="sm">
            <FaIcons.FaPlus className="me-1" />
            Add Plan
          </Button>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="table-responsive">
          <Table className="mb-0">
            <thead className="bg-black text-white">
              <tr>
                <th className="border-0 text-muted fw-semibold">Name</th>
                <th className="border-0 text-muted fw-semibold">Added On</th>
                <th className="border-0 text-muted fw-semibold">Status</th>
                <th className="border-0 text-muted fw-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.customer_plan_histories && data?.customer_plan_histories.length > 0 ? (
                data?.customer_plan_histories.map((item, index) => (
                <tr>
                  <td className="border-0 py-3">
                    <div>
                      <div className="fw-semibold">{data.plan.plan} Plan</div>
                      <div className="small text-muted">
                        Type: {data.plan.connectionType || ''}
                      </div>
                      <div className="small text-muted">
                        Code/Id: {data.plan.code || data.plan.id}
                      </div>
                      <div className="small text-muted">
                        Valid For: {data.plan.days} Days
                      </div>
                    </div>
                  </td>
                  <td className="border-0 py-3">
                    <div className="d-flex align-items-center text-muted jus"><FaIcons.FaCalendar className="me-2" size={14} /><div>{formatDate(item.createdAt)}</div>
                    </div>
                  </td>
                  <td className="border-0 py-3">
                    <Badge 
                      color={data.status === 'active' ? 'success' : 'warning'}
                      className="px-3 py-2"
                    >
                      {data.status === 'active' ? 'Newly Added' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="border-0 py-3">
                    <Button color="danger" size="sm" className="rounded-circle p-2">
                      <FaIcons.FaTrash size={12} />
                    </Button>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
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
