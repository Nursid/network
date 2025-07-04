import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment/moment';
import { GetAllTicket } from '../../../Store/Actions/Dashboard/TicketAction';
import AdminNavItems from '../../Elements/AdminNavItems';
import { useMediaQuery, useTheme } from '@mui/material';

const AssignTickets = () => {
    const { data } = useSelector(pre => pre.GetAllTicketReducers)
    const dispatch = useDispatch()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const DataWithID = (data) => {
        const NewData = [];
        if (Array.isArray(data) && data.length > 0) {
            for (let item of data) {
                if(item.technician !== null){
                NewData.push({
                    ...item,
                    _id: item.id, // Use item's ID for _id
                    formattedDate: moment(item.date).format(isMobile ? "DD/MM/YY" : "DD MMM YYYY, hh:mm a"), // Format the `date` field
                    createdAt: moment(item.createdAt).format(isMobile ? "DD/MM/YY" : "DD MMM YYYY, hh:mm a"), // Format the `date` field
                    customer: item.customer // Replace customer with the merged object
                });
            }
            }
        } else {
            NewData.push({ id: 0 });
        }
        return NewData;
    };

    const column = [
        { 
            field: "_id", 
            headerName: "Sr No", 
            minWidth: isMobile ? 50 : 50,
            hide: isSmallMobile
        },
        {
            field: "ticket_code",
            headerName: isMobile ? "Customer" : "Ticket Code/Id",
            flex: isMobile ? 1 : 1,
            minWidth: isMobile ? 120 : 200,
            renderCell: (params) => {
                return (
                    <div
                        className="d-flex flex-column justify-content-center align-items-start p-2"
                        style={{ 
                            width: isMobile ? "100%" : "200px", 
                            height: isMobile ? "60px" : "100px",
                            fontSize: isMobile ? "0.75rem" : "0.875rem"
                        }}
                    >
                        <div style={{ 
                            fontWeight: 'bold',
                            fontSize: isMobile ? "0.8rem" : "0.9rem"
                        }}>
                            {params.row.customer?.name}
                        </div>
                        {!isMobile && (
                            <>
                                <div>CustomerId: {params.row.customer?.id}</div>
                                <div>Box Unique No: {params.row.customer?.other_id}</div>
                            </>
                        )}
                    </div>
                );
            }
        },        
        {
            field: "details", 
            headerName: "Details", 
            flex: isMobile ? 1 : 1,
            minWidth: isMobile ? 100 : 150,
            hide: isSmallMobile
        },
        {
            field: "createdAt", 
            headerName: isMobile ? "Created" : "Created Date & Time", 
            flex: isMobile ? 0 : 1,
            minWidth: isMobile ? 80 : 150,
            hide: isSmallMobile
        },
        {
            field: "formattedDate", 
            headerName: isMobile ? "Visit" : 'Visit Date & Time', 
            flex: isMobile ? 0 : 1,
            minWidth: isMobile ? 80 : 150,
            hide: isSmallMobile
        },
        { 
            field: "technician", 
            headerName: isMobile ? "Technician" : "Assign Technician", 
            minWidth: isMobile ? 120 : 200,
            flex: isMobile ? 1 : undefined,
            renderCell: (params) => {
                return (
                    <div
                        className="d-flex flex-column justify-content-center align-items-start p-2"
                        style={{ 
                            width: isMobile ? "100%" : "200px", 
                            height: isMobile ? "60px" : "100px",
                            fontSize: isMobile ? "0.75rem" : "0.875rem"
                        }}
                    >
                        <div style={{ 
                            fontWeight: 'bold',
                            fontSize: isMobile ? "0.8rem" : "0.9rem",
                            color: '#28a745'
                        }}>
                            {isMobile ? 
                                params.row.service_provider?.name?.split(' ')[0] : 
                                params.row.service_provider?.name
                            }
                        </div>
                        {!isSmallMobile && (
                            <div style={{ 
                                fontSize: isMobile ? "0.7rem" : "0.8rem",
                                color: '#6c757d'
                            }}>
                                {params.row.service_provider?.mobile_no}
                            </div>
                        )}
                    </div>
                );
            }
        },
    ];

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarQuickFilter />
                {!isMobile && (
                    <>
                        <GridToolbarColumnsButton />
                        <GridToolbarFilterButton />
                        <GridToolbarExport />
                        <GridToolbarDensitySelector />
                    </>
                )}
            </GridToolbarContainer>
        );
    };
    
    useEffect(() => {
        dispatch(GetAllTicket())
    }, [])

    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed)
    }

    // Calculate dynamic widths based on screen size and sidebar state
    const getMainContentStyle = () => {
        if (isMobile) {
            return {
                width: '100%',
                marginLeft: 0,
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8f9fa',
                paddingTop: '60px' // Space for mobile menu button
            }
        }
        
        return {
            width: `calc(100% - ${sidebarCollapsed ? '80px' : '280px'})`,
            marginLeft: sidebarCollapsed ? '80px' : '280px',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8f9fa',
            transition: 'width 0.3s ease, margin-left 0.3s ease'
        }
    };

    return (
        <Fragment>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                {/* Left Sidebar - Hidden on mobile */}
                {!isMobile && <AdminNavItems onSidebarToggle={handleSidebarToggle} />}
                {isMobile && <AdminNavItems onSidebarToggle={handleSidebarToggle} />}

                {/* Main Content - Dynamic width based on sidebar state */}
                <div
                    className="main-content"
                    style={getMainContentStyle()}
                >
                    {/* Header Section with Gradient Background */}
                    <div 
                        className="flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: isMobile ? '0 0 15px 15px' : '0 0 20px 20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            margin: isMobile ? '0' : '10px',
                            marginBottom: isMobile ? '10px' : '20px'
                        }}
                    >
                        <div className={`d-flex align-items-center ${isMobile ? 'flex-column' : 'justify-content-between'} p-${isMobile ? '3' : '4'}`}>
                            <div className={`${isMobile ? 'text-center mb-3' : ''}`}>
                                <h4 className='text-white mb-1' style={{ 
                                    fontWeight: '600', 
                                    fontSize: isMobile ? '1.2rem' : '1.5rem' 
                                }}>
                                    🔧 Assigned Tickets
                                </h4>
                                <p className='text-white-50 mb-0' style={{ 
                                    fontSize: isMobile ? '0.8rem' : '0.9rem' 
                                }}>
                                    Track tickets assigned to technicians
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Data Table Section */}
                    <div className={`flex-grow-1 ${isMobile ? 'px-2' : 'px-4'} pb-4`} style={{ overflow: 'hidden' }}>
                        <div style={{ 
                            height: '100%',
                            '& .MuiDataGrid-root': {
                                fontSize: isMobile ? '0.75rem' : '0.875rem'
                            }
                        }}>
                            <AdminDataTable 
                                rows={DataWithID(data.data)} 
                                columns={column} 
                                CustomToolbar={CustomToolbar}
                                pageSize={isMobile ? 10 : 25}
                                rowsPerPageOptions={isMobile ? [10, 25] : [25, 50, 100]}
                                density={isMobile ? 'compact' : 'standard'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AssignTickets