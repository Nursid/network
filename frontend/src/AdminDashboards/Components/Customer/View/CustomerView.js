import React from 'react';
import { Row, Col, Button } from "reactstrap";
import * as FaIcons from "react-icons/fa";
import "./CustomerView.css";

// Import separate components
import CustomerHeader from './components/CustomerHeader';
import CustomerProfile from './components/CustomerProfile';
import BasicInfoCard from './components/BasicInfoCard';
import ContactInfoCard from './components/ContactInfoCard';
import AddressInfoCard from './components/AddressInfoCard';
import PackageInfoCard from './components/PackageInfoCard';
import InventoryInfoCard from './components/InventoryInfoCard';
import BillingInfoCard from './components/BillingInfoCard';
import KYCInfoCard from './components/KYCInfoCard';
import DocumentsCard from './components/DocumentsCard';
import PlansCard from './components/PlansCard';
import PaymentHistoryCard from './components/PaymentHistoryCard';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL } from '../../../../config';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AdminNavItems from '../../../Elements/AdminNavItems';

export default function CustomerView() {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { id } = useParams();
  // Decode URL-encoded parameter and extract customer ID
  const decodedId = decodeURIComponent(id);
  const customer_id = decodedId.split('-').pop(); // Get the last part after splitting by '-'
  console.log("customer_id-",customer_id) 

  const [data, setData] = useState(null);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed)
}

useEffect(() => {
  fetchData();
}, [customer_id]);

  const fetchData = async () => {
    const response = await axios.get(`${API_URL}/customer/getbyid/${customer_id}`);
    const data = await response.data.data;
    setData(data);
  };
  

  const getMainContentStyle = () => {
    if (isMobile) {
        return {
            width: '100%',
            marginLeft: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
            paddingTop: '60px'
        }
    }
    
    return {
        width: `calc(100% - ${sidebarCollapsed ? '80px' : '280px'})`,
        marginLeft: sidebarCollapsed ? '80px' : '280px',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
        transition: 'width 0.3s ease, margin-left 0.3s ease'
    }
}


  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
       {!isMobile && <AdminNavItems onSidebarToggle={handleSidebarToggle} />}
       {isMobile && <AdminNavItems onSidebarToggle={handleSidebarToggle} />}
         {/* Main Content */}
         <div className="main-content" style={getMainContentStyle()}>

    <div className="customer-view-professional">
     
      <div className="container-fluid">
        <CustomerHeader />
        <div className="customer-view-content">
          {/* Main Customer Profile - Full Width */}
          <Row className="g-3 mb-4">
            <Col xs={12}>
              <CustomerProfile data={data} fetchData={fetchData} />
            </Col>
          </Row>

          {/* Plans Section */}
          <Row className="g-3 mb-4">
            <Col xs={12}>
              <PlansCard data={data} />
            </Col>
          </Row>

          {/* Payment History Section */}
          <Row className="g-3 mb-4">
            <Col xs={12}>
              <PaymentHistoryCard data={data} />
            </Col>
          </Row>

          {/* Additional Information Sections - Collapsed by default */}
          {/* <Row className="g-3 mb-4">
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
              <BasicInfoCard data={data} />
            </Col>
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
              <ContactInfoCard data={data} />
            </Col>
          </Row>
          
          <Row className="g-3 mb-4">
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
              <AddressInfoCard data={data} />
            </Col>
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
              <PackageInfoCard data={data} />
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
              <InventoryInfoCard data={data} />
            </Col>
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
              <BillingInfoCard data={data} />
            </Col>
          </Row>
*/}
          <Row className="g-3 mb-4">
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
              <KYCInfoCard data={data} />
            </Col>
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
              <DocumentsCard data={data} />
            </Col>
          </Row> 
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
