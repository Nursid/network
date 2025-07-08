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
import { IoClose } from "react-icons/io5";
import Swal from 'sweetalert2';
import { useAuth } from '../../Context/userAuthContext';

const AdminNavItems = ({ onSidebarToggle }) => {
  const { userRole } = useUserRoleContext();
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 90 });

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const NavItems = [
    { 
      field: "Dashboard", 
      title: "Dashboard", 
      icon: <CiViewList size={isMobile ? 24 : 30} />,
      path: "/admin/dashboard"
    },
    { 
      field: "AccountTransaction", 
      title: "Account Transactions", 
      icon: <GiPayMoney size={isMobile ? 24 : 30} />,
      children: [
        { title: "All Transactions", icon: <BiTransfer size={20} />, path: "/admin/account-transactions" },
        { title: "Collection Tally", icon: <BiMoney size={20} />, path: "/admin/collection-tally" },
        { title: "Payment Pending", icon: <BiReceipt size={20} />, path: "/admin/payment-pending" },
      ]
    },
    { 
      field: "ManageHR", 
      title: "Team Management", 
      icon: <MdPeopleOutline size={isMobile ? 24 : 30} />,
      children: [
        { title: "Employees Management", icon: <FiUsers size={20} />, path: "/admin/manage-employees" },
        { title: "Local Staff Management", icon: <FiUserPlus size={20} />, path: "/admin/local-staff-management" },
        { title: "Salary Management", icon: <BiMoney size={20} />, path: "/admin/manage-salary" }
      ]
    },
    { 
      field: "Customer", 
      title: "Customer", 
      icon: <FaPeopleCarry size={isMobile ? 24 : 30} />,
      path: "/admin/customer",
    },
    { 
      field: "Tickets", 
      title: "Task Management", 
      icon: <MdAirplaneTicket size={isMobile ? 24 : 30} />,
      children: [
        { title: "All Tickets", icon: <BsTicketPerforated size={20} />, path: "/admin/all-tickets" },
        { title: "Assign Tickets", icon: <BsListTask size={20} />, path: "/admin/assign-tickets" },
      ]
    },
    { 
      field: "Network", 
      title: "Network", 
      icon: <IoIosGitNetwork size={isMobile ? 24 : 30} />,
      path: "/admin/manage-flow"
    },
    { 
      field: "Inventory", 
      title: "Inventory Management", 
      icon: <MdInventory size={isMobile ? 24 : 30} />,
      children: [
        { title: "Stock Management", icon: <MdInventory size={20} />, path: "/admin/stock-management" },
        { title: "Warehouse Management", icon: <FiUserCheck size={20} />, path: "/admin/warehouse-management" }
      ]
    },
    { 
      field: "ManageService", 
      title: "Settings", 
      icon: <CiGrid41 size={isMobile ? 24 : 30} />,
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
    if (item.children && item.children.length > 0) {
      if (!isCollapsed || isMobile) {
        // Normal behavior: toggle expansion
        toggleExpanded(index);
      } else {
        // Collapsed sidebar behavior: navigate to first child
        if (item.children[0] && item.children[0].path) {
          navigate(item.children[0].path);
        }
      }
    } else {
      // No children, navigate to the item's path
      const path = item.path || `/admin/${item.title.toLowerCase().split(" ").join("-")}`;
      navigate(path);
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const handleMouseEnter = (index, item, event) => {
    if (isCollapsed && !isMobile && item.children && item.children.length > 0) {
      // Clear any existing timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      
      // Calculate position based on the hovered element
      const rect = event.currentTarget.getBoundingClientRect();
      const sidebarWidth = 80; // Width of collapsed sidebar
      
      setHoverPosition({
        top: rect.top + window.scrollY, // Account for page scroll
        left: sidebarWidth + 10 // 10px gap from sidebar
      });
      
      // Set a small delay before showing the popup
      const timeout = setTimeout(() => {
        setHoveredItem(index);
      }, 200);
      
      setHoverTimeout(timeout);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    // Add a small delay before hiding to prevent flickering
    const timeout = setTimeout(() => {
      setHoveredItem(null);
    }, 100);
    
    setHoverTimeout(timeout);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
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

  // Mobile menu toggle button (should be rendered separately in header)
  const MobileMenuToggle = () => (
    <button
      onClick={toggleSidebar}
      className="btn btn-primary d-md-none position-fixed"
      style={{
        top: '15px',
        left: '15px',
        zIndex: 1001,
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      {isMobileMenuOpen ? <IoClose size={20} /> : <FaBars size={20} />}
    </button>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && !isMobileMenuOpen ? <MobileMenuToggle /> : null }
      
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="position-fixed w-100 h-100 bg-dark"
          style={{
            top: 0,
            left: 0,
            zIndex: 998,
            opacity: 0.5,
            transition: 'opacity 0.3s ease'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`d-flex flex-column bg-light sidebar transition-all ${isMobile ? 'mobile-sidebar' : ''}`}
        style={{
          width: isMobile ? '280px' : (isCollapsed ? '80px' : '280px'),
          transform: isMobile ? (isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
          transition: isMobile ? 'transform 0.3s ease' : 'width 0.3s ease',
          padding: (isCollapsed && !isMobile) ? '12px 8px' : '12px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          overflowY: 'auto',
          zIndex: 999,
          boxShadow: isMobile ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {/* Logo and Toggle Section */}
        <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
          {(!isCollapsed || isMobile) && (
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
          
          {(isCollapsed && !isMobile) && (
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
            {(!isCollapsed || isMobile) && (
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
            
            {!isMobile && (
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
            )}

            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-sm btn-outline-secondary border-0 p-2 rounded-circle"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Close Menu"
              >
                <IoClose size={16} />
              </button>
            )}
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
                  onMouseEnter={(e) => handleMouseEnter(index, item, e)}
                  onMouseLeave={handleMouseLeave}
                  className={`${isActive ? "activeNavItem" : ""} d-flex align-items-center ${(isCollapsed && !isMobile) ? 'justify-content-center' : 'justify-content-between'} cursor-pointer bg-white text-blue hoverShadow hoverPrimary gap-2 p-2 border rounded-3 hoverNavItem`}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    minHeight: isMobile ? '44px' : '48px',
                    fontSize: isMobile ? '14px' : '16px',
                    position: 'relative'
                  }}
                  title={(isCollapsed && !isMobile) ? item.title : ''}
                >
                  <div className={`d-flex align-items-center ${(isCollapsed && !isMobile) ? 'justify-content-center' : 'gap-2'}`}>
                    {item.icon}
                    {(!isCollapsed || isMobile) && <h6 className="m-0" style={{ fontSize: isMobile ? '14px' : '16px' }}>{item.title}</h6>}
                  </div>
                  {item.children && item.children.length > 0 && (!isCollapsed || isMobile) && (
                    <div className="chevron-icon">
                      {isExpanded ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                    </div>
                  )}
                </div>

                {/* Hover Popup for Collapsed Sidebar */}
                {hoveredItem === index && isCollapsed && !isMobile && item.children && item.children.length > 0 && (
                  <div
                    className="position-fixed bg-white border rounded-3 shadow-lg"
                    style={{
                      left: `${hoverPosition.left}px`,
                      top: `${hoverPosition.top}px`,
                      minWidth: '200px',
                      zIndex: 1000,
                      padding: '8px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: '1px solid #e0e0e0'
                    }}
                    onMouseEnter={() => {
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                        setHoverTimeout(null);
                      }
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="mb-2 px-2 py-1 border-bottom">
                      <small className="text-muted fw-bold">{item.title}</small>
                    </div>
                    {item.children.map((child, childIndex) => {
                      const isChildActive = isPathActive(child.path);
                      return (
                        <div
                          key={childIndex}
                          onClick={() => {
                            navigate(child.path);
                            setHoveredItem(null);
                          }}
                          className={`${isChildActive ? "activeNavItem" : ""} d-flex align-items-center cursor-pointer bg-white text-blue hoverShadow hoverPrimary gap-2 p-2 mb-1 border rounded-2 hoverNavItem`}
                          style={{
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            fontSize: '14px',
                            minHeight: '36px'
                          }}
                        >
                          {child.icon}
                          <span className="m-0">{child.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Child Items */}
                {item.children && item.children.length > 0 && (!isCollapsed || isMobile) && (
                  <div 
                    className={`child-items-container ${isExpanded ? 'expanded' : 'collapsed'}`}
                    style={{
                      maxHeight: isExpanded ? `${item.children.length * (isMobile ? 45 : 50)}px` : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease',
                      marginTop: isExpanded ? '8px' : '0px',
                      marginLeft: isMobile ? '15px' : '20px'
                    }}
                  >
                    {item.children.map((child, childIndex) => {
                      const isChildActive = isPathActive(child.path);
                      return (
                        <div
                          key={childIndex}
                          onClick={() => {
                            navigate(child.path);
                            if (isMobile) {
                              setIsMobileMenuOpen(false);
                            }
                          }}
                          className={`${isChildActive ? "activeNavItem" : ""} d-flex align-items-center cursor-pointer bg-white text-blue hoverShadow hoverPrimary gap-2 p-2 mb-2 border rounded-3 hoverNavItem child-nav-item`}
                          style={{
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            fontSize: isMobile ? '13px' : '14px',
                            marginLeft: '10px',
                            minHeight: isMobile ? '40px' : '44px'
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
        {(isCollapsed && !isMobile) && (
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

      {/* Add CSS for mobile responsiveness */}
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-sidebar {
            width: 280px !important;
            transform: translateX(-100%);
          }
          
          .mobile-sidebar.show {
            transform: translateX(0);
          }
          
          .sidebar {
            -webkit-overflow-scrolling: touch;
          }
          
          .nav-item-container {
            touch-action: manipulation;
          }
          
          .hoverNavItem:active {
            background-color: #f8f9fa !important;
            transform: scale(0.98);
          }
        }
        
        @media (max-width: 480px) {
          .mobile-sidebar {
            width: 260px !important;
          }
        }
      `}</style>
    </>
  );
}

export default AdminNavItems