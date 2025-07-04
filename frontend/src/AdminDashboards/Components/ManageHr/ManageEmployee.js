import React, { Fragment, useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import BlockIcon from '@mui/icons-material/Block'
import BlockOutlined from "@mui/icons-material/BlockOutlined"
import BorderColorIcon from '@mui/icons-material/BorderColor'
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { useNavigate } from 'react-router-dom/dist'
import AdminDataTable from '../../Elements/AdminDataTable'
import ModalComponent from '../../Elements/ModalComponent'
import AdminAddEmployeeForm from './Forms/AdminAddEmployeeForm'
import { useDispatch, useSelector } from 'react-redux'
import { GetAllEmployeeAction } from '../../../Store/Actions/Dashboard/EmployeeActions/GetAllEmployee'
import moment from 'moment'
import { Button } from '@mui/material'
import Swal from 'sweetalert2'
import { API_URL } from '../../../config'
import axios from 'axios'
import EmployeeRolesAndPermission from './Forms/EmployeeRolesAndPermission'
import AdminNavItems from '../../Elements/AdminNavItems'
import { useMediaQuery, useTheme } from '@mui/material'


const ManageEmployee = () => {

    const navigate = useNavigate()

    const { data } = useSelector(state => state.GetAllEmployeeDataReducer)
    const dispatch = useDispatch();

    const [blockStatus, setBlockStatus] = useState({});
    const [viewModal, setViewModel] = useState(false)
    const [employeeRolesId, setEmployeeRolesId] = useState(null)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Set initial block status when data changes
    useEffect(() => {
        if (data && data.length > 0) {
            const initialBlockStatus = {};
            data.forEach(item => {
                initialBlockStatus[item.id] = item.is_block;
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
        axios.post(`${API_URL}/employee/block/${userId}`, { is_block: newBlockStatus })
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
                NewData.push({ ...item,design_name:item.designation?.name, dept_name:item.department?.name , _id: data.indexOf(item)+1, date: moment(item.createdAt).format("DD-MM-YYYY") })
            }
        } else {    
            NewData.push({ id: 0 })
        }
        return NewData
    }

    useEffect(() => {
        dispatch(GetAllEmployeeAction())
    }, [])


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
                const response = await axios.get(API_URL + '/employee/delete/' + user_id)
                if (response.status === 200) {
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                    dispatch(GetAllEmployeeAction())
                } else {
                    Swal.fire({
                        title: 'failed to delete try again',
                        icon: "error",
                    })
                }
            }
        })
    }

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    


    const [editData,setEditData]=useState([])
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

    const toggleView = (data) => {
        setEditData(data)
        setViewModel(!viewModal);
    };



    const column = [
        { 
            field: "_id", 
            headerName: "Sr No", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 50 : 50, 
            editable: false,
            hide: isSmallMobile
        },
        { 
            field: "emp_id", 
            headerName: isMobile ? "ID" : "Emp Id", 
            minWidth: isMobile ? 80 : 120, 
            editable: false 
        },
        { 
            field: "name", 
            headerName: "Name", 
            minWidth: isMobile ? 120 : 120, 
            flex: isMobile ? 1 : undefined,
            editable: false 
        },
        { 
            field: "mobile_no", 
            headerName: isMobile ? "Mobile" : "Mobile No.", 
            minWidth: isMobile ? 100 : 120, 
            editable: false,
            hide: isSmallMobile
        },
        { 
            field: "alterno", 
            headerName: "Alt No.", 
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
            field: "pan_no", 
            headerName: "PAN", 
            minWidth: 120, 
            editable: false,
            hide: isMobile
        },
        { 
            field: "address", 
            headerName: "Address", 
            minWidth: 200, 
            editable: false,
            hide: isMobile
        },
        { 
            field: "date", 
            headerName: isMobile ? "Joined" : "Date Of Join", 
            minWidth: isMobile ? 90 : 120, 
            editable: false,
            hide: isSmallMobile
        },
        {
            field: "action",
            headerName: "Action",
            minWidth: isMobile ? 100 : 150,
            flex: isMobile ? 0 : undefined,
            sortable: false,
            renderCell: (params) => (
                <div className={`d-flex ${isMobile ? 'flex-column gap-1' : 'gap-2'}`}>
                    <Button  
                        onClick={(e)=>{toggleEditMode(params.row)}} 
                        variant='contained' 
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
                            color="error"
                            style={{
                                minWidth: isMobile ? "28px" : "40px", 
                                maxWidth: isMobile ? "28px" : "40px",
                                minHeight: isMobile ? "28px" : "40px",
                                maxHeight: isMobile ? "28px" : "40px",
                                padding: isMobile ? "2px" : "4px"
                            }}
                            onClick={(e) => {
                                GetDeleteByID(params.row.emp_id)
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
            headerName: "Status",
            minWidth: isMobile ? 80 : 150,
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
                                fontSize: isMobile ? "0.7rem" : "0.875rem",
                                minWidth: isMobile ? "60px" : "80px",
                                maxWidth: isMobile ? "60px" : "80px",
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
        {
            field: "roles",
            headerName: "Roles",
            minWidth: isMobile ? 70 : 150,
            flex: isMobile ? 0 : undefined,
            sortable: false,
            hide: isSmallMobile,
            renderCell: (params) => (
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => toggleEmployeeRoles(params.row.id)}
                    style={{
                        fontSize: isMobile ? "0.7rem" : "0.875rem",
                        minWidth: isMobile ? "50px" : "70px",
                        maxWidth: isMobile ? "50px" : "70px",
                        minHeight: isMobile ? "28px" : "36px",
                        maxHeight: isMobile ? "28px" : "36px",
                        padding: isMobile ? "2px 4px" : "4px 8px"
                    }}
                >
                    {isMobile ? 'Role' : 'Roles'}
                </Button>
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

    // Add Employee form Handler 
    const [addEmployee, setAddEmployee] = useState(false)
    const ToggleAddEmployee = () => setAddEmployee(!addEmployee)

    const [employeeRoles, setEmployeeRoles] = useState(false)
    const toggleEmployeeRoles = (id) => {
        setEmployeeRoles(!employeeRoles)
        setEmployeeRolesId(id)
    }

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
            {/* employee add form Modal  */}
            {/* <ModalComponent data={<AdminAddEmployeeForm ToggleAddEmployee={ToggleAddEmployee} />} modalTitle={ "Add Employee Form"} modal={addEmployee} toggle={ToggleAddEmployee} size={"xl"} scrollable={true} /> */}
            <ModalComponent
                data={<AdminAddEmployeeForm 
                data={editData} toggleModal={toggleModal} />}
                modalTitle={editMode ? "Edit Employee Form" : "Add Employee Form"}
                modal={showModal}
                toggle={toggleModal}
                size={"xl"} scrollable={true}
            />

        <ModalComponent
          modalTitle={"Employee Roles & Permission"}
          modal={employeeRoles}
          toggle={toggleEmployeeRoles}
          data={<EmployeeRolesAndPermission employeeRolesId={employeeRolesId} 
          size={"xl"} scrollable={true}
          />}
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
                  👥 Employee Management
                </h4>
                <p className='text-white-50 mb-0' style={{ 
                  fontSize: isMobile ? '0.8rem' : '0.9rem' 
                }}>
                  Manage and track all employees
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
                  {isMobile ? 'Add Employee' : 'Add New Employee'}
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

export default ManageEmployee;