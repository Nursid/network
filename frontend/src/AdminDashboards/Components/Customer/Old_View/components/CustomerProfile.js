import React, { useMemo, useState } from 'react';
import { Card, CardBody, Badge, Button, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
import { IMG_URL } from "../../../../../config";
// import QRCode from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import BasicInfoCard from './BasicInfoCard';
import AddressInfoCard from './AddressInfoCard';
import axios from 'axios';
import { API_URL } from '../../../../../config';
import Swal from 'sweetalert2';
import { Label, Input } from 'reactstrap';

const CustomerProfile = ({ data, fetchData }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [basicDetailsModal, setBasicDetailsModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [providerModal, setProviderModal] = useState(false);
  const [macIdModal, setMacIdModal] = useState(false);
  const [boxUniqueNumberModal, setBoxUniqueNumberModal] = useState(false);
  const [provider, setProvider] = useState(data?.provider || '');
  const [macId, setMacId] = useState(data?.mac_id || '');
  const [boxUniqueNumber, setBoxUniqueNumber] = useState(data?.box_unique_number || '');

  const toggleProviderModal = () => setProviderModal(!providerModal);
  const toggleMacIdModal = () => setMacIdModal(!macIdModal);
  const toggleBoxUniqueNumberModal = () => setBoxUniqueNumberModal(!boxUniqueNumberModal);

  const toggleAddressModal = () => setAddressModal(!addressModal);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  // Handler functions for dropdown options
  const handleUpdateBasicDetails = () => {
    setBasicDetailsModal(true);
    setDropdownOpen(false); // Close dropdown when modal opens
  };

  const handleUpdateAddress = () => {
    setAddressModal(true);
    setDropdownOpen(false); // Close dropdown when modal opens
  };

  // Modal toggle functions
  const toggleBasicDetailsModal = () => setBasicDetailsModal(!basicDetailsModal);
  // Handle save basic details
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

  const handleSaveBasicDetails = (formData) => {
     handleUpdate(formData, 'Basic details updated successfully');
    setBasicDetailsModal(false);
  };

  const handleSaveProvider = (formData) => {
     handleUpdate(formData, 'Provider updated successfully');
    setProviderModal(false);
  };
  const handleSaveMacId = (formData) => {
    handleUpdate(formData, 'Mac Id updated successfully');
    setMacIdModal(false);
  };
  const handleSaveBoxUniqueNumber = (formData) => {
    handleUpdate(formData, 'Box Unique Number updated successfully');
    setBoxUniqueNumberModal(false);
  };

  // Handle save address
  const handleSaveAddress = (formData) => {
    handleUpdate(formData, 'Address updated successfully');
    // TODO: Implement API call to save address
    // You can add your API call here
    setAddressModal(false);
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return amount ? `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00';
  };

  // Helper function to format date
  const formatDate = (date) => {
    return date ? moment(date).format('DD MMM YYYY') : 'N/A';
  };

  // Generate QR Code data
  const generateQRData = () => {
    return JSON.stringify({
      customer_id: data?.customer_id,
      name: data?.name,
      mobile: data?.mobile,
      plan: data?.plan?.plan,
      expiry_date: data?.expiry_date
    });
  };
  
 
  const balance = useMemo(() => {
    return (parseFloat(data?.balance) || 0) + (parseFloat(data?.previous_dues) || 0) + (parseFloat(data?.other_charges) || 0);
  }, [data?.balance, data?.previous_dues, data?.other_charges]);

  return (

    <>
 
    <Card className="border-0 shadow-sm">
      <CardBody className="p-4">
        {/* Header with name and back button */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 className="mb-1 fw-bold">{data?.name || 'Test'}</h4>
          </div>
          <Button color="link" className="p-0" onClick={() => navigate('/admin/customer')}>
            <IoIcons.IoArrowBack size={24} />
            <span className="ms-1 small" >Back</span>
          </Button>
        </div>

        {/* Customer Details */}
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
                <FaIcons.FaGenderless className="text-muted me-2" />
                <span className="text-muted">Gender:</span>
                <span className="fw-semibold ms-2">{data?.gender || ''}</span>
              </div>
            </Col>
            <Col xs={6}>
              <div className="justify-content-between align-items-center">
                <FaIcons.FaHome className="text-muted me-2" />
                <span className="text-muted">Current Address:</span>
                <span className="fw-semibold ms-2">{data?.address || ''}</span>
              </div>
            </Col>
          </Row>
        </div>

        </CardBody>
        </Card>

        {/* Box Unique Number */}
        {/* <div className="box-unique-section mb-4">
          <div className="d-flex align-items-center mb-3">
            <span className="text-primary fw-semibold border-bottom border-primary pb-1">
              Box Unique Number: {data?.box_unique_number || ''}
            </span>
          </div>
        </div> */}

        {/* Connection Status */}
        <Card className="border-0 shadow-sm ">
        <CardBody className="p-4">
          <div className="connection-status mb-4">
            {data?.status == 'active' ? (
              <div className="alert alert-success text-center mb-4">
                <strong>Connection is Active</strong>
              </div>
            ) : (
              <div className="alert alert-danger text-center mb-4">
                <strong>Connection is Deactivated</strong>
              </div>
            )}
          </div>

                 {/* QR Code and Details */}
         <div className="qr-section mb-4">
           <Row className="align-items-center">
             <Col md={6}>
               <div className="d-flex flex-row gap-2 justify-content-between align-items-center">
                 {data?.box_unique_number && (
                 <div className="justify-content-between align-items-center">
                   <span className="text-muted">Box Unique Number:</span>
                   <span className="fw-semibold ms-2">{data?.box_unique_number || ''}</span>
                 </div>
                 )}
                 {data?.mac_id && (
                 <div className="justify-content-between align-items-center">
                   <span className="text-muted">Mac Id:</span>
                   <span className="fw-semibold ms-2">{data?.mac_id || ''}</span>
                 </div>
                 )}
                 {data?.provider && (
                 <div className="justify-content-between align-items-center">
                   <span className="text-muted">Provider:</span>
                   <span className="fw-semibold ms-2">{data?.provider || ''}</span>
                 </div>
                 )}
               </div>
             </Col>
             <Col md={6}>
               <div className="d-flex justify-content-end align-items-center">
                 <div className="d-flex gap-2">
                   <Button color="warning" size="sm">
                     <div className="d-flex align-items-center">
                       <FaIcons.FaRedo className="me-1" />
                       <span>Renew</span>
                     </div>
                   </Button>
                   <Button color="success" size="sm">
                     <FaIcons.FaWhatsapp />
                   </Button>
                   <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                     <DropdownToggle color="primary" size="sm">
                       <FaIcons.FaEllipsisV />
                     </DropdownToggle>
                     <DropdownMenu positionFixed style={{ maxHeight: "200px", overflowY: "auto" }}>
                       <DropdownItem onClick={() => handleUpdateBasicDetails()}>
                         <FaIcons.FaUser className="me-2" />
                         Update Basic Details
                       </DropdownItem>
                       <DropdownItem onClick={() => handleUpdateAddress()}>
                         <FaIcons.FaMapMarkerAlt className="me-2" />
                         Update Address
                       </DropdownItem>
                       <DropdownItem onClick={() => toggleProviderModal()}>
                         <FaIcons.FaMapMarkerAlt className="me-2" />
                         Update Provider
                       </DropdownItem>
                       <DropdownItem onClick={() => toggleMacIdModal()}>
                         <FaIcons.FaMapMarkerAlt className="me-2" />
                         Update Mac Id
                       </DropdownItem>
                       <DropdownItem onClick={() => toggleBoxUniqueNumberModal()}>
                         <FaIcons.FaMapMarkerAlt className="me-2" />
                         Update Box Unique Number
                       </DropdownItem>
                     </DropdownMenu>
                   </Dropdown>
                 </div>
               </div>
             </Col>
           </Row>
         </div>

        {/* Financial Details */}
        <div className="financial-details">
          <Row className="g-3">
            {data?.balance && (
          <Col md={4}>
              <div className="justify-content-between align-items-center">
                <span className="text-danger">Balance Amount:</span>
                <span className="text-danger ms-2">{formatCurrency(balance)}</span>
                <br/>
                <span className="text-muted" style={{ fontSize: '11px' }}>Due Amount against the Customer.</span>
              </div>
              
            </Col>
            )}
            {data?.expiry_date && (
            <Col md={4}>
              <div className="justify-content-between align-items-center">
                <span className="text-danger">Expiry Date:</span>
                <span className="text-danger ms-2">{formatDate(data?.expiry_date)}</span>
              </div>
            </Col>
            )}
            {data?.billing_amount && (
            <Col md={4}>  
              <div className="justify-content-between align-items-center">
                <span className="text-danger">Subscription Amount:</span>
                <span className="text-danger ms-2">{formatCurrency(data?.billing_amount)}</span>
              </div>
            </Col>
            )}
            {data?.previous_dues && (
            <Col md={4}>  
              <div className="justify-content-between align-items-center">
                <span className="text-danger">Previous Dues:</span>
                <span className="text-danger ms-2">{formatCurrency(data?.previous_dues)}</span>
              </div>
            </Col>
            )}
            {data?.other_charges && (
            <Col md={4}>  
              <div className="justify-content-between align-items-center">
                <span className="text-danger">Other Charges:</span>
                <span className="text-danger ms-2">{formatCurrency(data?.other_charges)}</span>
              </div>
            </Col>
            )}
            {data?.activation_date && (
            <Col md={4}>  
              <div className="justify-content-between align-items-center">
                <span className="text-info">Active Date:</span>
                <span className="text-info ms-2">{formatDate(data?.activation_date)}</span>
              </div>
            </Col>
            )}
            </Row>
        </div>
      </CardBody>
    </Card>

    {/* Basic Details Update Modal */}
    <Modal isOpen={basicDetailsModal} toggle={toggleBasicDetailsModal} size="lg">
      <ModalHeader toggle={toggleBasicDetailsModal}>
        <FaIcons.FaUser className="me-2" />
        Update Basic Details
      </ModalHeader>
      <ModalBody>
        <BasicInfoCard 
          data={data} 
          isModal={true}
          onSave={handleSaveBasicDetails}
          onCancel={toggleBasicDetailsModal}
        />
      </ModalBody>
    </Modal>

    {/* Address Update Modal */}
    <Modal isOpen={addressModal} toggle={toggleAddressModal} size="lg">
      <ModalHeader toggle={toggleAddressModal}>
        <FaIcons.FaMapMarkerAlt className="text-danger me-2" size={18} />
        Update Address Information
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


    <Modal isOpen={providerModal} toggle={toggleProviderModal} size="lg">
      <ModalHeader toggle={toggleProviderModal}>
        <FaIcons.FaUser className="me-2" />
        Update Provider
      </ModalHeader>
      <ModalBody>
        <Label>Provider</Label>
        <Input type="text" value={provider} onChange={(e) => setProvider(e.target.value)} />
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={() => handleSaveProvider({ provider: provider, customer_id: data?.customer_id })}>Save</Button>
        <Button color="secondary" onClick={toggleProviderModal}>Cancel</Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={macIdModal} toggle={toggleMacIdModal} size="lg">
      <ModalHeader toggle={toggleMacIdModal}>
        <FaIcons.FaUser className="me-2" />
        Update Mac Id
      </ModalHeader>
      <ModalBody> 
        <Label>Mac Id</Label>
        <Input type="text" value={macId} onChange={(e) => setMacId(e.target.value)} />
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={() => handleSaveMacId({ mac_id: macId, customer_id: data?.customer_id })}>Save</Button>
        <Button color="secondary" onClick={toggleMacIdModal}>Cancel</Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={boxUniqueNumberModal} toggle={toggleBoxUniqueNumberModal} size="lg">
      <ModalHeader toggle={toggleBoxUniqueNumberModal}>
        <FaIcons.FaUser className="me-2" />
        Update Box Unique Number
      </ModalHeader>
      <ModalBody>
        <Label>Box Unique Number</Label>
        <Input type="text" value={boxUniqueNumber} onChange={(e) => setBoxUniqueNumber(e.target.value)} />
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={() => handleSaveBoxUniqueNumber({ box_unique_number: boxUniqueNumber, customer_id: data?.customer_id })}>Save</Button>
        <Button color="secondary" onClick={toggleBoxUniqueNumberModal}>Cancel</Button>
      </ModalFooter>
    </Modal>

    </>
  );
};

export default CustomerProfile; 