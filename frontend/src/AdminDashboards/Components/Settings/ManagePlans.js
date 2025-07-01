import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import MasterAddService from './Form/MasterAddService';
import ModalComponent from '../../Elements/ModalComponent';
import AdminDataTable from '../../Elements/AdminDataTable';
import { GetAllPlan } from '../../../Store/Actions/Dashboard/PlanAction';
import { DeletePlan } from '../../../Store/Actions/Dashboard/PlanAction';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import { API_URL, IMG_URL } from '../../../config';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BlockIcon from '@mui/icons-material/Block';
import axios from 'axios';
import AddPlans from './Form/AddPlans';
import AdminNavItems from '../../Elements/AdminNavItems';


const ManagePlans = () => {

    const [Block, setBlock] = useState(false)
    const dispatch = useDispatch()
    const [editData, setEditData] = useState([])
    const [deleteSuccess, setDeleteSuccess] = useState(false); // New state variable
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)


    const { data } = useSelector(pre => pre.GetAllPlanReducer)
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
                dispatch(DeletePlan(id))
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
        { field: "_id", headerName: "Sr No", minWidth: 50 },
        // { field: "refName", headerName: "Ref Name", minWidth: 120, editable: false },
        // { field: "date", headerName: "Date", minWidth: 160 },
        { field: "connectionType", headerName: "connectionType", minWidth: 200, editable: false },
        {
            field: "plan", headerName: "Plan", minWidth: 120 },
        {
            field: "code", headerName: "CodeId", minWidth: 120
        },
        {
            field: "basePrice", headerName: 'basePrice', minWidth: 200, innerHeight: 200
        },
        {
            field: "finalPrice",
            minWidth: 150,
            headerName: "Final Price",
        },
        {
            field: "provider",
            minWidth: 150,
            headerName: "Provider",
        },
        {
            field: "days",
            minWidth: 150,
            headerName: "Days",
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
                    <Button onClick={() => handleDeleteServices(params.id)} variant="contained" color="error"
                        style={{minWidth: "40px", maxWidth: "40px"}}
                        >
                        <DeleteForeverIcon />
                    </Button>
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
        dispatch(GetAllPlan())
    }, [])

    useEffect(() => {
        dispatch(GetAllPlan());
        setDeleteSuccess(false); // Reset the delete success state
    }, [deleteSuccess]); // Trigger useEffect when deleteSuccess changes

    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed)
    }
    return (
        <Fragment>
            <ModalComponent modal={masterAddService} toggle={ToggleMasterAddService} data={<AddPlans ToggleMasterAddService={ToggleMasterAddService} data={editData} />} modalTitle={`${editData?.id ? 'Edit Plan' : 'Add Plan' } `} size={'lg'} />

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
                                    📋 All Packs/Plans
                                </h4>
                                <p className='text-white-50 mb-0' style={{ fontSize: '0.9rem' }}>
                                    Manage and configure service plans
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
                                    onClick={ToggleMasterAddService}
                                >
                                    <span>➕</span>
                                    Create Packs/Plans
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

export default ManagePlans