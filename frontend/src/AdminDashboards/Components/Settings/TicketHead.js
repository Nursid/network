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

const TicketsHead = () => {
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
        { field: "_id", headerName: "Sr No", minWidth: 50 },
        { field: "shortCode", headerName: "Short Code", flex: 1 },
        {
            field: "name", headerName: "Name", flex: 1 },
        {
            field: "Type", headerName: "Type", flex: 1
        },
        {
            field: "TAT", headerName: 'TAT', flex: 1
        },
        {
            field: "action",
            headerName: "Action",
            minWidth: 160,
            renderCell: (params) => (
                <div className="d-flex gap-2">
                    <Button variant='contained' color='primary'
                    style={{minWidth: "40px", maxWidth: "40px"}}
                    onClick={() => handleEdit(params.row)}
                    ><BorderColorIcon /></Button>
                    <Button onClick={() => handleDeleteServices(params.row.id)} variant="contained" color="error"
                        style={{minWidth: "40px", maxWidth: "40px"}}
                        >
                        <DeleteForeverIcon />
                    </Button>
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
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarExport />
                <GridToolbarDensitySelector />
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
                                    🎟️ Ticket Head Management
                                </h4>
                                <p className='text-white-50 mb-0' style={{ fontSize: '0.9rem' }}>
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
                                        border: 'none'
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
                                    Create New Ticket Head
                                </div>
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

export default TicketsHead