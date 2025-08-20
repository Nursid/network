import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import MasterAddService from './form/MasterAddService';
import ModalComponent from '../../Elements/ModalComponent';
import AdminDataTable from '../../Elements/AdminDataTable';
import { GetAllServices } from '../../../Store/Actions/Dashboard/servicesAction';
import { DeleteService } from '../../../Store/Actions/Dashboard/servicesAction';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import { API_URL, IMG_URL } from '../../../config';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BlockIcon from '@mui/icons-material/Block';
import axios from 'axios';
import AdminNavItems from '../../Elements/AdminNavItems';
import { useMediaQuery } from '@mui/material';

const ServicesManagement = () => {
    // Mobile responsiveness hooks
    const isMobile = useMediaQuery('(max-width:768px)');
    const isSmallMobile = useMediaQuery('(max-width:480px)');

    const [Block, setBlock] = useState(false)
    const dispatch = useDispatch()
    const [editData, setEditData] = useState([])
    const [deleteSuccess, setDeleteSuccess] = useState(false); // New state variable
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    const { data } = useSelector(pre => pre.GetAllServicesReducer)

    console.log("data---->", data)
    // service reducere
    // const DeletResult = useSelector(pre => pre.DeleterTheServiceReducer)

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

    const [blockStatus, setBlockStatus] = useState({});

    useEffect(() => {
        if (data.data && data.data.length > 0) {
            const initialBlockStatus = {};
            data.data.forEach(item => {
                initialBlockStatus[item.id] = item.block;
            });
            setBlockStatus(initialBlockStatus);
        }
    }, [data]);

    const handleToggleBlock = (userId) => {
        const newBlockStatus = !blockStatus[userId]; // Toggle the block status
        // Make API call to update block status on the server

        const actionText = newBlockStatus ? 'Un-Block' : 'Block';
        Swal.fire({
            title: 'Are you sure?',
            text: `You won't be able to ${actionText}!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${actionText} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Toggle the block status
        // Make API call to update block status on the server
        axios.put(`${API_URL}/service/block/${userId}`, { block: newBlockStatus })
            .then(response => {
                if (response.status === 200) {
                    Swal.fire(
                        `${actionText} Successful`,
                        `User has been ${actionText}ed.`,
                        'success'
                    );
                    // Update local state if API call is successful
                   setBlockStatus(prevBlockStatus => ({
                        ...prevBlockStatus,
                        [userId]: newBlockStatus,
                    }));
                } else {
                    // Handle error if API call fails
                    Swal.fire({
                        title: 'failed to delete try again',
                        icon: "error",
                    })
                    console.error('Failed to update block status');
                }
            })
            .catch(error => {
                console.error('Error updating block status:', error);
            });

               
            }
        })
    };

    // const IconWrapper = ({ icon }) => {
    //     const IconComponent = ALlIcon[icon];
    //     return IconComponent ? <IconComponent /> : null;
    // };

    const handleDeleteServices = (id) => {
        Swal.fire({
            title: `Are you sure? `,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(DeleteService(id))
                    .then(() => {
                        setDeleteSuccess(true);
                        Swal.fire("Deleted!", "Your Data Deleted", "success");
                    })
                    .catch((error) => {
                        console.error("Delete error:", error);
                        Swal.fire(
                            "Error",
                            "An error occurred while deleting the file.",
                            "error"
                        );
                    });
            }
        })
    }

    const column = [
        { 
            field: "_id", 
            headerName: "Sr No", 
            minWidth: isSmallMobile ? 40 : 50,
            hide: isSmallMobile
        },
        { 
            field: "serviceName", 
            headerName: isMobile ? "Service" : "Service Name", 
            minWidth: isMobile ? 120 : 200, 
            flex: isMobile ? 1 : 0,
            editable: false 
        },
        {
            field: "icon", 
            headerName: "Icon", 
            minWidth: isMobile ? 60 : 120,
            hide: isSmallMobile,
            renderCell: (params) => (
                <div className='w-80 h-80 rounded-circle'>
                    <img src={IMG_URL+ params.row.icon} alt='icon' style={{ 
                        width: isMobile ? "40px" : "60px", 
                        height: isMobile ? "35px" : "50px" 
                    }} />
                </div>
            )
        },
        {
            field: "image", 
            headerName: "Image", 
            minWidth: isMobile ? 80 : 120,
            hide: isMobile,
            renderCell: (params) => (
                <div className='w-80 h-80 rounded-circle'>
                    <img src={IMG_URL+params.row.image} alt="Image" style={{ 
                        width: isMobile ? "48px" : "64px", 
                        height: isMobile ? "48px" : "64px" 
                    }} />
                </div>
            )
        },
        {
            field: "details", 
            headerName: isMobile ? "Details" : "Service Details", 
            minWidth: isMobile ? 100 : 200,
            hide: isSmallMobile
        },
        {
            field: "adminStatus",
            minWidth: isMobile ? 80 : 150,
            headerName: isMobile ? "Status" : "Admin Approved",
            renderCell: (params) => (
                <Button 
                    className="text-white bg-success"
                    size={isMobile ? 'small' : 'medium'}
                    style={{
                        fontSize: isMobile ? '0.7rem' : '0.8rem',
                        padding: isMobile ? '2px 8px' : '4px 12px'
                    }}
                >
                    {isMobile ? 'OK' : 'Approved'}
                </Button>
            ),
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
                            onClick={() => handleDeleteServices(params.id)} 
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
        {
            field: "block",
            headerName: "Block",
            minWidth: isMobile ? 80 : 100,
            hide: isSmallMobile,
            renderCell: (params) => (
                <div className="d-flex gap-2">
                    {blockStatus[params.row.id] ?
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={() => handleToggleBlock(params.row.id)}
                            size={isMobile ? 'small' : 'medium'}
                            style={{
                                minWidth: isMobile ? "28px" : "40px", 
                                maxWidth: isMobile ? "28px" : "40px",
                                height: isMobile ? "28px" : "40px"
                            }}
                        >
                            <BlockIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </Button>
                        :
                        <Button 
                            className="text-white bg-warning border-warning" 
                            onClick={() => handleToggleBlock(params.row.id)}
                            size={isMobile ? 'small' : 'medium'}
                            style={{
                                fontSize: isMobile ? '0.7rem' : '0.8rem',
                                padding: isMobile ? '2px 6px' : '4px 8px'
                            }}
                        >
                            {isMobile ? 'Unblock' : 'Un-Block'}
                        </Button>
                    }
                </div>
            ),
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

    const [masterAddService, setMasterAddServices] = useState(false)
    // const ToggleMasterAddService = () => setMasterAddServices(!masterAddService)

    const ToggleMasterAddService = () => {
        setMasterAddServices(!masterAddService);
        if (masterAddService) {
            setEditData(null); // Reset editData when closing masterAddService
        }
    };
    const handleEdit = (data) =>{
        setEditData(data)
        ToggleMasterAddService()
    }

    useEffect(() => {
        dispatch(GetAllServices())
    }, [])

    useEffect(() => {
        dispatch(GetAllServices());
        setDeleteSuccess(false); // Reset the delete success state
    }, [deleteSuccess]); // Trigger useEffect when deleteSuccess changes

    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed)
    }

    return (
        <Fragment>
            <ModalComponent modal={masterAddService} toggle={ToggleMasterAddService} data={<MasterAddService ToggleMasterAddService={ToggleMasterAddService} data={editData} />} modalTitle={`${editData?.id ? 'Edit Service' : 'Add Service' } `} />

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
                                    🛠️ All Services List
                                </h4>
                                <p className='text-white-50 mb-0' style={{ 
                                    fontSize: isMobile ? '0.8rem' : '0.9rem' 
                                }}>
                                    Manage and configure available services
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
                                    onClick={ToggleMasterAddService}
                                >
                                    <span>➕</span>
                                    {isMobile ? 'Add Service' : 'Add New Services'}
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

export default ServicesManagement