import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment/moment';
import { GetAllTicketHead } from '../../../Store/Actions/Dashboard/TicketHeadAction';
import ModalComponent from '../../Elements/ModalComponent';
import AddTicketHead from './Form/AddTicketHead';
import { Button } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Swal from 'sweetalert2';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { API_URL } from '../../../config';
import AdminNavItems from '../../Elements/AdminNavItems';
import { useMediaQuery } from '@mui/material';

const TicketsHead = () => {
    // Mobile responsiveness hooks
    const isMobile = useMediaQuery('(max-width:768px)');
    const isSmallMobile = useMediaQuery('(max-width:480px)');

    const { data } = useSelector(pre => pre.GetAllTicketHeadReducers)
    const [createTicket, setCreateTicket] = useState(false)
    const [editData, setEditData] = useState([])
    const dispatch = useDispatch()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    
    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined) {
            for (let item of data) {
                NewData.push({ ...item, _id: data.indexOf(item), date: moment(item.createdAt).format("D / M / Y") })
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
    }

    const column = [
        { 
            field: "_id", 
            headerName: "Sr No", 
            minWidth: isSmallMobile ? 40 : 50,
            hide: isSmallMobile
        },
        { 
            field: "shortCode", 
            headerName: isMobile ? "Code" : "Short Code", 
            flex: isMobile ? 0 : 1,
            minWidth: isMobile ? 80 : 120
        },
        {
            field: "name", 
            headerName: "Name", 
            flex: isMobile ? 1 : 1,
            minWidth: isMobile ? 120 : 150
        },
        {
            field: "Type", 
            headerName: "Type", 
            flex: isMobile ? 0 : 1,
            minWidth: isMobile ? 80 : 120,
            hide: isSmallMobile
        },
        {
            field: "TAT", 
            headerName: 'TAT', 
            flex: isMobile ? 0 : 1,
            minWidth: isMobile ? 60 : 80,
            hide: isMobile
        },
        {
            field: "action",
            headerName: "Action",
            minWidth: isMobile ? 100 : 160,
            sortable: false,
            renderCell: (params) => (
                <div className="d-flex gap-1" style={{ 
                    flexDirection: isSmallMobile ? 'column' : 'row',
                    alignItems: 'center'
                }}>
                    <Button 
                        variant='contained' 
                        color='primary'
                        size={isMobile ? 'small' : 'medium'}
                        style={{
                            minWidth: isMobile ? "28px" : "40px", 
                            maxWidth: isMobile ? "28px" : "40px",
                            height: isMobile ? "28px" : "40px"
                        }}
                        onClick={() => handleEdit(params.row)}
                    >
                        <BorderColorIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </Button>
                    {!isSmallMobile && (
                        <Button 
                            onClick={() => handleDeleteServices(params.row.id)} 
                            variant="contained" 
                            color="error"
                            size={isMobile ? 'small' : 'medium'}
                            style={{
                                minWidth: isMobile ? "28px" : "40px", 
                                maxWidth: isMobile ? "28px" : "40px",
                                height: isMobile ? "28px" : "40px"
                            }}
                        >
                            <DeleteForeverIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    useEffect(()=>{
        dispatch((GetAllTicketHead()))
    }, [])

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

    const ToggleAddTickets = () => {
        setCreateTicket(!createTicket)
        if (createTicket) {
            setEditData(null); // Reset editData when closing masterAddService
        }
    };
    const handleEdit = (data) =>{
        setEditData(data)
        ToggleAddTickets()
    }

    const handleDeleteServices = (itemID)=>{
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
          if (result.isConfirmed) {
              const response = await axios.delete(API_URL + '/api/ticket-head/delete/' + itemID)
              if (response.status === 200) {
                  Swal.fire(
                      'Deleted!',
                      response.data.message,
                      'success'
                  )
                  dispatch(GetAllTicketHead())
              } else {
                  Swal.fire({
                      title: 'failed to delete try again',
                      icon: "error",
                  })
              }
          }
      })
    }

    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed)
    }

    return (
        <Fragment>
            <ModalComponent modal={createTicket} toggle={ToggleAddTickets} data={<AddTicketHead ToggleMasterAddService={ToggleAddTickets} GetAllTicketHead={GetAllTicketHead} editData={editData}  />} modalTitle={ editData?.id ? 'Update Ticket Head' : 'Add Ticket Head'} size={'lg'} />

            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                {/* Left Sidebar - Dynamic width */}
                <AdminNavItems onSidebarToggle={handleSidebarToggle} />

                {/* Main Content - Dynamic width based on sidebar state */}
                <div
                    className="main-content"
                    style={{
                        width: isMobile ? '100%' : `calc(100% - ${sidebarCollapsed ? '80px' : '280px'})`,
                        marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px'),
                        height: '100vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#f8f9fa',
                        transition: 'width 0.3s ease, margin-left 0.3s ease',
                        padding: isMobile ? '70px 10px 10px 10px' : '0'
                    }}
                >
                    {/* Header Section with Gradient Background */}
                    <div 
                        className="flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '0 0 20px 20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            margin: isMobile ? '0' : '10px',
                            marginBottom: '20px'
                        }}
                    >
                        <div className={`d-flex align-items-center ${isMobile ? 'flex-column text-center' : 'justify-content-between'}`} style={{ padding: isMobile ? '20px 15px' : '24px' }}>
                            <div className={isMobile ? 'mb-3' : ''}>
                                <h4 className='text-white mb-1' style={{ 
                                    fontWeight: '600', 
                                    fontSize: isMobile ? '1.25rem' : '1.5rem' 
                                }}>
                                    🎟️ Ticket Head Management
                                </h4>
                                <p className='text-white-50 mb-0' style={{ 
                                    fontSize: isMobile ? '0.8rem' : '0.9rem' 
                                }}>
                                    Configure ticket categories and types
                                </p>
                            </div>

                            <div className="d-flex gap-3">
                                <div
                                    className="btn btn-light d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
                                    style={{ 
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        border: 'none',
                                        fontSize: isMobile ? '0.8rem' : '1rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                    }}
                                    onClick={ToggleAddTickets}
                                >
                                    <span>➕</span>
                                    {isMobile ? 'Add Ticket Head' : 'Create New Ticket Head'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Data Table Section */}
                    <div className="flex-grow-1" style={{ 
                        padding: isMobile ? '0 5px 10px 5px' : '0 16px 16px 16px',
                        overflow: 'hidden' 
                    }}>
                        <AdminDataTable 
                            rows={DataWithID(data.data)} 
                            columns={column} 
                            CustomToolbar={CustomToolbar}
                            pageSize={isMobile ? 10 : 25}
                            density={isMobile ? 'compact' : 'standard'}
                            sx={{
                                '& .MuiDataGrid-root': {
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                },
                                '& .MuiDataGrid-cell': {
                                    padding: isMobile ? '4px 8px' : '8px 16px',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    fontWeight: '600',
                                    padding: isMobile ? '4px 8px' : '8px 16px',
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default TicketsHead