import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import moment from "moment";
import SelectBox from '../../../../Elements/SelectBox';

// Validation function for basic info
const validateBasicInfo = (values) => {
  const errors = {};

  // Name validation
  if (!values.name) {
    errors.name = 'Name is required';
  } else if (values.name.length > 200) {
    errors.name = 'Name must be less than 200 characters';
  } else if (!/^[a-zA-Z\s]+$/.test(values.name)) {
    errors.name = 'Name can only contain letters and spaces';
  }

  // Username validation
  if (!values.username) {
    errors.username = 'Username is required';
  } else if (values.username.length > 50) {
    errors.username = 'Username must be less than 50 characters';
  }

  // Email validation
  if (values.email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Invalid email format';
    } else if (values.email.length > 100) {
      errors.email = 'Email must be less than 100 characters';
    }
  }

  return errors;
};

const BasicInfoCard = ({ data, isModal = false, onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(isModal);
  const [gender, setGender] = useState(null);

  // Gender options
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  // Initialize gender state when data prop changes
  useEffect(() => {
    if (data && data.gender) {
      const selectedGender = genderOptions.find(option => option.value === data.gender);
      setGender(selectedGender || null);
    }
  }, [data]);

  // Helper function to format date
  const formatDate = (date) => {
    return date ? moment(date).format('DD MMM YYYY') : 'N/A';
  };

  // Handle form submission
  const handleFormSubmit = (values) => {
    const formData = {
      ...values,
      gender: gender?.value || null,
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

  // Key press handlers
  const handleKeyPress = (e) => {
    const charCode = e.which || e.keyCode;
    const charStr = String.fromCharCode(charCode);
    if (!/^[a-zA-Z\s]+$/.test(charStr)) {
      e.preventDefault();
    }
  };

  const InfoField = ({ label, value, icon }) => (
    <div className="info-field mb-3">
      <div className="info-label">
        {icon && <span className="me-2">{icon}</span>}
        {label}
      </div>
      <div className="info-value">{value || 'N/A'}</div>
    </div>
  );

  // Formik form for editing
  const renderEditForm = () => (
    <Formik
      initialValues={{
        name: data?.name || '',
        username: data?.username || '',
        email: data?.email || '',
        mobile: data?.mobile || '',
        gender: data?.gender || '',
        dob: data?.dob ? moment(data.dob).format('YYYY-MM-DD') : '',
        doa: data?.doa ? moment(data.doa).format('YYYY-MM-DD') : '',
      }}
      validate={validateBasicInfo}
      onSubmit={handleFormSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="name">Full Name <span style={{color: "red"}}>*</span></Label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Enter Full Name"
                  maxLength="200"
                  onKeyPress={handleKeyPress}
                />
                <ErrorMessage name="name" component="span" className="validationError" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="username">Username <span style={{color: "red"}}>*</span></Label>
                <Field
                  as={Input}
                  name="username"
                  placeholder="Enter Username"
                  maxLength="50"
                />
                <ErrorMessage name="username" component="span" className="validationError" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email">Email Address</Label>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                />
                <ErrorMessage name="email" component="span" className="validationError" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="mobile">Mobile Number</Label>
                <Field
                  as={Input}
                  type="tel"
                  name="mobile"
                  maxLength="10"
                  minLength="10"
                  placeholder="Enter Mobile Number"
                />
                <ErrorMessage name="mobile" component="span" className="validationError" />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="gender">Gender</Label>
                <SelectBox 
                  options={genderOptions} 
                  setSelcted={setGender} 
                  initialValue={gender}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="dob">Date of Birth</Label>
                <Field
                  as={Input}
                  type="date"
                  name="dob"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="doa">Anniversary Date</Label>
                <Field
                  as={Input}
                  type="date"
                  name="doa"
                />
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
    <Card className="border-0 shadow-sm mb-4">
      <CardBody className="p-4">
        {isEditing ? (
          renderEditForm()
        ) : (
          <Row>
            <Col md={6}>
              <InfoField 
                label="Full Name" 
                value={data?.name}
              />
            </Col>
            <Col md={6}>
              <InfoField 
                label="Username" 
                value={data?.username ? `@${data.username}` : 'N/A'}
              />
            </Col>
            <Col md={6}>
              <InfoField 
                label="Email Address" 
                value={data?.email}
              />
            </Col>
            <Col md={6}>
              <InfoField 
                label="Mobile Number" 
                value={data?.mobile}
              />
            </Col>
            <Col md={6}>
              <InfoField 
                label="Gender" 
                value={data?.gender}
              />
            </Col>
            <Col md={6}>
              <InfoField 
                label="Date of Birth" 
                value={formatDate(data?.dob)}
              />
            </Col>
            <Col md={6}>
              <InfoField 
                label="Anniversary Date" 
                value={formatDate(data?.doa)}
              />
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
};

export default BasicInfoCard;