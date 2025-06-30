
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment/moment';
import { GetAllTicket } from '../../../Store/Actions/Dashboard/TicketAction';
import AdminNavItems from '../../Elements/AdminNavItems';

const AssignTickets = () => {
    const { data } = useSelector(pre => pre.GetAllTicketReducers)
    const dispatch = useDispatch()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const DataWithID = (data) => {
        const NewData = [];
        if (Array.isArray(data) && data.length > 0) {
            for (let item of data) {
                if(item.technician !== null){
                const mergedCustomer = {
                    ...item.customer, 
                    ...item.customer?.NewCustomer // Merge customer and NewCustomer
                };
                delete mergedCustomer.NewCustomer; 
                NewData.push({
                    ...item,
                    _id: item.id, // Use item's ID for _id
                    formattedDate: moment(item.date).format("DD MMM YYYY, hh:mm a"), // Format the `date` field
                    createdAt: moment(item.createdAt).format("DD MMM YYYY, hh:mm a"), // Format the `date` field
                    customer: mergedCustomer // Replace customer with the merged object
                });
            }
            }
        } else {
            NewData.push({ id: 0 });
        }
        return NewData;
    };

    const column = [
        { field: "_id", headerName: "Sr No", minWidth: 50 },
        {
            field: "ticket_code",
            headerName: "Ticket Code/Id",
            flex: 1,
            renderCell: (params) => {
                return (
                    <div
                        className="d-flex flex-column justify-content-center align-items-start p-2"
                        style={{ width: "200px", height: "100px" }} // Inline style for width and height
                    >
                        <div>{params.row.customer?.name}</div>
                        {/* <div>CustomerId: {params.row.customer?.id}</div>
                        <div>Box Unique No: {params.row.customer?.other_id}</div> */}
                    </div>
                );
            }
        },        
        {
            field: "details", headerName: "Details", flex: 1 },
        {
            field: "createdAt", headerName: "Created Date & Time", flex: 1
        },
        {
            field: "formattedDate", headerName: 'Visit Date & Time', flex: 1
        },
        { field: "technician", headerName: "Assign Technician", minWidth: 200,
            renderCell: (params) => {
                return (
                    <div
                        className="d-flex flex-column justify-content-center align-items-start p-2"
                        style={{ width: "200px", height: "100px" }} // Inline style for width and height
                    >
                        <div>{params.row.service_provider?.name}</div>
                        <div>{params.row.service_provider?.mobile_no}</div>
                    </div>
                );
            }
        },
    ];

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarQuickFilter />
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarExport />
                <GridToolbarDensitySelector />
            </GridToolbarContainer>
        );
    };
    
    useEffect(() => {
        dispatch(GetAllTicket())
    }, [])

    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed)
    }

    return (
        <Fragment>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                {/* Left Sidebar - Dynamic width */}
                <AdminNavItems onSidebarToggle={handleSidebarToggle} />

                {/* Main Content - Dynamic width based on sidebar state */}
                <div
                    className="main-content"
                    style={{
                        width: `calc(100% - ${sidebarCollapsed ? '80px' : '280px'})`,
                        marginLeft: sidebarCollapsed ? '80px' : '280px',
                        height: '100vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#f8f9fa',
                        transition: 'width 0.3s ease, margin-left 0.3s ease'
                    }}
                >
                    {/* Header Section with Gradient Background */}
                    <div 
                        className="flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '0 0 20px 20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            margin: '10px',
                            marginBottom: '20px'
                        }}
                    >
                        <div className='d-flex align-items-center justify-content-between p-4'>
                            <div>
                                <h4 className='text-white mb-1' style={{ fontWeight: '600', fontSize: '1.5rem' }}>
                                    🔧 Assigned Tickets
                                </h4>
                                <p className='text-white-50 mb-0' style={{ fontSize: '0.9rem' }}>
                                    Track tickets assigned to technicians
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Data Table Section */}
                    <div className="flex-grow-1 px-4 pb-4" style={{ overflow: 'hidden' }}>
                        <AdminDataTable rows={DataWithID(data.data)} columns={column} CustomToolbar={CustomToolbar} />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AssignTickets