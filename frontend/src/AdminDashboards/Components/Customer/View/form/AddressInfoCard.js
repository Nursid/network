import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import SelectBox from '../../../../Elements/SelectBox';
import { apartment_options, area_option, block_option } from '../../../../../Components/utils';
import moment from 'moment';


// Validation function for address info
const validateAddressInfo = (values) => {
  const errors = {};

  // Name validation
  if (!values.name) {
    errors.name = 'Full name is required';
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
  } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores';
  }

  // Mobile validation
  if (values.mobile && !/^[0-9]{10}$/.test(values.mobile)) {
    errors.mobile = 'Mobile number must be exactly 10 digits';
  }

  // Address validation
  if (!values.address) {
    errors.address = 'Address is required';
  } else if (values.address.length > 200) {
    errors.address = 'Address must be less than 200 characters';
  }

  // Installation address validation
  if (values.installation_address && values.installation_address.length > 200) {
    errors.installation_address = 'Installation address must be less than 200 characters';
  }

  return errors;
};

const AddressInfoCard = ({ data, isModal = false, onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(isModal);
  const [area, setArea] = useState(null);
  const [block, setBlock] = useState(null);
  const [apartment, setApartment] = useState(null);
  const [gender, setGender] = useState(null);

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

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  const handleKeyPress = (e) => {
    const charCode = e.which || e.keyCode;
    const charStr = String.fromCharCode(charCode);
    if (!/^[a-zA-Z\s]+$/.test(charStr)) {
      e.preventDefault();
    }
  };

  // Handle form submission
  const handleFormSubmit = (values, { setSubmitting }) => {
    try {
      const formData = {
        ...values,
        gender: gender?.value || values.gender || null,
        area: area?.value || values.area || null,
        block: block?.value || values.block || null,
        apartment: apartment?.value || values.apartment || null,
        customer_id: data?.customer_id || '',
        // Ensure dates are properly formatted
        dob: values.dob || (data?.dob ? moment(data.dob).format('YYYY-MM-DD') : ''),
        doa: values.doa || (data?.doa ? moment(data.doa).format('YYYY-MM-DD') : ''),
      };
      
      console.log('Form data being submitted:', formData);
      
      if (onSave) {
        onSave(formData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset select states to original values
    if (data) {
      if (data.area) {
        const selectedArea = area_option.find(option => option.value === data.area);
        setArea(selectedArea || null);
      }
      
      if (data.block) {
        const selectedBlock = block_option.find(option => option.value === data.block);
        setBlock(selectedBlock || null);
      }
      
      if (data.apartment) {
        const selectedApartment = apartment_options.find(option => option.value === data.apartment);
        setApartment(selectedApartment || null);
      }
      
      if (data.gender) {
        const selectedGender = genderOptions.find(option => option.value === data.gender);
        setGender(selectedGender || null);
      }
    }
    
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

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Formik form for editing
  const renderEditForm = () => (
    <Formik
      initialValues={{
        address: data?.address || '',
        installation_address: data?.installation_address || '',
        area: data?.area || '',
        block: data?.block || '',
        apartment: data?.apartment || '',
        name: data?.name || '',
        username: data?.username || '',
        email: data?.email || '',
        mobile: data?.mobile || '',
        gender: data?.gender || '',
        activation_date: data?.activation_date || '',
        email: data?.email || '',
        dob: data?.dob ? moment(data.dob).format('YYYY-MM-DD') : '',
        doa: data?.doa ? moment(data.doa).format('YYYY-MM-DD') : '',
      }}
      validate={validateAddressInfo}
      onSubmit={handleFormSubmit}
      enableReinitialize={true}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
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
                  setSelcted={(selected) => {
                    setGender(selected);
                    setFieldValue('gender', selected?.value || '');
                  }}  
                  initialValue={gender}
                />
                {errors.gender && touched.gender && (
                  <span className="validationError">{errors.gender}</span>
                )}
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
            <Col md={4}>
              <FormGroup>
                <Label for="doa">Anniversary Date</Label>
                <Field
                  as={Input}
                  type="date"
                  name="doa"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="doa">Activation Date</Label>
                <Field
                  as={Input}
                  type="date"
                  name="activation_date"
                />
              </FormGroup>
            </Col>
           
            <Col md={4}>
              <FormGroup>
                <Label for="area">Area</Label>
                <SelectBox 
                  options={area_option} 
                  setSelcted={(selected) => {
                    setArea(selected);
                    setFieldValue('area', selected?.value || '');
                  }} 
                  initialValue={area}
                />
                {errors.area && touched.area && (
                  <span className="validationError">{errors.area}</span>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="block">Block</Label>
                <SelectBox 
                  options={block_option} 
                  setSelcted={(selected) => {
                    setBlock(selected);
                    setFieldValue('block', selected?.value || '');
                  }} 
                  initialValue={block}
                />
                {errors.block && touched.block && (
                  <span className="validationError">{errors.block}</span>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="apartment">Apartment</Label>
                <SelectBox 
                  options={apartment_options} 
                  setSelcted={(selected) => {
                    setApartment(selected);
                    setFieldValue('apartment', selected?.value || '');
                  }} 
                  initialValue={apartment}
                />
                {errors.apartment && touched.apartment && (
                  <span className="validationError">{errors.apartment}</span>
                )}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                />
                <ErrorMessage name="email" component="span" className="validationError" />
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
      <CardHeader className="d-flex justify-content-between align-items-center">
        {!isEditing && !isModal && (
          <Button color="primary" size="sm" onClick={handleEditClick}>
            <BsIcons.BsPencil className="me-1" />
            Edit
          </Button>
        )}
      </CardHeader>
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