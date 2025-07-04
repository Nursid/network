import { Button } from '@mui/material';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import BlockIcon from '@mui/icons-material/Block'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { useNavigate } from 'react-router-dom/dist';
import AdminDataTable from '../../Elements/AdminDataTable';
import ModalComponent from '../../Elements/ModalComponent';
import AdminAddServiceProvider from './Forms/AdminAddServiceProvider';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllServiceProvider } from '../../../Store/Actions/Dashboard/Authentication/ServiceProviderActions';
import moment from 'moment';
import { API_URL } from '../../../config';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminNavItems from '../../Elements/AdminNavItems';
import { useMediaQuery, useTheme } from '@mui/material';

const ManageServiceProvider = () => {

    const navigate = useNavigate()

    const [Block, setBlock] = useState(false)
    const dispatch = useDispatch();
    const { data } = useSelector(pre => pre.GetAllServiceProviderReducer);

    const [blockStatus, setBlockStatus] = useState({});
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Set initial block status when data changes
    useEffect(() => {
        if (data && data.length > 0) {
            const initialBlockStatus = {};
            data.forEach(item => {
                initialBlockStatus[item.id] = item.block_id;
            });
            setBlockStatus(initialBlockStatus);
        }
    }, [data]);

    const handleToggleBlock = (userId) => {
        const newBlockStatus = !blockStatus[userId]; 

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
        axios.post(`${API_URL}/service-provider/block/${userId}`, { block_id: newBlockStatus })
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
    const ImageResult = useSelector(pre => pre.ImageUploadReducer);

    

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editData,setEditData]=useState([]);
    const [viewModel, setViewModel] = useState(false)
    const toggleModal = () => {
        setShowModal(!showModal);
        setEditMode(false); 
        setEditData('')
    };

    const toggleEditMode = (data) => {
       
        setShowModal(true);
        setEditMode(true);
        setEditData(data)
    };

    const toggleView = (data) =>{
        setEditData(data);
        setViewModel(!viewModel)
    }



    const GetDeleteByID = (user_id) => {
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
                const response = await axios.get(API_URL + '/service-provider/delete/' + user_id)
                if (response.status === 200) {
                    Swal.fire(
                        'Deleted!',
                        'Service Provider has been deleted.',
                        'success'
                    )
                    dispatch(GetAllServiceProvider())
                } else {
                    Swal.fire({
                        title: 'failed to delete try again',
                        icon: "error",
                    })
                }
            }
        })
    }


    const column = [
        { 
            field: "_id", 
            headerName: "Sr No", 
            minWidth: isMobile ? 50 : 50, 
            editable: false,
            hide: isSmallMobile
        },
        { 
            field: "name", 
            headerName: "Name", 
            minWidth: isMobile ? 120 : 120, 
            flex: isMobile ? 1 : undefined,
            editable: false 
        },
        { 
            field: "ref_name", 
            headerName: "Ref Name", 
            minWidth: 120, 
            editable: false,
            hide: isMobile
        },
        { 
            field: "aadhar_no", 
            headerName: "Aadhaar", 
            minWidth: 120, 
            editable: false,
            hide: isMobile
        },
        { 
            field: "mobile_no", 
            headerName: isMobile ? "Mobile" : "Mobile No", 
            minWidth: isMobile ? 100 : 120, 
            editable: false,
            hide: isSmallMobile
        },
        { 
            field: "email", 
            headerName: "Email", 
            minWidth: 120, 
            editable: false,
            hide: isMobile
        },
        { 
            field: "permanent_address", 
            headerName: "Address", 
            minWidth: 200, 
            editable: false,
            hide: isMobile
        },
        { 
            field: "about", 
            headerName: "About", 
            minWidth: 180, 
            editable: false,
            hide: isMobile
        },
        {
            field: "status",
            minWidth: isMobile ? 80 : 150,
            headerName: "Status",
            hide: isSmallMobile,
            renderCell: (params) => (
                <Button 
                    className="text-white bg-green" 
                    style={{
                        minWidth: isMobile ? "60px" : "80px", 
                        maxWidth: isMobile ? "60px" : "80px",
                        fontSize: isMobile ? "0.7rem" : "0.75rem",
                        minHeight: isMobile ? "28px" : "32px",
                        maxHeight: isMobile ? "28px" : "32px"
                    }}
                >
                    {isMobile ? 'OK' : 'Approved'}
                </Button>
            ),
        },
        {
            field: "action",
            headerName: "Action",
            minWidth: isMobile ? 120 : 150,
            flex: isMobile ? 0 : undefined,
            sortable: false,
            renderCell: (params) => (
                <div className={`d-flex ${isMobile ? 'flex-column gap-1' : 'gap-2'}`}>
                    <Button 
                        variant='contained' 
                        onClick={(e)=>{toggleEditMode(params.row)}} 
                        color='primary'
                        style={{
                            minWidth: isMobile ? "28px" : "40px", 
                            maxWidth: isMobile ? "28px" : "40px",
                            minHeight: isMobile ? "28px" : "40px",
                            maxHeight: isMobile ? "28px" : "40px",
                            padding: isMobile ? "2px" : "4px"
                        }}
                    >
                        <BorderColorIcon fontSize={isMobile ? "small" : "medium"} />
                    </Button>
                    {!isSmallMobile && (
                        <Button 
                            variant="contained" 
                            color="success" 
                            onClick={(e)=>{toggleView(params.row)}}
                            style={{
                                minWidth: isMobile ? "28px" : "40px", 
                                maxWidth: isMobile ? "28px" : "40px",
                                minHeight: isMobile ? "28px" : "40px",
                                maxHeight: isMobile ? "28px" : "40px",
                                padding: isMobile ? "2px" : "4px"
                            }}
                        >
                            <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />
                        </Button>
                    )}
                    {!isSmallMobile && (
                        <Button 
                            variant="contained" 
                            color="error"
                            onClick={(e)=>{
                                GetDeleteByID(params.row.id)
                            }}
                            style={{
                                minWidth: isMobile ? "28px" : "40px", 
                                maxWidth: isMobile ? "28px" : "40px",
                                minHeight: isMobile ? "28px" : "40px",
                                maxHeight: isMobile ? "28px" : "40px",
                                padding: isMobile ? "2px" : "4px"
                            }}
                        >
                            <DeleteForeverIcon fontSize={isMobile ? "small" : "medium"} />
                        </Button>
                    )}
                </div>
            ),
        },
        {
            field: "block",
            headerName: "Block",
            minWidth: isMobile ? 80 : 160,
            flex: isMobile ? 0 : undefined,
            sortable: false,
            renderCell: (params) => (
                <div className="d-flex gap-1">
                    {blockStatus[params.row.id] ?
                       <Button 
                           variant="contained" 
                           color="error" 
                           onClick={() => handleToggleBlock(params.row.id)} 
                           style={{
                               minWidth: isMobile ? "28px" : "40px", 
                               maxWidth: isMobile ? "28px" : "40px",
                               minHeight: isMobile ? "28px" : "40px",
                               maxHeight: isMobile ? "28px" : "40px",
                               padding: isMobile ? "2px" : "4px"
                           }}
                       >
                           <BlockIcon fontSize={isMobile ? "small" : "medium"} />
                       </Button>
                        :
                        <Button 
                            className="text-white bg-warning border-warning" 
                            onClick={() => handleToggleBlock(params.row.id)} 
                            style={{
                                minWidth: isMobile ? "60px" : "80px", 
                                maxWidth: isMobile ? "60px" : "80px",
                                fontSize: isMobile ? "0.7rem" : "0.875rem",
                                minHeight: isMobile ? "28px" : "36px",
                                maxHeight: isMobile ? "28px" : "36px",
                                padding: isMobile ? "2px 4px" : "4px 8px"
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
    }

    const ServiceProviderType = [
        { value: 'staff', label: 'Staff' },
        { value: 'outsource', label: 'Out Source' },
    ];

    useEffect(() => {
        dispatch(GetAllServiceProvider())
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
    
    // Add service provider controller 
    const [AddService, setAddServicer] = useState(false)
    const ToggleAddServiceMan = () => setAddServicer(!AddService)
    return (
        <Fragment>
            <ModalComponent data={<AdminAddServiceProvider toggleModal={toggleModal} data2={editData}  />} 
            modalTitle={editMode ? "Edit Service Provider" : "Add Service Provider"}
            modal={showModal}
            toggle={toggleModal}
            size={"xl"} scrollable={true}
            />

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
                                    🔧 Service Provider Management
                                </h4>
                                <p className='text-white-50 mb-0' style={{ 
                                    fontSize: isMobile ? '0.8rem' : '0.9rem' 
                                }}>
                                    Manage and track all service providers
                                </p>
                            </div>

                            <div className="d-flex gap-2">
                                <div
                                    className="btn btn-light d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
                                    style={{ 
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        border: 'none',
                                        fontSize: isMobile ? '0.85rem' : '1rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                    }}
                                    onClick={toggleModal} 
                                >
                                    <span>➕</span>
                                    {isMobile ? 'Add Provider' : 'Add Service Provider'}
                                </div>
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
                                rows={DataWithID(data)} 
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

export default ManageServiceProvider