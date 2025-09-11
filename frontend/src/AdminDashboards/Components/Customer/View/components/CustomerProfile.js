import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from "reactstrap";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
import AddressInfoCard from '../form/AddressInfoCard';
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import axios from 'axios';
import { API_URL } from '../../../../../config';
import Swal from 'sweetalert2';

const CustomerProfile = ({ data, fetchData }) => {
  const [addressModal, setAddressModal] = useState(false);

  const toggleAddressModal = () => setAddressModal(!addressModal);


  const handleUpdate = async (formData, message) => {
    try{
      const response = await axios.put(`${API_URL}/customer/getupdate/${formData?.customer_id}`, formData);
      console.log(response);
      fetchData();
      if(response.data.status){
        Swal.fire('Success', message, 'success');
      }else{
        fetchData();
        Swal.fire('Error', response.data.message, 'error');
      }
    }catch(error){
      console.log("error-",error)
      fetchData();
      Swal.fire('Error', error.response.data.message, 'error');
    }
    // TODO: Implement API call to save basic details
    // You can add your API call here
   
  };

  const handleSaveAddress = (formData) => {
    handleUpdate(formData, 'Profile updated successfully');
    setAddressModal(false);
  };

  return (
    <>
    <Card className="shadow-sm" style={{ border: '1px solid #28a745', borderRadius: '8px' }}>
      <CardBody className="p-4">
        {/* Header with Title and Edit Icon */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 text-center w-100">Customer Details</h4>
          <BsIcons.BsPencil className="text-warning" style={{ fontSize: '18px' , pointer: 'cursor' }} onClick={toggleAddressModal} />
        </div>

        {/* Customer Avatar */}
        <div className="text-center mb-4">
          <div 
            className="mx-auto d-flex align-items-center justify-content-center"
            style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '50%',
              border: '2px solid #dee2e6'
            }}
          >
            <BsIcons.BsPerson style={{ fontSize: '40px', color: '#6c757d' }} />
          </div>
        </div>

        {/* Customer Information */}
        <div className="customer-details mb-4">
          <Row className="g-3">
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaUser className="text-muted me-2" />
                <span className="text-muted">Customer Id:</span>
                <span className="fw-semibold ms-2">{data?.customer_id || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaUser className="text-muted me-2" />
                <span className="text-muted">Customer Name:</span>
                <span className="fw-semibold ms-2">{data?.name || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaUser className="text-muted me-2" />
                <span className="text-muted">Username:</span>
                <span className="fw-semibold ms-2">{data?.username || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaMobile className="text-muted me-2" />
                <span className="text-muted">Mobile:</span>
                <span className="fw-semibold ms-2">{data?.mobile || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaMapMarkerAlt className="text-muted me-2" />
                <span className="text-muted">Area:</span>
                <span className="fw-semibold ms-2">{data?.area || ''}</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaBuilding className="text-muted me-2" />
                <span className="text-muted">Block:</span>
                <span className="fw-semibold ms-2">{data?.block || ''}</span>
              </div>
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
                <FaIcons.FaHome className="text-muted me-2" />
                <span className="text-muted">Appartment:</span>
                <span className="fw-semibold ms-2">{data?.apartment || ''}</span>
              </div>  
            </Col>
            <Col md={6}>  
              <div className="justify-content-between align-items-center">
                <FaIcons.FaGenderless className="text-muted me-2" />
                <span className="text-muted">Gender:</span>
                <span className="fw-semibold ms-2">{data?.gender || ''}</span>
              </div>
            </Col>
            <Col xs={12}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaHome className="text-muted me-2" />
                <span className="text-muted">Current Address:</span>
                <span className="fw-semibold ms-2">{data?.address || ''}</span>
              </div>
            </Col>
            <Col xs={12}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaHome className="text-muted me-2" />
                <span className="text-muted">Installation Address:</span>
                <span className="fw-semibold ms-2">{data?.installation_address || ''}</span>
              </div>
            </Col>
            <Col xs={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaHome className="text-muted me-2" />
                <span className="text-muted">Connection Status:</span>
                <span className="fw-semibold ms-2">{data?.status || ''}</span>
              </div>
            </Col>
            <Col xs={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaHome className="text-muted me-2" />
                <span className="text-muted">Activation Date:</span>
                <span className="fw-semibold ms-2">{data?.activation_date || ''}</span>
              </div>
            </Col>

          </Row>
        </div>
      </CardBody>
    </Card>

<Modal isOpen={addressModal} toggle={toggleAddressModal} size="lg">
<ModalHeader toggle={toggleAddressModal}>
  <FaIcons.FaMapMarkerAlt className="text-danger me-2" size={18} />
  Update Customer Details
</ModalHeader>
<ModalBody>
  <AddressInfoCard 
    data={data} 
    isModal={true}
    onSave={handleSaveAddress}
    onCancel={toggleAddressModal}
  />
</ModalBody>
</Modal>

</>
  );
};

export default CustomerProfile;