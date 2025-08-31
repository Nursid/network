import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import SelectBox from '../../../../Elements/SelectBox';
import { apartment_options, area_option, block_option } from '../../../../../Components/utils';

// Validation function for address info
const validateAddressInfo = (values) => {
  const errors = {};

  // Address validation
  if (!values.address) {
    errors.address = 'Address is required';
  } else if (values.address.length > 200) {
    errors.address = 'Address must be less than 200 characters';
  }

  // Installation address validation
  if (values.installation_address) {
    if (values.installation_address.length > 200) {
      errors.installation_address = 'Installation address must be less than 200 characters';
    }
  }

  return errors;
};

const AddressInfoCard = ({ data, isModal = false, onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(isModal);
  const [area, setArea] = useState(null);
  const [block, setBlock] = useState(null);
  const [apartment, setApartment] = useState(null);

  // Initialize select states when data prop changes
  useEffect(() => {
    if (data) {
      // Set area
      if (data.area) {
        const selectedArea = area_option.find(option => option.value === data.area);
        setArea(selectedArea || null);
      }
      
      // Set block
      if (data.block) {
        const selectedBlock = block_option.find(option => option.value === data.block);
        setBlock(selectedBlock || null);
      }
      
      // Set apartment
      if (data.apartment) {
        const selectedApartment = apartment_options.find(option => option.value === data.apartment);
        setApartment(selectedApartment || null);
      }
    }
  }, [data]);

  // Handle form submission
  const handleFormSubmit = (values) => {
    const formData = {
      ...values,
      area: area?.value || null,
      block: block?.value || null,
      apartment: apartment?.value || null,
      customer_id: data?.customer_id || ''
    };
    
    if (onSave) {
      onSave(formData);
    }
    setIsEditing(false);
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setIsEditing(false);
    }
  };

  const AddressField = ({ label, value, icon }) => (
    <div className="address-field mb-3">
      <div className="address-label">
        {icon && <span className="me-2">{icon}</span>}
        {label}
      </div>
      <div className="address-value">{value || 'N/A'}</div>
    </div>
  );

  // Formik form for editing
  const renderEditForm = () => (
    <Formik
      initialValues={{
        address: data?.address || '',
        installation_address: data?.installation_address || '',
      }}
      validate={validateAddressInfo}
      onSubmit={handleFormSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Row>
           
            <Col md={4}>
              <FormGroup>
                <Label for="area">Area</Label>
                <SelectBox 
                  options={area_option} 
                  setSelcted={setArea} 
                  initialValue={area}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="block">Block</Label>
                <SelectBox 
                  options={block_option} 
                  setSelcted={setBlock} 
                  initialValue={block}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="apartment">Apartment</Label>
                <SelectBox 
                  options={apartment_options} 
                  setSelcted={setApartment} 
                  initialValue={apartment}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label for="address">Current Address <span style={{color: "red"}}>*</span></Label>
                <Field
                  as={Input}
                  type="textarea"
                  name="address"
                  placeholder="Enter Current Address"
                  rows="3"
                />
                <ErrorMessage name="address" component="span" className="validationError" />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label for="installation_address">Installation Address</Label>
                <Field
                  as={Input}
                  type="textarea"
                  name="installation_address"
                  placeholder="Enter Installation Address (if different from current address)"
                  rows="3"
                />
                <ErrorMessage name="installation_address" component="span" className="validationError" />
              </FormGroup>
            </Col>
           
          </Row>
          <div className="d-flex gap-2 mt-3">
            <Button type="submit" color="success" disabled={isSubmitting}>
              <BsIcons.BsCheck className="me-1" />
              Save Changes
            </Button>
            <Button type="button" color="secondary" onClick={handleCancel}>
              <BsIcons.BsX className="me-1" />
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );

  return (
    <Card className="border-0 h-100">
      <CardBody className="p-4">
        {isEditing ? (
          renderEditForm()
        ) : (
          <>

           <Row className="mt-3">
              <Col md={4}>
                <AddressField
                  label="Area"
                  value={data?.area}
                  icon={<FaIcons.FaMapMarkerAlt />}
                />
              </Col>
              <Col md={4}>
                <AddressField
                  label="Block"
                  value={data?.block}
                  icon={<FaIcons.FaBuilding />}
                />
              </Col>
              <Col md={4}>
                <AddressField
                  label="Apartment"
                  value={data?.apartment}
                  icon={<FaIcons.FaHome />}
                />
              </Col>
            </Row>
            <AddressField
              label="Current Address"
              value={data?.address}
              icon={<FaIcons.FaHome />}
            />
            <AddressField
              label="Installation Address"
              value={data?.installation_address || 'Same as current address'}
              icon={<FaIcons.FaMapMarkerAlt />}
            />
            
           
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default AddressInfoCard;