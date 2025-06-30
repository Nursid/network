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


const ManageEmployee = () => {

    const navigate = useNavigate()

    const { data } = useSelector(state => state.GetAllEmployeeDataReducer)
    const dispatch = useDispatch();

    const [blockStatus, setBlockStatus] = useState({});
    const [viewModal, setViewModel] = useState(false)
    const [employeeRolesId, setEmployeeRolesId] = useState(null)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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
        { field: "_id", headerName: "Sr No", flex: 1, minWidth: 50, editable: false },
        { field: "emp_id", headerName: "Emp Id", minWidth: 120, editable: false },
        { field: "name", headerName: "Name", minWidth: 120, editable: false },
        // { field: "design_name", headerName: "Designation", minWidth: 120, editable: false },
        // { field: "dept_name", headerName: "Department", minWidth: 120, editable: false },
        { field: "mobile_no", headerName: "Mobile No.", minWidth: 120, editable: false },
        { field: "alterno", headerName: "Alternate No.", minWidth: 120, editable: false },
        { field: "aadhar_no", headerName: "Aadhaar No.", minWidth: 150, editable: false },
        { field: "pan_no", headerName: "Pan No", minWidth: 120, editable: false },
        { field: "address", headerName: "Address", minWidth: 250, editable: false },
        { field: "date", headerName: "Date Of Join", minWidth: 120, editable: false },
        // {
        //     field: "status",
        //     minWidth: 150,
        //     headerName: "Status",
        //     renderCell: (params) => (
        //         <Button className="text-white bg-green">Approved</Button>
        //     ),
        // },
        {
            field: "action",
            headerName: "Action",
            minWidth: 150,
            renderCell: (params) => (
                <div className="d-flex gap-2">
                    <Button  onClick={(e)=>{toggleEditMode(params.row)}} variant='contained' color='primary' style={{minWidth: "40px", maxWidth: "40px"}} ><BorderColorIcon /></Button>
                    <Button variant="contained" color="error"
                    style={{minWidth: "40px", maxWidth: "40px"}}
                    onClick={(e) => {
                        GetDeleteByID(params.row.emp_id)
                    }}
                    >
                        <DeleteForeverIcon />
                    </Button>
                </div>
            ),
        },
            {
                field: "block",
                headerName: "Block",
                minWidth: 150,
                renderCell: (params) => (
                    <div className="d-flex gap-2">
                        {blockStatus[params.row.id] ?
                        <Button variant="contained" color="error" onClick={() => handleToggleBlock(params.row.id)}
                        style={{minWidth: "40px", maxWidth: "40px"}}
                        ><BlockIcon /
                        
                        ></Button>
                            :
                            <Button className="text-white bg-warning border-warning" onClick={() => handleToggleBlock(params.row.id)}> Un-Block </Button>
                        }
                    </div>
                ),
            },
            {
                field: "roles",
                headerName: "Roles",
                minWidth: 150,
                renderCell: (params) => (
                    <Button variant="contained" color="primary" onClick={() => toggleEmployeeRoles(params.row.id)}>Roles</Button>
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

            {/* <div className='flex'>

                <h4 className='p-3 px-4 mt-3 bg-transparent text-white headingBelowBorder' style={{ maxWidth: "15rem", minWidth: "15rem" }}>Employee List</h4>

                <div className='AttendenceNavBtn w-100 py-2 px-4 gap-3 justify-content-end'>
                    <div className={`py-2 px-4 border shadow rounded-2 cursor-p hoverThis text-white Fw_500 d-flex align-items-center justify-content-center `} style={{ minWidth: "15rem", maxWidth: "15rem" }} onClick={toggleModal} >
                        Add Employee
                    </div>
                </div>
            </div>
            <div className='p-4'>
                <AdminDataTable rows={DataWithID(data)} columns={column} CustomToolbar={CustomToolbar} />
            </div> */}

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
                  📊 All Employee List
                </h4>
                <p className='text-white-50 mb-0' style={{ fontSize: '0.9rem' }}>
                  Manage and track all employee
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
                  Add New Employee
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Table Section */}
          <div className="flex-grow-1 px-4 pb-4 " style={{ overflow: 'hidden' }}>
              <AdminDataTable
               rows={DataWithID(data)} columns={column} CustomToolbar={CustomToolbar}
              />
            </div>
        </div>
      </div>


        </Fragment>
    )
}

export default ManageEmployee;