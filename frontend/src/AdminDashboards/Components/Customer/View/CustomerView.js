import React from 'react';
import { Row, Col, Button } from "reactstrap";
import * as FaIcons from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL } from '../../../../config';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AdminNavItems from '../../../Elements/AdminNavItems';
import CustomerProfile from './components/CustomerProfile';
import BillingDetails from './components/BillingDetails';
import Inventory from './components/Inventory';
import ServiceDetails from './components/ServiceDetails';
import RechargeLog from './components/RechargeLog';
import PaymentLog from './components/PaymentLog';
import KYCInfoCard from './components/KYCInfoCard';
import DocumentsCard from './components/DocumentsCard';
import Swal from 'sweetalert2';

export default function CustomerView() {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { id } = useParams();
  // Decode URL-encoded parameter and extract customer ID
  const decodedId = decodeURIComponent(id);
  const customer_id = decodedId.split('-').pop(); // Get the last part after splitting by '-'
 
  const [data, setData] = useState(null);
  const [planDetailsHistory, setPlanDetailsHistory] = useState(null);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed)
}

  useEffect(() => {
  fetchData();
  fetchPlanDetailsHistory();
  }, [customer_id]);

  const fetchData = async () => {
    const response = await axios.get(`${API_URL}/customer/getbyid/${customer_id}`);
    const data = await response.data.data;
    setData(data);
  };

  const handleUpdate =async (updatedBillingData,message) => {
    try{
      const response = await axios.put(`${API_URL}/customer/getupdate/${customer_id}`, updatedBillingData);
      if(response.data.status){
        Swal.fire('Success', message, 'success');
        fetchData();
      }else{
        fetchData();
        Swal.fire('Error', response.data.message, 'error');
      }
    }catch(error){
      console.log('error-',error)
      fetchData();
      Swal.fire('Error', error.response.data.message, 'error');
      fetchData();
    }
  };

  const fetchPlanDetailsHistory = async () => {
    const response = await axios.get(`${API_URL}/customer/get-plan-details-history/${customer_id}`);
    const data = await response.data.data;
    setPlanDetailsHistory(data);
  };

  const getMainContentStyle = () => {
    if (isMobile) {
        return {
            width: '100%',
            marginLeft: 0,
            height: '100%',
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
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
        transition: 'width 0.3s ease, margin-left 0.3s ease'
    }
}


  return (
    <div className="d-flex" style={{backgroundColor: '#f5f5f5' }}>
       {!isMobile && <AdminNavItems onSidebarToggle={handleSidebarToggle} />}
       {isMobile && <AdminNavItems onSidebarToggle={handleSidebarToggle} />}
         {/* Main Content */}
         <div className="main-content" style={getMainContentStyle()}>

    <div className="customer-view-professional">
     
      <div className="container-fluid">
        <div className="customer-view-content">
          {/* Main Customer Profile - Full Width */}
          <Row className="g-3 mt-4">
            <Col xs={6}>
              <CustomerProfile data={data} fetchData={fetchData} />
            </Col>
            <Col xs={6}>
              <div className="d-flex flex-column gap-3">
              <BillingDetails data={data} onDataUpdate={(updatedData) =>handleUpdate(updatedData,'Billing data updated successfully')} />
              <Inventory data={data} onDataUpdate={(updatedData) =>handleUpdate(updatedData,'Inventory data updated successfully')} />
              </div>
            </Col>
            <Col xs={12}>
              <ServiceDetails data={planDetailsHistory} />
            </Col>
            {/* <Col xs={12}>
              <RechargeLog data={data} />
            </Col> */}
            <Col xs={12}>
              <PaymentLog data={data} />
            </Col>
            <Col xs={6}>
              <KYCInfoCard data={data} />
            </Col>
            <Col xs={6}>
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
