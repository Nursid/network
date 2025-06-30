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

const ManageServiceProvider = () => {

    const navigate = useNavigate()

    const [Block, setBlock] = useState(false)
    const dispatch = useDispatch();
    const { data } = useSelector(pre => pre.GetAllServiceProviderReducer);

    const [blockStatus, setBlockStatus] = useState({});
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        { field: "_id", headerName: "Sr No", minWidth: 50, editable: false },
        { field: "name", headerName: "Name", minWidth: 120, editable: false },
        { field: "ref_name", headerName: "Ref Name", minWidth: 120, editable: false }, 
        // { field: "provider_type", headerName: "Provider Type", minWidth: 120, editable: false },
       
        { field: "aadhar_no", headerName: "Aadhaar No", minWidth: 120, editable: false },
        { field: "mobile_no", headerName: "Mobile No", minWidth: 120, editable: false },
        { field: "email", headerName: "Email", minWidth: 120, editable: false },
        { field: "permanent_address", headerName: "Address", minWidth: 250, editable: false },
        { field: "about", headerName: "About", minWidth: 220, editable: false },
        {
            field: "status",
            minWidth: 150,
            headerName: "Admin Status",
            renderCell: (params) => (
                <Button className="text-white bg-green" style={{minWidth: "80px", maxWidth: "80px"}}>Approved</Button>
            ),
        },
        {
            field: "action",
            headerName: "Action",
            minWidth: 150,
            renderCell: (params) => (
                <div className="d-flex gap-2">
                    <Button variant='contained' onClick={(e)=>{toggleEditMode(params.row)}} color='primary'
                    style={{minWidth: "40px", maxWidth: "40px"}}
                    ><BorderColorIcon /></Button>
                    <Button variant="contained" color="success" onClick={(e)=>{toggleView(params.row)}}
                    style={{minWidth: "40px", maxWidth: "40px"}}
                    >
                        <VisibilityIcon />
                    </Button>
                    <Button variant="contained" color="error"
                    onClick={(e)=>{
                        GetDeleteByID(params.row.id)
                    }}
                    style={{minWidth: "40px", maxWidth: "40px"}}
                    >
                        <DeleteForeverIcon />
                    </Button>
                </div>
            ),
        },
        {
            field: "block",
            headerName: "Block",
            minWidth: 160,
            renderCell: (params) => (
                <div className="d-flex gap-2">
                    {blockStatus[params.row.id] ?
                       <Button variant="contained" color="error" onClick={() => handleToggleBlock(params.row.id)} style={{minWidth: "40px", maxWidth: "40px"}}><BlockIcon /></Button>
                        :
                        <Button className="text-white bg-warning border-warning" onClick={() => handleToggleBlock(params.row.id)} style={{minWidth: "80px", maxWidth: "80px"}}>Un-Block</Button>
                    }
                </div>
            ),
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
                                    🔧 Service Provider List
                                </h4>
                                <p className='text-white-50 mb-0' style={{ fontSize: '0.9rem' }}>
                                    Manage and track all service providers
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
                                    onClick={toggleModal} 
                                >
                                    <span>➕</span>
                                    Add Service Provider
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Data Table Section */}
                    <div className="flex-grow-1 px-4 pb-4" style={{ overflow: 'hidden' }}>
                        <AdminDataTable rows={DataWithID(data)} columns={column} CustomToolbar={CustomToolbar} />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ManageServiceProvider