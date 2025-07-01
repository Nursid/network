import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserRoleContext } from '../../Context/RolesContext'
import { CiGrid41, CiViewList } from 'react-icons/ci';
import { GiPayMoney } from 'react-icons/gi';
import { MdPeopleOutline, MdInventory } from 'react-icons/md';
import { FaPeopleCarry } from 'react-icons/fa';
import { MdAirplaneTicket } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import { IoIosGitNetwork } from "react-icons/io";
import { FaChevronDown, FaChevronRight, FaBars } from "react-icons/fa";
import { BiTransfer, BiMoney, BiReceipt } from "react-icons/bi";
import { FiUsers, FiUserCheck, FiUserPlus, FiLogOut } from "react-icons/fi";
import { AiOutlineFileText, AiOutlineGift } from "react-icons/ai";
import { BsTicketPerforated, BsListTask } from "react-icons/bs";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import Swal from 'sweetalert2';
import { useAuth } from '../../Context/userAuthContext';

const AdminNavItems = ({ onSidebarToggle }) => {
  const { userRole } = useUserRoleContext();
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavItems = [
    { 
      field: "Dashboard", 
      title: "Dashboard", 
      icon: <CiViewList size={30} />,
      path: "/admin/dashboard"
    },
    { 
      field: "AccountTransaction", 
      title: "Account Transactions", 
      icon: <GiPayMoney size={30} />,
      children: [
        { title: "All Transactions", icon: <BiTransfer size={20} />, path: "/admin/account-transactions" },
        { title: "Collection Tally", icon: <BiMoney size={20} />, path: "/admin/collection-tally" },
        { title: "Payment Pending", icon: <BiReceipt size={20} />, path: "/admin/payment-pending" },
      ]
    },
    // { 
    //   field: "Attendence", 
    //   title: "Attendance", 
    //   icon: <TbReport size={30} />,
    //   children: [
    //     { title: "Attendance Report", icon: <GoReport size={20} />, path: "/admin/attendance" },
    //   ]
    // },
    { 
      field: "ManageHR", 
      title: "Team Management", 
      icon: <MdPeopleOutline size={30} />,
      children: [
        { title: "Employees Management", icon: <FiUsers size={20} />, path: "/admin/manage-employees" },
        { title: "Local Staff Management", icon: <FiUserPlus size={20} />, path: "/admin/local-staff-management" },
        { title: "Salary Management", icon: <BiMoney size={20} />, path: "/admin/manage-salary" }
      ]
    },
    { 
      field: "Customer", 
      title: "Customer", 
      icon: <FaPeopleCarry size={30} />,
      path: "/admin/customer",
    },
    { 
      field: "Tickets", 
      title: "Task Management", 
      icon: <MdAirplaneTicket size={30} />,
      children: [
        { title: "All Tickets", icon: <BsTicketPerforated size={20} />, path: "/admin/all-tickets" },
        { title: "Assign Tickets", icon: <BsListTask size={20} />, path: "/admin/assign-tickets" },

        
      ]
    },
    { 
      field: "Network", 
      title: "Network", 
      icon: <IoIosGitNetwork size={30} />,
      path: "/admin/manage-flow"
    },
    { 
      field: "Inventory", 
      title: "Inventory Management", 
      icon: <MdInventory size={30} />,
      children: [
        { title: "Stock Management", icon: <MdInventory size={20} />, path: "/admin/stock-management" },
        { title: "Warehouse Management", icon: <FiUserCheck size={20} />, path: "/admin/warehouse-management" }
      ]
    },
    { 
      field: "ManageService", 
      title: "Settings", 
      icon: <CiGrid41 size={30} />,
      children: [
        { title: "Manage Services", icon: <CiGrid41 size={20} />, path: "/admin/manage-services" },
        { title: "Manage Plans", icon: <AiOutlineFileText size={20} />, path: "/admin/manage-plans" },
        { title: "Manage Tickets Head", icon: <AiOutlineFileText size={20} />, path: "/admin/manage-tickets-head" }
      ]
    },
  ];

  const toggleExpanded = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isPathActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (item) => {
    if (item.path) {
      return isPathActive(item.path);
    }
    if (item.children) {
      return item.children.some(child => isPathActive(child.path));
    }
    return false;
  };

  // Auto-expand parent when child is active
  useEffect(() => {
    const newExpandedItems = {};
    NavItems.forEach((item, index) => {
      if (item.children && item.children.some(child => isPathActive(child.path))) {
        newExpandedItems[index] = true;
      }
    });
    setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));
  }, [location.pathname]);

  const handleNavigation = (item, index) => {
    if (item.children && item.children.length > 0 && !isCollapsed) {
      toggleExpanded(index);
    } else {
      const path = item.path || `/admin/${item.title.toLowerCase().split(" ").join("-")}`;
      navigate(path);
    }
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    // Close all expanded items when collapsing
    if (!newCollapsedState === false) {
      setExpandedItems({});
    }
    // Notify parent component about sidebar state change
    if (onSidebarToggle) {
      onSidebarToggle(newCollapsedState);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Logout Successfully',
          showConfirmButton: false,
          timer: 1500
        });
        setCurrentUser(null);
        navigate('/admin');
      }
    });
  };

  return (
    <div 
      className="d-flex flex-column bg-light sidebar transition-all"
      style={{
        width: isCollapsed ? '80px' : '280px',
        transition: 'width 0.3s ease',
        padding: isCollapsed ? '12px 8px' : '12px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto',
        zIndex: 999
      }}
    >
      {/* Logo and Toggle Section */}
      <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
        {!isCollapsed && (
          <div className="d-flex align-items-center gap-2">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              LS
            </div>
            <div>
              <h6 className="m-0 fw-bold text-primary">Laxdeep System</h6>
              <small className="text-muted">& Service</small>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            LS
          </div>
        )}
        
        <div className="d-flex align-items-center gap-2">
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-danger border-0 p-2 rounded-circle"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Logout"
            >
              <FiLogOut size={16} />
            </button>
          )}
          
          <button
            onClick={toggleSidebar}
            className="btn btn-sm btn-outline-primary border-0 p-2 rounded-circle"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <HiOutlineMenuAlt2 size={16} />
          </button>
        </div>
      </div>

      <div className="d-flex flex-column gap-2">
        {NavItems.filter(x => (userRole ? userRole[x.field] : false)).map((item, index) => {
          const isExpanded = expandedItems[index];
          const isActive = isParentActive(item);
          
          return (
            <div key={index} className="nav-item-container">
              {/* Parent Item */}
              <div
                onClick={() => handleNavigation(item, index)}
                className={`${isActive ? "activeNavItem" : ""} d-flex align-items-center ${isCollapsed ? 'justify-content-center' : 'justify-content-between'} cursor-pointer bg-white text-blue hoverShadow hoverPrimary gap-2 p-2 border rounded-3 hoverNavItem`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minHeight: '48px'
                }}
                title={isCollapsed ? item.title : ''}
              >
                <div className={`d-flex align-items-center ${isCollapsed ? 'justify-content-center' : 'gap-2'}`}>
                  {item.icon}
                  {!isCollapsed && <h6 className="m-0">{item.title}</h6>}
                </div>
                {item.children && item.children.length > 0 && !isCollapsed && (
                  <div className="chevron-icon">
                    {isExpanded ? <FaChevronDown size={16} /> : <FaChevronRight size={16} />}
                  </div>
                )}
              </div>

              {/* Child Items */}
              {item.children && item.children.length > 0 && !isCollapsed && (
                <div 
                  className={`child-items-container ${isExpanded ? 'expanded' : 'collapsed'}`}
                  style={{
                    maxHeight: isExpanded ? `${item.children.length * 50}px` : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                    marginTop: isExpanded ? '8px' : '0px',
                    marginLeft: '20px'
                  }}
                >
                  {item.children.map((child, childIndex) => {
                    const isChildActive = isPathActive(child.path);
                    return (
                      <div
                        key={childIndex}
                        onClick={() => navigate(child.path)}
                        className={`${isChildActive ? "activeNavItem" : ""} d-flex align-items-center cursor-pointer bg-white text-blue hoverShadow hoverPrimary gap-2 p-2 mb-2 border rounded-3 hoverNavItem child-nav-item`}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          fontSize: '14px',
                          marginLeft: '10px'
                        }}
                      >
                        {child.icon}
                        <span className="m-0">{child.title}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Logout button for collapsed sidebar */}
      {isCollapsed && (
        <div className="mt-auto pt-3 border-top">
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline-danger border-0 p-2 rounded-circle mx-auto d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px'
            }}
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminNavItems