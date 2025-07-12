import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom/dist';
import AddNewCustomerForm from './Froms/AddNewCustomerForm';
import ModalComponent from '../../Elements/ModalComponent';
import AdminDataTable from '../../Elements/AdminDataTable';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllCustomers, FilterCustomers, DynamicFilterCustomers } from '../../../Store/Actions/Dashboard/Customer/CustomerActions';
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
import SearchIcon from '@mui/icons-material/Search';
import { 
    Button, 
    Tooltip, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Collapse, 
    IconButton, 
    useMediaQuery, 
    useTheme,
    Box,
    Typography,
    InputAdornment,
    Paper,
    Chip,
    Badge
} from '@mui/material';
import UpdateCustomerForm from './Froms/UpdateCustomerForm';
import CustomerView from './View/CustomerView';
import AdminNavItems from '../../Elements/AdminNavItems';


const ManageCustomer = () => {
    const navigate = useNavigate()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [showFilters, setShowFilters] = useState(!isMobile)
    const [globalSearch, setGlobalSearch] = useState('')

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

    const apartment_options = [
      { value: "Shiv Shakti Apartment", label: "Shiv Shakti Apartment" },
      { value: "Lottan Apartment", label: "Lottan Apartment" },
      { value: "Sai Apartment", label: "Sai Apartment" },
      { value: "Geetanjali Apartment", label: "Geetanjali Apartment" },
      { value: "Ganga Apartment", label: "Ganga Apartment" },
      { value: "Deepmala Apartment", label: "Deepmala Apartment" },
      { value: "Yamuna Apartment", label: "Yamuna Apartment" },
      { value: "Krishna Apartment", label: "Krishna Apartment" },
      { value: "Ashirwad Apartment", label: "Ashirwad Apartment" },
      { value: "Swagat Apartment", label: "Swagat Apartment" },
    ];

    const area_option = [
      { value: "Tigri", label: "Tigri" },
      { value: "Tigri Village", label: "Tigri Village" },
      { value: "Tigri Extn.", label: "Tigri Extn." },
      { value: "Tigri Camp", label: "Tigri Camp" },
      { value: "Karnal Farm Tigri", label: "Karnal Farm Tigri" },
      { value: "DDA Flat Tigri", label: "DDA Flat Tigri" },
      { value: "Khanpur", label: "Khanpur" },
      { value: "Khanpur Extn.", label: "Khanpur Extn." },
      { value: "Shiv Park", label: "Shiv Park" },
      { value: "Duggal Colony", label: "Duggal Colony" },
      { value: "Devli Road", label: "Devli Road" },
      { value: "Devli Extension", label: "Devli Extension" },
      { value: "Krishna Park", label: "Krishna Park" },
      { value: "Jawahar Park", label: "Jawahar Park" },
      { value: "Raju Park", label: "Raju Park" },
      { value: "Durga Vihar", label: "Durga Vihar" },
      { value: "Bandh Road Sangam Vihar", label: "Bandh Road Sangam Vihar" },
      { value: "Sangam Vihar", label: "Sangam Vihar" },
      { value: "Madangir", label: "Madangir" },
      { value: "Dakshinpuri", label: "Dakshinpuri" },
      { value: "BSF Campus", label: "BSF Campus" },
      { value: "RPS Colony", label: "RPS Colony" },
    ];
    
    const block_option = [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
      { value: "E", label: "E" },
      { value: "F", label: "F" },
      { value: "G", label: "G" },
      { value: "H", label: "H" },
    ];

    const custId_option = [
      { value: "0", label: "Active" },
      { value: "1", label: "Inactive" },
    ];
    const status_option = [
      { value: "0", label: "Active" },
      { value: "1", label: "Inactive" },
    ];

    // Auto-hide filters on mobile when screen size changes
    useEffect(() => {
        setShowFilters(!isMobile)
    }, [isMobile])

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
                            if (filters[key] && filters[key] !== '') {
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
        endDate: '',
        startDate: '',
        globalSearch: '',
        block: '',
        area: '',
        custId: '',
        name: '',
        mobile: '',
        email: '',
        apartment: '',
        
    })
    const [isFiltered, setIsFiltered] = useState(false)
    const [plans, setPlans] = useState([])
    const debounceTimer = useRef(null)

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
    // const handleFilterChange = (field, value) => {
    //     setFilters(prev => ({
    //         ...prev,
    //         [field]: value
    //     }))
    // }



    const [blockStatus, setBlockStatus] = useState({});


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
                            if (filters[key] && filters[key]!== '') {
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

    // Debug: Log filter state changes
    useEffect(() => {
        console.log('Current filters state:', filters);
    }, [filters])

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
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
        { 
            field: "id", 
            headerName: "Cust. ID", 
            minWidth: isMobile ? 80 : 100, 
            editable: false,
            flex: isMobile ? 0 : undefined
        },
        { 
            field: "name", 
            headerName: "Cust. Name", 
            minWidth: isMobile ? 120 : 150, 
            editable: false,
            flex: isMobile ? 1 : undefined
        },
        { 
            field: "mobile", 
            headerName: "Contact", 
            minWidth: isMobile ? 100 : 120, 
            editable: false,
            flex: isMobile ? 0 : undefined
        },
        { 
            field: "address", 
            headerName: "Address", 
            flex: 1,
            minWidth: isMobile ? 180 : 350,
            renderCell: (params) => (
                <div style={{ 
                    whiteSpace: "pre-line",
                    fontSize: isMobile ? '11px' : '12px',
                    lineHeight: isMobile ? '1.3' : '1.4',
                    padding: '4px 0',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <div>
                        {params.row.address && <span>{params.row.address}</span>}
                        {params.row.area && <span>{params.row.address ? ', ' : ''}{params.row.area}</span>}
                        {params.row.apartment && <span>{params.row.apartment ? ', ' : ''}{params.row.apartment}</span>}
                        {params.row.block && <span>{params.row.block ? ', ' : ''}{params.row.block}</span>}
                    </div>
                </div>
            ),
            editable: false,
            hide: isSmallMobile
        },
        {   
            field: "plan", 
            headerName: "Plan Amt.", 
            minWidth: isMobile ? 80 : 100, 
            editable: false,
            hide: isSmallMobile,
            renderCell: (params) => (
                <span style={{ color: '#1976d2', fontWeight: 'bold' }}>
                    ₹{params.row.billing_amount || 0}
                </span>
            )
        },
        { 
            field: "validity", 
            headerName: "Validity", 
            minWidth: isMobile ? 80 : 100, 
            editable: false,
            hide: isSmallMobile,
            renderCell: (params) => (
                <span style={{ fontSize: '11px' }}>
                    From & To
                </span>
            )
        },
        { 
            field: "balance", 
            headerName: "Balance", 
            minWidth: isMobile ? 80 : 100, 
            editable: false,
            hide: isSmallMobile,
            renderCell: (params) => (
                <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                    ₹{params.row.balance || 0}
                </span>
            )
        },
        { 
            field: "last_payment", 
            headerName: "Last Payment", 
            minWidth: isMobile ? 100 : 120, 
            editable: false,
            hide: isSmallMobile,
            renderCell: (params) => (
                <span style={{ fontSize: '11px' }}>
                    [Date]
                </span>
            )
        },
        {
            field: "action",
            headerName: "Action",
            minWidth: isMobile ? 140 : 180,
            sortable: false,
            renderCell: (params) => (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '4px 0'
                }}>
                    {/* First Row of Action Buttons */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '3px', 
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Tooltip title="View" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#4caf50', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => toggleView(params.row)}
                            >
                                <VisibilityIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#2196f3', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => GetUpdateCustomer(params.row)}
                            >
                                <BorderColorIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#f44336', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => GetDeleteByID(params.row.user_id)}
                            >
                                <DeleteForeverIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Block/Unblock" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#ff9800', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handleToggleBlock(params.row.user_id)}
                            >
                                <BlockIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Remainder" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#9c27b0', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handleAddRemainder(params.row.user_id)}
                            >
                                <NotificationsIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>
                    </div>

                    {/* Second Row of Action Buttons */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '3px', 
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Tooltip title="Payment" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#607d8b', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handlePaymentEntry(params.row.user_id)}
                            >
                                <PaymentIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Recharge" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#795548', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handleRecharge(params.row.user_id)}
                            >
                                <BatteryChargingFullIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Bills" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#ff5722', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handleBillTransaction(params.row.user_id)}
                            >
                                <ReceiptIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Complain" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#e91e63', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handleComplain(params.row.user_id)}
                            >
                                <ReportProblemIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="WhatsApp" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#25d366', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handleWhatsAppMessage(params.row.user_id, params.row.name, params.row.mobile)}
                            >
                                <WhatsAppIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>
                    </div>
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

    // Add service provider controller 
    const [addCustomer, setAddCustomer] = useState(false)
    const [updateCustomer, setUpdateCustomer]=useState(false)
    const ToggleAddCustomer = () => setAddCustomer(!addCustomer)
    const ToggleUpdateCustomer = () => setUpdateCustomer(!updateCustomer)

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
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f5f5f5',
                paddingTop: '60px'
            }
        }
        
        return {
            width: `calc(100% - ${sidebarCollapsed ? '80px' : '280px'})`,
            marginLeft: sidebarCollapsed ? '80px' : '280px',
            height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
            transition: 'width 0.3s ease, margin-left 0.3s ease'
        }
    }


    // In your filter change handler
const handleFilterChange = (field, value) => {
    const actualValue = value.value !== undefined ? value.value : value;
    
    console.log('Filter change:', field, actualValue); // Debug log
    
    // Update local state
    setFilters(prev => {
        const newFilters = {
            ...prev,
            [field]: actualValue
        };
        console.log('Updated filters:', newFilters); // Debug log
        return newFilters;
    });

    // If value is empty string ("All" option), fetch all customers
    if (actualValue === '' || actualValue === null || actualValue === undefined) {
        dispatch(GetAllCustomers());
        setIsFiltered(false);
    } else {
        // Apply filter with non-empty value
        const filterData = {
            [field]: actualValue
        }
        dispatch(FilterCustomers(filterData));
        setIsFiltered(true);
    }
};


// Global search handler with debouncing
const handleGlobalSearch = (value) => {
  setGlobalSearch(value);
  
  // Clear previous debounce timer
  if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
  }
  
  // Set new debounce timer (500ms delay)
  debounceTimer.current = setTimeout(() => {
      if (value === '') {
          // If search is empty, get all customers
          dispatch(GetAllCustomers());
          setIsFiltered(false);
      } else {
          const filterData = {
              globalSearch: value
          };
          dispatch(DynamicFilterCustomers(filterData));
          setIsFiltered(true);
      }
  }, 500);
};


const handleClearFilters = () => {
  setFilters({
      status: '',
      locality: '',
      endDate: '',
      startDate: '',
      globalSearch: '',
      block: '',
      area: '',
      custId: '',
      name: '',
      mobile: '',
      email: '',
      apartment: '',
  });
  setGlobalSearch('');
  // Fetch all customers
  dispatch(GetAllCustomers());
  setIsFiltered(false);
};


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
           
<div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
        {/* Left Sidebar - Hidden on mobile */}
        {!isMobile && <AdminNavItems onSidebarToggle={handleSidebarToggle} />}
        {isMobile && <AdminNavItems onSidebarToggle={handleSidebarToggle} />}

        {/* Main Content */}
        <div className="main-content" style={getMainContentStyle()}>

        <Paper 
              elevation={1} 
              style={{
                margin: isMobile ? '5px 10px 5px 10px' : '5px 10px 5px 10px',
                borderRadius: '6px'
              }}
            >
              <Box sx={{ p: 1 }}>
        <div className="row align-items-center">
                  <div className="col-md-3 col-12 mb-1">
                    <FormControl fullWidth size="small">
                      <InputLabel shrink sx={{ fontSize: '0.875rem' }}>Cust. Id</InputLabel>
                      <Select
                        value={filters.status}
                        label="Cust. Id"
                        displayEmpty
                        notched
                        onChange={(e) => {
                          const value = e.target.value
                          handleFilterChange('status', { value })
                        }}
                        sx={{ 
                          height: '36px',
                          '& .MuiSelect-select': {
                            fontSize: '0.875rem',
                            padding: '8px 12px'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.875rem' }}>All</MenuItem>
                        <MenuItem value="0" sx={{ fontSize: '0.875rem' }}>Active</MenuItem>
                        <MenuItem value="1" sx={{ fontSize: '0.875rem' }}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  
                  <div className="col-md-6 col-12 mb-1">
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type here for a Global Search"
                      value={globalSearch}
                      onChange={(e) => {
                        const value = e.target.value
                        handleGlobalSearch(value)
                      }}
                      sx={{ 
                        '& .MuiInputBase-root': {
                          height: '36px',
                          fontSize: '0.875rem'
                        },
                        '& .MuiInputBase-input': {
                          padding: '8px 12px'
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: '18px' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  
                  <div className="col-md-3 col-12 mb-1">
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button
                        variant="contained"
                        // onClick={"#"}
                        size="small"
                        sx={{ 
                          flex: 1,
                          height: '32px',
                          fontSize: '0.75rem',
                          backgroundColor:  '#ff9800',
                          '&:hover': {
                            backgroundColor: '#f57c00'
                          }
                        }}
                      >
                        Search
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleClearFilters}
                        size="small"
                        sx={{ 
                          flex: 1,
                          height: '32px',
                          fontSize: '0.75rem'
                        }}
                      >
                        Clear
                      </Button>
                    </Box>
                  </div>
                </div>
              </Box>
            </Paper>

          {/* Top Header Section */}
          <Paper 
            elevation={2} 
            style={{
              margin: isMobile ? '0 10px 5px 10px' : '5px 10px 5px 10px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
              height: '65px'
            }}
          >
            <Box sx={{ p: isMobile ? 1 : 1.5 }} >
              <div className="row align-items-center">
                <div className="col-md-6 col-12">
                  <Typography variant={isMobile ? "h6" : "h6"} fontWeight="600" sx={{ fontSize: '1.1rem' }}>
                    Customer Management
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.2, fontSize: '0.75rem' }}>
                    Manage customers, connections, and billing
                  </Typography>
                </div>
                <div className="col-md-6 col-12">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: isMobile ? 'center' : 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={ToggleAddCustomer}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: '500',
                        fontSize: '0.8rem',
                        height: '32px',
                        padding: '4px 12px'
                      }}
                    >
                      Add Connection
                    </Button>
                  </Box>
                </div>
              </div>
            </Box>
          </Paper>

          {/* Main Content */}
            {/* Search and Filter Section */}
            <Paper 
              elevation={1} 
              style={{
                margin: isMobile ? '0 10px 5px 10px' : '0 10px 5px 10px',
                borderRadius: '6px'
              }}
            >
              <Box sx={{ p: 1 }}>
              
                {/* Additional Filters Row */}
                <div className="row mt-1">
                  <div className="col-md-3 col-3 mb-1">
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Start Date"
                      value={filters.startDate}
                      onChange={(e) => {
                        handleFilterChange('startDate', { value: e.target.value })
                      }}
                      InputLabelProps={{ shrink: true, sx: { fontSize: '0.875rem' } }}
                      sx={{ 
                        '& .MuiInputBase-root': {
                          height: '36px',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </div>
                  
                  <div className="col-md-3 col-3 mb-1">
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="End Date"
                      value={filters.endDate}
                      onChange={(e) => {
                        handleFilterChange('endDate', { value: e.target.value })
                      }}
                      InputLabelProps={{ shrink: true, sx: { fontSize: '0.875rem' } }}
                      sx={{ 
                        '& .MuiInputBase-root': {
                          height: '36px',
                          fontSize: '0.875rem'
                        }
                      }}
                    />
                  </div>
                  
                  <div className="col-md-3 col-3 mb-1">
                    <FormControl fullWidth size="small">
                      <InputLabel shrink sx={{ fontSize: '0.875rem' }}>Status</InputLabel>
                      <Select
                        value={filters.status}
                        label="Status"
                        displayEmpty
                        notched
                        onChange={(e) => {
                          const value = e.target.value
                          handleFilterChange('status', { value })
                        }}
                        sx={{ 
                          height: '36px',
                          '& .MuiSelect-select': {
                            fontSize: '0.875rem',
                            padding: '8px 12px'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.875rem' }}>All</MenuItem>
                        <MenuItem value="0" sx={{ fontSize: '0.875rem' }}>Active</MenuItem>
                        <MenuItem value="1" sx={{ fontSize: '0.875rem' }}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  
                  <div className="col-md-3 col-3 mb-1">
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search by Name"
                      value={filters.name}
                      onChange={(e) => {
                        const value = e.target.value
                        handleFilterChange('name', { value })
                      }}
                      sx={{ 
                        '& .MuiInputBase-root': {
                          height: '36px',
                          fontSize: '0.875rem'
                        },
                        '& .MuiInputBase-input': {
                          padding: '8px 12px'
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <span style={{ fontSize: '16px' }}>👤</span>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                 
                </div>

                {/* Additional Filter Options */}
                <div className="row mt-1">
                  <div className="col-md-3 col-3 mb-1">
                    <FormControl fullWidth size="small">
                      <InputLabel shrink sx={{ fontSize: '0.875rem' }}>Search by Block</InputLabel>
                      <Select
                        value={filters.block}
                        label="Search by Block"
                        displayEmpty
                        notched
                        onChange={(e) => {
                          const value = e.target.value
                          handleFilterChange('block', { value })
                        }}
                        sx={{ 
                          height: '36px',
                          '& .MuiSelect-select': {
                            fontSize: '0.875rem',
                            padding: '8px 12px'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.875rem' }}>All</MenuItem>
                        {block_option.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  
                  <div className="col-md-3 col-3 mb-1">
                    <FormControl fullWidth size="small">
                      <InputLabel shrink sx={{ fontSize: '0.875rem' }}>Search by Locality</InputLabel>
                      <Select
                        value={filters.locality}
                        label="Search by Locality"
                        displayEmpty
                        notched
                        onChange={(e) => {
                          const value = e.target.value
                          handleFilterChange('locality', { value })
                        }}
                        sx={{ 
                          height: '36px',
                          '& .MuiSelect-select': {
                            fontSize: '0.875rem',
                            padding: '8px 12px'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.875rem' }}>All</MenuItem>
                        {apartment_options.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

 
                  <div className="col-md-3 col-3 mb-1">
                    <FormControl fullWidth size="small">
                      <InputLabel shrink sx={{ fontSize: '0.875rem' }}>Search by Area</InputLabel>
                      <Select
                        value={filters.area}
                        label="Search by Area"
                        displayEmpty
                        notched
                        onChange={(e) => {
                          const value = e.target.value
                          handleFilterChange('area', { value })
                        }}
                        sx={{ 
                          height: '36px',
                          '& .MuiSelect-select': {
                            fontSize: '0.875rem',
                            padding: '8px 12px'
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.875rem' }}>All</MenuItem>
                        {area_option.map((option) => (
                          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.875rem' }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="col-md-3 col-3 mb-2">
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search by Customer ID"
                      value={filters.custId}
                      onChange={(e) => {
                        const value = e.target.value
                        handleFilterChange('custId', { value })
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            🆔
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>

                  </div>

                {/* Alphabetical Filter */}
                <div className="row mt-1">
                  <div className="col-md-12 col-12 mb-1">
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 0.5, 
                      alignItems: 'center', 
                      overflowX: 'auto',
                      whiteSpace: 'nowrap',
                      '&::-webkit-scrollbar': {
                        height: '3px'
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '2px'
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: '2px'
                      }
                    }}>
                      <Typography variant="body2" sx={{ minWidth: 'fit-content', mr: 0.5, fontSize: '0.75rem' }}></Typography>
                      {['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => (
                        <Chip 
                          key={letter}
                          label={letter} 
                          size="small" 
                          clickable 
                          sx={{   
                            minWidth: '24px',
                            height: '22px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            backgroundColor: '#f0f0f0',
                            color: '#333'
                          }}
                          onClick={() => {}}
                        />
                      ))}
                    </Box>
                  </div>
                </div>
              </Box>
            </Paper>
                  
            {/* Data Table */}
            <Paper>
              <Box sx={{ p: 1 }}>
                <div>
                  <AdminDataTable
                    rows={DataWithID(isFiltered ? filteredData.data : data.data)} 
                    columns={column} 
                    CustomToolbar={CustomToolbar} 
                  />
                </div>
              </Box>
            </Paper>
          </div>
        </div>
        </Fragment>
        </>
    )
}

export default ManageCustomer