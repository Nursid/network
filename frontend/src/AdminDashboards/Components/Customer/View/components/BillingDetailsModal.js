import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import { API_URL } from '../../../../../config';
import axios from 'axios';
import './BillingDetailsModal.css';

const BillingDetailsModal = ({ isOpen, toggle, data, onSave }) => {
  const [formData, setFormData] = useState({
    selected_package: '',
    billing_amount: '',
    balance: '',
    previous_dues: '',
    other_charges: '',
    bill_date: '',
    received_date: '',
    received_amount: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        selected_package: data.selected_package || '',
        billing_amount: data.billing_amount || '',
        balance: data.balance || '',
        previous_dues: data.previous_dues || '',
        other_charges: data.other_charges || '',
        bill_date: data.bill_date || '',
        received_date: data.received_date || '',
        received_amount: data.received_amount || ''
      });
      // Clear errors when modal opens
      setErrors({});
    }
  }, [data, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.selected_package.trim()) {
      newErrors.selected_package = 'Package Name is required';
    }
    
    if (!formData.billing_amount || isNaN(formData.billing_amount)) {
      newErrors.billing_amount = 'Valid Plan Amount is required';
    }
    
    if (!formData.balance || isNaN(formData.balance)) {
      newErrors.balance = 'Valid Balance is required';
    }
    
    if (!formData.previous_dues || isNaN(formData.previous_dues)) {
      newErrors.previous_dues = 'Valid Previous Recharge Balance is required';
    }
    
    if (formData.other_charges && isNaN(formData.other_charges)) {
      newErrors.other_charges = 'Other Charges must be a valid number';
    }
    
    if (formData.received_amount && isNaN(formData.received_amount)) {
      newErrors.received_amount = 'Last Payment Amount must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Calculate total balance
      const totalBalance = parseFloat(formData.balance) + parseFloat(formData.previous_dues);
      
      const updateData = {
        ...formData,
        total_balance: totalBalance.toFixed(2)
      };

      // Here you would make the API call to update the billing details
      // const response = await axios.put(`${API_URL}/customer/update-billing/${data.customer_id}`, updateData);
      
      // Call the onSave callback with updated data
      onSave(updateData);
      
      // Close modal after successful save
      toggle();
      
    } catch (error) {
      console.error('Error updating billing details:', error);
      // Handle error - you might want to show a toast notification
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (data) {
      setFormData({
        selected_package: data.selected_package || '',
        billing_amount: data.billing_amount || '',
        balance: data.balance || '',
        previous_dues: data.previous_dues || '',
        other_charges: data.other_charges || '',
        bill_date: data.bill_date || '',
        received_date: data.received_date || '',
        received_amount: data.received_amount || ''
      });
    }
    setErrors({});
    toggle();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      toggle={handleCancel} 
      size="lg" 
      centered
      className="billing-modal"
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader toggle={handleCancel} className="bg-success text-white">
        <div className="d-flex align-items-center">
          <BsIcons.BsPencil className="me-2" />
          Edit Billing & Service Details
        </div>
      </ModalHeader>
      
      <ModalBody className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <FormGroup>
                <Label className="d-flex align-items-center fw-semibold">
                  Package Name
                </Label>
                <Input
                  type="text"
                  name="selected_package"
                  value={formData.selected_package}
                  onChange={handleInputChange}
                  invalid={!!errors.selected_package}
                  placeholder="Enter Package Name"
                />
                {errors.selected_package && (
                  <div className="invalid-feedback d-block">{errors.selected_package}</div>
                )}
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label className="d-flex align-items-center fw-semibold">
                  <FaIcons.FaMobile className="text-muted me-2" />
                  Plan Amount
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  name="billing_amount"
                  value={formData.billing_amount}
                  onChange={handleInputChange}
                  invalid={!!errors.billing_amount}
                  placeholder="0.00"
                />
                {errors.billing_amount && (
                  <div className="invalid-feedback d-block">{errors.billing_amount}</div>
                )}
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label className="d-flex align-items-center fw-semibold">
                  <FaIcons.FaMapMarkerAlt className="text-muted me-2" />
                  Current Balance
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  name="balance"
                  value={formData.balance}
                  onChange={handleInputChange}
                  invalid={!!errors.balance}
                  placeholder="0.00"
                />
                {errors.balance && (
                  <div className="invalid-feedback d-block">{errors.balance}</div>
                )}
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label className="d-flex align-items-center fw-semibold">
                  Pre Recharge Balance
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  name="previous_dues"
                  value={formData.previous_dues}
                  onChange={handleInputChange}
                  invalid={!!errors.previous_dues}
                  placeholder="0.00"
                />
                {errors.previous_dues && (
                  <div className="invalid-feedback d-block">{errors.previous_dues}</div>
                )}
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label className="d-flex align-items-center fw-semibold">
                  Other Charges
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  name="other_charges"
                  value={formData.other_charges}
                  onChange={handleInputChange}
                  invalid={!!errors.other_charges}
                  placeholder="0.00"
                />
                {errors.other_charges && (
                  <div className="invalid-feedback d-block">{errors.other_charges}</div>
                )}
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label className="d-flex align-items-center fw-semibold">
                  Paid Till
                </Label>
                <Input
                  type="date"
                  name="bill_date"
                  value={formData.bill_date}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label className="d-flex align-items-center fw-semibold">
                  Last Pay Date
                </Label>
                <Input
                  type="date"
                  name="received_date"
                  value={formData.received_date}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            
            <Col md={6}>
              <FormGroup>
                <Label className="d-flex align-items-center fw-semibold">
                  Last Pay Amt
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  name="received_amount"
                  value={formData.received_amount}
                  onChange={handleInputChange}
                  invalid={!!errors.received_amount}
                  placeholder="0.00"
                />
                {errors.received_amount && (
                  <div className="invalid-feedback d-block">{errors.received_amount}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      
      <ModalFooter className="bg-light">
        <Button
          color="secondary"
          onClick={handleCancel}
          disabled={loading}
          className="me-2"
        >
          Cancel
        </Button>
        <Button
          color="success"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            <>
              <BsIcons.BsCheckLg className="me-2" />
              Save Changes
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BillingDetailsModal;
