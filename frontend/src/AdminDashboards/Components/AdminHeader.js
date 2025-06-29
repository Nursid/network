import React, { Fragment, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Container } from 'reactstrap'
import "../AdminDashboard.css"
import { useAuth } from '../../Context/userAuthContext'
import { FiLogOut, FiUser } from 'react-icons/fi'
import Swal from 'sweetalert2'
import { isMobile } from 'react-device-detect'
import { useNavigate } from 'react-router-dom';
import AdminProfile from './profile/AdminProfile'
import { IMG_URL } from '../../config'
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminHeader = () => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const LogOutFuction = () => {
        sessionStorage.clear()
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Logout Successfully',
            showConfirmButton: false,
            timer: 1500
        })
        setCurrentUser(null);
        navigate('/admin');
    }

    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    
    const handleProfileClick = () => {
        navigate('/admin/profile', { state: { currentUser } });
    };

    return (
        <Fragment>
            <div className='shadow border-bottom position-sticky top-0 bg-white'>
                <Container fluid className="px-3">
                    <Row className="g-0">
                        <Col xs={6} sm={6} lg={6} className={`${isMobile ? 'd-flex align-items-center justify-content-center' : 'd-flex align-items-center justify-content-start'}`}>
                                <img src="/images.png" alt="Logo" width={'200px'} height={'100px'} className="img-fluid" />
                        </Col>

                        <Col xs={6} sm={6} lg={6} className={`h-100 ${isMobile ? 'd-flex justify-content-center align-items-center' : 'd-flex justify-content-end align-items-center'}`}>
                            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                <DropdownToggle className='dropdownMenu-btn-header border-0 bg-transparent' style={{ boxShadow: 'none' }}>
                                    <div id="drop-menu" className="AdminDash_UserInfo d-flex align-items-center justify-content-end gap-2 gap-md-3">
                                        <img 
                                            width={isMobile ? '25px' : '30px'} 
                                            height={isMobile ? '25px' : '30px'}
                                            className="rounded-circle object-fit-cover"
                                            src={currentUser?.image ? IMG_URL + currentUser?.image : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
                                            alt="Profile" 
                                        />
                                        <div className='text-start'>
                                            <h6 className='mb-0 d-none d-md-block text-truncate' style={{ maxWidth: '150px' }}>
                                                {currentUser && currentUser?.name ? currentUser?.name : "Your Name"}
                                            </h6>
                                            <small className="text-muted d-block text-truncate" style={{ maxWidth: '150px' }}>
                                                {currentUser && currentUser.role ? currentUser?.role : currentUser && currentUser.designation?.name ? currentUser.designation?.name : ""}
                                            </small>
                                        </div>
                                        <FaChevronDown className="d-none d-sm-block" size={12} />
                                    </div>
                                </DropdownToggle>
                                <DropdownMenu className='dropDownMenu-header' end>
                                    <DropdownItem className='cursor-pointer hover-secondary d-flex align-items-center' onClick={handleProfileClick}>
                                        <FiUser className="me-2" /> Profile
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={() => { LogOutFuction() }} className='cursor-pointer hover-secondary d-flex align-items-center'>
                                        <FiLogOut className="me-2" /> Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Fragment>
    )
}

export default AdminHeader