import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom/dist';
import AddNewCustomerForm from './Froms/AddNewCustomerForm';
import ModalComponent from '../../Elements/ModalComponent';
import AdminDataTable from '../../Elements/AdminDataTable';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllCustomers, FilterCustomers } from '../../../Store/Actions/Dashboard/Customer/CustomerActions';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../config';
import Swal from 'sweetalert2';
import VisibilityIcon from '@mui/icons-material/Visibility'
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import BlockIcon from '@mui/icons-material/Block'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Button, Tooltip, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import UpdateCustomerForm from './Froms/UpdateCustomerForm';
import CustomerView from './View/CustomerView';
import AdminNavItems from '../../Elements/AdminNavItems';


const ManageCustomer = () => {
    const navigate = useNavigate()

    // Area options for locality filter
    const areaOptions = [
        "Tigri",
        "Tigri Village", 
        "Tigri Extn.",
        "Tigri Camp",
        "Karnal Farm Tigri",
        "DDA Flat Tigri",
        "Khanpur",
        "Khanpur Extn.",
        "Shiv Park",
        "Duggal Colony",
        "Devli Road",
        "Devli Extension",
        "Krishna Park",
        "Jawahar Park",
        "Raju Park",
        "Durga Vihar",
        "Bandh Road Sangam Vihar",
        "Sangam Vihar",
        "Madangir",
        "Dakshinpuri",
        "BSF Campus",
        "RPS Colony"
    ]

    // // Company options for company filter
    // const companyOptions = [
    //     "Airtel",
    //     "BSNL", 
    //     "Jio",
    //     "Vi (Vodafone Idea)",
    //     "Railtel",
    //     "PowerGrid",
    //     "Tata Communications",
    //     "Bharti Airtel",
    //     "Reliance Jio",
    //     "Local ISP",
    //     "Other"
    // ]

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
                const response = await axios.get(API_URL + '/customer/delete/' + user_id)
                if (response.status === 200) {
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                    
                    // Refresh data after successful deletion
                    if (isFiltered) {
                        // Re-apply current filters
                        const filterData = {}
                        Object.keys(filters).forEach(key => {
                            if (filters[key] && filters[key].trim() !== '') {
                                filterData[key] = filters[key]
                            }
                        })
                        if (Object.keys(filterData).length > 0) {
                            dispatch(FilterCustomers(filterData))
                        }
                    } else {
                        dispatch(GetAllCustomers())
                    }
                } else {
                    Swal.fire({
                        title: 'failed to delete try again',
                        icon: "error",
                    })
                }
            }
        })
    }

    // Handler functions for new actions
    const handleAddRemainder = (customerId) => {
        // TODO: Implement add remainder functionality
        console.log('Add remainder for customer:', customerId);
        Swal.fire('Info', 'Add Remainder functionality to be implemented', 'info');
    }

    const handlePaymentEntry = (customerId) => {
        // TODO: Implement payment entry functionality
        console.log('Payment entry for customer:', customerId);
        Swal.fire('Info', 'Payment Entry functionality to be implemented', 'info');
    }

    const handleRecharge = (customerId) => {
        // TODO: Implement recharge functionality
        console.log('Recharge for customer:', customerId);
        Swal.fire('Info', 'Recharge functionality to be implemented', 'info');
    }

    const handleBillTransaction = (customerId) => {
        // TODO: Implement bill/transaction functionality
        console.log('Bill/Transaction for customer:', customerId);
        Swal.fire('Info', 'Bill/Transaction functionality to be implemented', 'info');
    }

    const handleComplain = (customerId) => {
        // TODO: Implement complain functionality
        console.log('Complain for customer:', customerId);
        Swal.fire('Info', 'Complain functionality to be implemented', 'info');
    }

    const handleWhatsAppMessage = (customerId, customerName, mobile) => {
        // TODO: Implement WhatsApp message functionality
        console.log('Send WhatsApp message to customer:', customerId, customerName, mobile);
        Swal.fire('Info', 'WhatsApp Message functionality to be implemented', 'info');
    }

    
    const dispatch = useDispatch()
    const { data, isLoading } = useSelector(state => state.GetAllCustomerReducer)
    const { data: filteredData, isLoading: filterLoading } = useSelector(state => state.FilterCustomersReducer)
    const [isBlocked, setIsBlocked] = useState({})
    const [update, setUpdate]=useState([]);
    const [viewModal, setViewModel] = useState(false)
    const [print, setPrint] = useState(false)
    
    // Filter states
    const [filters, setFilters] = useState({
        status: '',
        locality: '',
        company: '',
        broadband: '',
        endDate: '',
        startDate: ''
    })
    const [isFiltered, setIsFiltered] = useState(false)
    const [plans, setPlans] = useState([])

    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined) {
            for (let item of data) {
                NewData.push({
                    ...item,
                    _id: data.indexOf(item)+1,
                    date: moment(item.createdAt).format("DD-MM-YYYY"),
                });
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
    }

    // Handle filter changes
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Apply filters
    const applyFilters = () => {
        const filterData = {}
        
        console.log(filters)
        
        // Only include non-empty filters
        Object.keys(filters).forEach(key => {
                filterData[key] = filters[key]
        })

        if (Object.keys(filterData).length > 0) {
            dispatch(FilterCustomers(filterData))
            setIsFiltered(true)
        } else {
            Swal.fire('Info', 'Please select at least one filter', 'info')
        }
    }

    // Clear filters
    const clearFilters = () => {
        setFilters({
            status: '',
            locality: '',
            company: '',
            broadband: '',
            endDate: '',
            startDate: ''
        })
        setIsFiltered(false)
        dispatch(GetAllCustomers())
    }
    
    const [blockStatus, setBlockStatus] = useState({});
 

    // Set initial block status when data changes
    useEffect(() => {
        const currentData = isFiltered ? filteredData.data : data.data;
        if (currentData && currentData.length > 0) {
            const initialBlockStatus = {};
            currentData.forEach(item => {
                initialBlockStatus[item.user_id] = item.is_block;
            });
            setBlockStatus(initialBlockStatus);
        }
    }, [data, filteredData, isFiltered]);

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
        axios.post(`${API_URL}/customer/block/${userId}`, { is_block: newBlockStatus })
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
                    
                    // Refresh data after successful update
                    if (isFiltered) {
                        // Re-apply current filters
                        const filterData = {}
                        Object.keys(filters).forEach(key => {
                            if (filters[key] && filters[key].trim() !== '') {
                                filterData[key] = filters[key]
                            }
                        })
                        if (Object.keys(filterData).length > 0) {
                            dispatch(FilterCustomers(filterData))
                        }
                    } else {
                        dispatch(GetAllCustomers())
                    }
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

    // Fetch plans for broadband filter
    const fetchPlans = async () => {
        try {
            const response = await axios.get(`${API_URL}/plan/getall`);
            if (response.data.status === 200) {
                setPlans(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    useEffect(() => {
        dispatch(GetAllCustomers())
        fetchPlans()
    }, [])

    const GetUpdateCustomer=(data)=>{
        setUpdate(data)
        ToggleUpdateCustomer();
    }

    const toggleView = (data) =>{
        setUpdate(data);
        setViewModel(!viewModal)
    }

    const column = [
        { field: "_id", headerName: "Sr No", minWidth: 50, editable: false },
        { field: "id", headerName: "Customer ID", minWidth: 120, editable: false },
        { field: "name", headerName: "Name", minWidth: 120, editable: false },
        { field: "username", headerName: "Username", minWidth: 120, editable: false },
        { 
            field: "address", 
            headerName: "Address", 
            minWidth: 350,
            minHeight: 200,
            renderCell: (params) => (
                <div style={{ whiteSpace: "pre-line" }}>
                    <div>
                        {params.row.address && <span>{params.row.address}</span>}
                        {params.row.area && <span>{params.row.address ? ', ' : ''}{params.row.area}</span>}
                        {params.row.apartment && <span>{(params.row.address || params.row.area) ? ', ' : ''}{params.row.apartment}</span>}
                    </div>
                    <div>
                        {params.row.block && <span>{params.row.block}</span>}
                        {params.row.t_address && <span>{params.row.block ? ', ' : ''}{params.row.t_address}</span>}
                    </div>
                </div>
            ),
            editable: false 
        },
        { field: "mobile", headerName: "Mobile No.", minWidth: 120, editable: false },
        { field: "status", headerName: "Status", minWidth: 120, editable: false },
        { field: "billing_amount", headerName: "Billing Amount", minWidth: 120, editable: false },
        {
            field: "action",
            headerName: "Action",
            minWidth: 400,
            renderCell: (params) => (
                <div className="d-flex gap-1 flex-wrap">
                    <Tooltip title="Edit Customer" arrow>
                        <Button variant='contained' color='primary' 
                            onClick={(e)=>{GetUpdateCustomer(params.row)}}
                            style={{minWidth: "32px", maxWidth: "32px", minHeight: "32px", maxHeight: "32px", padding: "4px"}}
                        >
                            <BorderColorIcon fontSize="small" />
                        </Button>
                    </Tooltip>

                    <Tooltip title="View Customer" arrow>
                        <Button variant="contained" color="success" 
                            onClick={(e)=>{toggleView(params.row)}}
                            style={{minWidth: "32px", maxWidth: "32px", minHeight: "32px", maxHeight: "32px", padding: "4px"}}
                        >
                            <VisibilityIcon fontSize="small" />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Add Remainder" arrow>
                        <Button variant="contained" color="warning" 
                            onClick={(e) => handleAddRemainder(params.row.user_id)}
                            style={{minWidth: "32px", maxWidth: "32px", minHeight: "32px", maxHeight: "32px", padding: "4px"}}
                        >
                            <NotificationsIcon fontSize="small" />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Payment Entry" arrow>
                        <Button variant="contained" color="info" 
                            onClick={(e) => handlePaymentEntry(params.row.user_id)}
                            style={{minWidth: "32px", maxWidth: "32px", minHeight: "32px", maxHeight: "32px", padding: "4px"}}
                        >
                            <PaymentIcon fontSize="small" />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Recharge" arrow>
                        <Button variant="contained" 
                            onClick={(e) => handleRecharge(params.row.user_id)}
                            style={{minWidth: "32px", maxWidth: "32px", minHeight: "32px", maxHeight: "32px", padding: "4px", backgroundColor: "#9c27b0"}}
                        >
                            <BatteryChargingFullIcon fontSize="small" />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Bill/All Transactions" arrow>
                        <Button variant="contained" 
                            onClick={(e) => handleBillTransaction(params.row.user_id)}
                            style={{minWidth: "32px", maxWidth: "32px", minHeight: "32px", maxHeight: "32px", padding: "4px", backgroundColor: "#795548"}}
                        >
                            <ReceiptIcon fontSize="small" />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Complain" arrow>
                        <Button variant="contained" 
                            onClick={(e) => handleComplain(params.row.user_id)}
                            style={{minWidth: "32px", maxWidth: "32px", minHeight: "32px", maxHeight: "32px", padding: "4px", backgroundColor: "#ff9800"}}
                        >
                            <ReportProblemIcon fontSize="small" />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Send WhatsApp Message" arrow>
                        <Button variant="contained" 
                            onClick={(e) => handleWhatsAppMessage(params.row.user_id, params.row.name, params.row.mobile)}
                            style={{minWidth: "32px", maxWidth: "32px", minHeight: "32px", maxHeight: "32px", padding: "4px", backgroundColor: "#25d366"}}
                        >
                            <WhatsAppIcon fontSize="small" />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Delete Customer" arrow>
                        <Button onClick={(e) => {
                                GetDeleteByID(params.row.user_id)
                            }} variant="contained" color="error"
                            style={{minWidth: "32px", maxWidth: "32px", minHeight: "32px", maxHeight: "32px", padding: "4px"}}
                        >
                            <DeleteForeverIcon fontSize="small" />
                        </Button>
                    </Tooltip>
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

    // Add service provider controller 
    const [addCustomer, setAddCustomer] = useState(false)
    const [updateCustomer, setUpdateCustomer]=useState(false)
    const ToggleAddCustomer = () => setAddCustomer(!addCustomer)
    const ToggleUpdateCustomer = () => setUpdateCustomer(!updateCustomer)

    return (
    <>

        <Fragment>
            <ModalComponent modal={addCustomer} toggle={ToggleAddCustomer} data={<AddNewCustomerForm  prop={ToggleAddCustomer } />} modalTitle={"Add New Customer"} size={"xl"} scrollable={true} />

            <ModalComponent
                data={<CustomerView 
                data={update} toggleModal={toggleView} />}
                modalTitle={"Customer Profile"}
                modal={viewModal}
                toggle={toggleView}
                size={"xl"} scrollable={true}
            />

   
            <ModalComponent modal={updateCustomer} toggle={ToggleUpdateCustomer} data={<UpdateCustomerForm  prop={ToggleUpdateCustomer } updateData={update} />} modalTitle={"Update Customer"} size={"xl"} scrollable={true} />

            {/* <div className='flex'>
            <h4 className='p-3 px-4 mt-3 bg-transparent text-white headingBelowBorder' style={{ maxWidth: "15rem", minWidth: "15rem" }}> Customer List </h4>

            <div className='AttendenceNavBtn w-100 py-2 px-4 gap-3 justify-content-end'>
                <div className={`py-2 px-4 border shadow rounded-2 cursor-p hoverThis text-white Fw_500 d-flex align-items-center justify-content-center `} style={{ minWidth: "15rem", maxWidth: "15rem" }} onClick={ToggleAddCustomer} >
                Add New Customer
                </div>

                </div>
              </div> */}
           
           
<div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
        {/* Left Sidebar - 1/4 width */}
        <div
          className="sidebar"
          style={{
            width: '25%',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            overflowY: 'auto',
            zIndex: 999,
          }}
        >
          <AdminNavItems />
        </div>

        {/* Main Content - 3/4 width */}
        <div
          className="main-content"
          style={{
            width: '75%',
            height: '100vh',
            marginLeft: '25%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8f9fa'
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
                  📱 Customer List
                </h4>
                <p className='text-white-50 mb-0' style={{ fontSize: '0.9rem' }}>
                  Manage and track all customers
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
                  onClick={ToggleAddCustomer}
                >
                  <span>💳</span>
                  Add New Customer
                </div>
              </div>
            </div>
          </div>

          <div className='p-4 border-bottom' >
                <div className='row align-items-end p-2 rounded-2' style={{ background: "#fff" }}>
                    <div className='col-md-2'>
                        <FormControl fullWidth size="small" sx={{ background: "#fff" }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filters.status}
                                label="Status"
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                sx={{ background: "#fff" }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="0">Active</MenuItem>
                                <MenuItem value="1">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    
                    <div className='col-md-2'>
                        <FormControl fullWidth size="small" sx={{ background: "#fff" }}>
                            <InputLabel>Locality</InputLabel>
                            <Select
                                value={filters.locality}
                                label="Locality"
                                onChange={(e) => handleFilterChange('locality', e.target.value)}
                                sx={{ background: "#fff" }}
                            >
                                <MenuItem value="">All</MenuItem>
                                {areaOptions.map((area, index) => (
                                    <MenuItem key={index} value={area}>
                                        {area}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div> 
                   
                    <div className='col-md-2'>
                        <FormControl fullWidth size="small" sx={{ background: "#fff" }}>
                            <InputLabel>Broadband</InputLabel>
                            <Select
                                value={filters.broadband}
                                label="Broadband"
                                onChange={(e) => handleFilterChange('broadband', e.target.value)}
                                sx={{ background: "#fff" }}
                            >
                                <MenuItem value="">All</MenuItem>
                                {plans.map((plan) => (
                                    <MenuItem key={plan.id} value={plan.id}>
                                        {plan.plan} - ₹{plan.finalPrice}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                                
                    <div className='col-md-2'>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="Start Date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ background: "#fff" }}
                            InputProps={{ style: { background: "#fff" } }}
                        />
                    </div>

                    <div className='col-md-2'>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="End Date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ background: "#fff" }}
                            InputProps={{ style: { background: "#fff" } }}
                        />
                    </div>
                    
                    <div className='col-md-2'>
                        <div className='d-flex gap-2'>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={applyFilters}
                                size="small"
                                style={{minWidth: "80px", background: "#fff", color: "#1976d2"}}
                            >
                                Filter
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="secondary" 
                                onClick={clearFilters}
                                size="small"
                                style={{minWidth: "80px", background: "#fff"}}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
                
                {isFiltered && (
                    <div className='mt-3'>
                        <span className='badge bg-info'>
                            Showing {filteredData?.count || 0} filtered results
                        </span>
                    </div>
                )}
            </div> 
          
          {/* Data Table Section */}
          <div className="flex-grow-1 px-4 pb-4 " style={{ overflow: 'hidden' }}>
              <AdminDataTable
               rows={DataWithID(isFiltered ? filteredData.data : data.data)} 
               columns={column} 
               CustomToolbar={CustomToolbar} 
               loading={isFiltered ? filterLoading : isLoading} 
              />
            </div>
        </div>
      </div>
        </Fragment>
        </>
    )
}


export default ManageCustomer