import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom/dist';
import AddNewCustomerForm from './Forms/AddNewCustomerForm';
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
import HistoryIcon from '@mui/icons-material/History';
import * as XLSX from 'xlsx';
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
import UpdateCustomerForm from './Forms/UpdateCustomerForm';
import CustomerView from './View/CustomerView';
import AdminNavItems from '../../Elements/AdminNavItems';
import SetReminderForm from './Forms/SetReminderForm';
import PaymentForm from './Forms/PaymentForm';
import ComplaintForm from './Forms/ComplaintForm';

import BillingDetails from './Forms/BillingDetails';

const ManageCustomer = () => {
    const navigate = useNavigate()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [showFilters, setShowFilters] = useState(!isMobile)
    const [globalSearch, setGlobalSearch] = useState('')
    const [billingModal, setBillingModal] = useState(false)


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

    const GetDeleteByID = (id) => {
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
                const response = await axios.get(API_URL + '/customer/delete/' + id)
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
    const handleAddRemainder = (customerId, customerData) => {
        setSelectedCustomer({ id: customerId, ...customerData });
        setReminderModal(true);
    }

    const handleReminderSubmit = async (formData) => {
        setFormLoading(true);
        try {
            const response = await axios.post(`${API_URL}/customer/${selectedCustomer.id}/reminder`, formData);
            if (response.data.status) {
                Swal.fire('Success', 'Reminder set successfully!', 'success');
                setReminderModal(false);
            } else {
                Swal.fire('Error', response.data.message || 'Failed to set reminder', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to set reminder', 'error');
            console.error('Error setting reminder:', error);
        } finally {
            setFormLoading(false);
        }
    }

    const handlePaymentEntry = (customerId, customerData) => {
        setSelectedCustomer({ id: customerId, ...customerData });
        setPaymentModal(true);
    }

    const handlePaymentSubmit = async (formData) => {
        setFormLoading(true);
        try {
            const response = await axios.post(`${API_URL}/customer/re-payment`, formData);
            if (response.data.status) {
                Swal.fire('Success', 'Payment processed successfully!', 'success');
                setPaymentModal(false);
                // Refresh data
                if (isFiltered) {
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
                Swal.fire('Error', response.data.message || 'Failed to process payment', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to process payment', 'error');
            console.error('Error processing payment:', error);
        } finally {
            setFormLoading(false);
        }
    }

    const handleComplain = (customerData) => {
        console.log("customerData--",customerData)
        setSelectedCustomer(customerData);
        setComplaintModal(true);  
    }

    const handleComplaintSubmit = async (formData) => {
        console.log("formData--",formData)
        setFormLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/complain/add`, formData);

            Swal.fire('Success', 'Complaint registered successfully!', 'success');
            setComplaintModal(false);
        } catch (error) {
            Swal.fire('Error', error.response.data.message || 'Failed to register complaint', 'error');
            console.error('Error registering complaint:', error);
        } finally {
            setFormLoading(false);
        }
    }

    const handleWhatsAppMessage = (customerId, customerData) => {
        const phoneNumber = customerData.mobile || customerData.alternate_mobile;
        
        if (!phoneNumber) {
            Swal.fire('Error', 'No phone number available for this customer', 'error');
            return;
        }

        // Show message type selection
        Swal.fire({
            title: 'Select Message Type',
            html: `
                <div style="text-align: left;">
                    <p><strong>To:</strong> ${customerData.name}</p>
                    <p><strong>Phone:</strong> ${phoneNumber}</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#25d366',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Payment Reminder',
            cancelButtonText: 'Payment Confirmation',
            showDenyButton: true,
            denyButtonText: 'Cancel',
            denyButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed || result.dismiss === Swal.DismissReason.cancel) {
                let message, messageType;
                
                if (result.isConfirmed) {
                    // Payment Reminder Message
                    message = `Dear ${customerData.name},

Your internet bill payment is due. Please make the payment to avoid service interruption.

Amount: ₹${customerData.billing_amount || 'XXX'}
Due Date: ${new Date().toLocaleDateString()}

Thank you for choosing our service.`;
                    messageType = 'Payment Reminder';
                } else {
                    // Payment Confirmation Message
                    message = `Dear ${customerData.name},

We have received your payment of ₹${customerData.billing_amount || 'XXX'}.

Your service will continue uninterrupted. Thank you for your prompt payment.

For any queries, please contact us.`;
                    messageType = 'Payment Confirmation';
                }

                // Encode the message for WhatsApp URL
                const encodedMessage = encodeURIComponent(message);
                
                // Create WhatsApp URL with the message
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                
                // Open WhatsApp in a new tab
                window.open(whatsappUrl, '_blank');
                
                Swal.fire('Success', `WhatsApp opened with ${messageType} message!`, 'success');
            }
        });
    }



    const handleBillingSubmit = async (customerData) => {
      setSelectedCustomer(customerData);
      setBillingModal(true);
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
        alphabet: '',
        
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

    const handleViewLogs = (customerId, customerName) => {
        console.log(customerId, customerName)
    }

    const column = [
        { 
            field: "customer_id", 
            headerName: "Cust. ID", 
            minWidth: isMobile ? 80 : 100, 
            editable: false,
            flex: isMobile ? 0 : undefined,
            renderCell: (params) => (
                <span style={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {params.row.customer_id || `ID-${params.row.id}`}
                </span>
            )
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
            field: "amount", 
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
            field: "last_payment", 
            headerName: "Last Payment", 
            minWidth: isMobile ? 100 : 120, 
            editable: false,
            hide: isSmallMobile,
            renderCell: (params) => (
                <span style={{ fontSize: '11px' }}>
                    {params.row.bill_date ? moment(params.row.bill_date).format("DD-MM-YYYY") : ''}
                </span>
            )
        },
        { 
            field: "edit", 
            headerName: "Edit", 
            minWidth: isMobile ? 100 : 120, 
            editable: false,
            hide: isSmallMobile,
            renderCell: (params) => (
                <span style={{ fontSize: '11px' }}>
                    <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#2196f3', 
                                    color: 'white',
                                    width: '40px',
                                    height: '40px',
                                    minWidth: '40px'
                                }}
                                onClick={() => GetUpdateCustomer(params.row)}
                            >
                                <BorderColorIcon style={{ fontSize: '14px' }} />
                            </IconButton>
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
                                onClick={() => GetDeleteByID(params.row.id)}
                            >
                                <DeleteForeverIcon style={{ fontSize: '14px' }} />
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
                                onClick={() => handleAddRemainder(params.row.id, params.row)}
                            >
                                <NotificationsIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Recharge/Payment" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#607d8b', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handlePaymentEntry(params.row.id, params.row)}
                            >
                                <PaymentIcon style={{ fontSize: '14px' }} />
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
                       

                        <Tooltip title="Billing Details" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#ff5722', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handleBillingSubmit(params.row)}
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
                                onClick={() => handleComplain(params.row)}
                            >
                                <ReportProblemIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Send WhatsApp Message (Payment Reminder/Confirmation)" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#25d366', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handleWhatsAppMessage(params.row.id, params.row)}
                            >
                                <WhatsAppIcon style={{ fontSize: '14px' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Logs" arrow>
                            <IconButton 
                                size="small" 
                                style={{ 
                                    backgroundColor: '#37474f', 
                                    color: 'white',
                                    width: '24px',
                                    height: '24px',
                                    minWidth: '24px'
                                }}
                                onClick={() => handleViewLogs(params.row.id, params.row.name)}
                            >
                                <HistoryIcon style={{ fontSize: '14px' }} />
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
    const [reminderModal, setReminderModal] = useState(false)
    const [paymentModal, setPaymentModal] = useState(false)
    const [complaintModal, setComplaintModal] = useState(false)

    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [formLoading, setFormLoading] = useState(false)
    const [importLoading, setImportLoading] = useState(false)
    
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
                overflow: 'hidden',
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
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
            transition: 'width 0.3s ease, margin-left 0.3s ease'
        }
    }


    // In your filter change handler
const handleFilterChange = (field, value) => {
    const actualValue = value.value !== undefined ? value.value : value;
    
    // Update local state
    setFilters(prev => ({
        ...prev,
        [field]: actualValue
    }));

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


// Global search handler - only updates input value
const handleGlobalSearchChange = (value) => {
  setGlobalSearch(value);
};

// Handle search button click
const handleSearchButtonClick = () => {
  if (globalSearch === '') {
      // If search is empty, get all customers
      dispatch(GetAllCustomers());
      setIsFiltered(false);
  } else {
      const filterData = {
          globalSearch: globalSearch
      };
      dispatch(DynamicFilterCustomers(filterData));
      setIsFiltered(true);
  }
};


// Handle alphabet filter
const handleAlphabetFilter = (letter) => {
    // Update local state
    setFilters(prev => ({
        ...prev,
        alphabet: letter
    }));

    if (letter === 'ALL') {
        // Fetch all customers
        dispatch(GetAllCustomers());
        setIsFiltered(false);
    } else {
        // Apply alphabet filter
        const filterData = {
            alphabet: letter
        };
        dispatch(FilterCustomers(filterData));
        setIsFiltered(true);
    }
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
      alphabet: '',
  });
  setGlobalSearch('');
  // Fetch all customers
  dispatch(GetAllCustomers());
  setIsFiltered(false);
};

const handleImport = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Start loading spinner
  setImportLoading(true);

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    console.log(jsonData);
    
    // Validate that we have data
    if (!jsonData || jsonData.length === 0) {
      setImportLoading(false);
      Swal.fire('Error', 'No data found in the Excel file. Please check your file format.', 'error');
      return;
    }
    
    // Validate required fields for at least the first row
    const firstRow = jsonData[0];
    if (!firstRow.name && !firstRow.customer_name) {
      setImportLoading(false);
      Swal.fire('Error', 'Excel file must contain a "name" or "customer_name" column.', 'error');
      return;
    }
    
    if (!firstRow.mobile && !firstRow.mobile_no) {
      setImportLoading(false);
      Swal.fire('Error', 'Excel file must contain a "mobile" or "mobile_no" column.', 'error');
      return;
    }
    
    // Send to API
    try {
      const response = await fetch(`${API_URL}/customer/import-bulk-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customers: jsonData }),
      });

      const result = await response.json();
      console.log(result);
      
      if (result.status) {
        dispatch(GetAllCustomers());
        Swal.fire('Success', `Successfully imported ${result.inserted} customers!`, 'success');
      } else {
        Swal.fire('Error', result.message || 'Failed to import customers', 'error');
      }
      
    } catch (err) {
      console.error("Error importing customers", err);
      Swal.fire('Error', 'Failed to import customers. Please check your file format.', 'error');
    } finally {
      // Stop loading spinner
      setImportLoading(false);
    }
  };

  reader.onerror = () => {
    setImportLoading(false);
    Swal.fire('Error', 'Failed to read the file. Please try again.', 'error');
  };

  reader.readAsBinaryString(file);
};

const ImportBulkCustomer = () => {
  // Trigger file input click
  document.getElementById('upload-file').click();
}



    return (
    <>
        <Fragment>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          style={{ display: 'none' }}
          id="upload-file"
          onChange={handleImport} // ✅ This is now defined correctly
        />
        
        {/* Import Loading Overlay */}
        {importLoading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                minWidth: 300,
              }}
            >
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #1976d2',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Importing Customers
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Please wait while we process your file...
              </Typography>
            </Paper>
          </Box>
        )}
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

            {/* New Modal Components */}
            <SetReminderForm 
                open={reminderModal}
                onClose={() => setReminderModal(false)}
                onSubmit={handleReminderSubmit}
                loading={formLoading}
                customerData={selectedCustomer}
            />

            <PaymentForm 
                open={paymentModal}
                onClose={() => setPaymentModal(false)}
                onSubmit={handlePaymentSubmit}
                loading={formLoading}
                customerData={selectedCustomer}
            />

            <ComplaintForm 
                open={complaintModal}
                onClose={() => setComplaintModal(false)}
                onSubmit={handleComplaintSubmit}
                loading={formLoading}
                customerData={selectedCustomer}
            />


            <BillingDetails 
                open={billingModal}
                onClose={() => setBillingModal(false)}
                onSubmit={handleBillingSubmit}
                loading={formLoading}
                customerData={selectedCustomer}
            />
           
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
                        handleGlobalSearchChange(value)
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchButtonClick()
                        }
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
                        onClick={handleSearchButtonClick}
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
                <div className="col-md-6 col-12 d-flex justify-content-end">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: isMobile ? 'center' : 'flex-end', marginRight: '10px' }}>
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

                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: isMobile ? 'center' : 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={ImportBulkCustomer}
                      disabled={importLoading}
                      size="small"
                      sx={{
                        backgroundColor: importLoading ? '#ccc' : 'red',
                        color: 'white',
                        '&:hover': { 
                          backgroundColor: importLoading ? '#ccc' : '#b71c1c', 
                          color: 'white' 
                        },
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: '500',
                        fontSize: '0.8rem',
                        height: '32px',
                        padding: '4px 12px',
                        minWidth: '80px'
                      }}
                    >
                      {importLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box
                            sx={{
                              width: '12px',
                              height: '12px',
                              border: '2px solid #ffffff',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                              }
                            }}
                          />
                          Importing...
                        </Box>
                      ) : (
                        'Import'
                      )}
                    </Button>
                    
                  </Box>
                </div>
              </div>
            </Box>
          </Paper>

          {/* Main Content */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: 0, 
            overflowY: 'auto',
            paddingRight: '5px' 
          }}>
            {/* Search and Filter Section */}
            <Paper 
              elevation={1} 
              style={{
                margin: isMobile ? '0 10px 5px 10px' : '0 10px 5px 10px',
                borderRadius: '6px',
                flexShrink: 0
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
                            backgroundColor: filters.alphabet === letter ? '#1976d2' : '#f0f0f0',
                            color: filters.alphabet === letter ? 'white' : '#333',
                            '&:hover': {
                              backgroundColor: filters.alphabet === letter ? '#1565c0' : '#e0e0e0'
                            }
                          }}
                          onClick={() => handleAlphabetFilter(letter)}
                        />
                      ))}
                    </Box>
                  </div>
                </div>
              </Box>
            </Paper>
                  
            {/* Data Table */}
            <Paper style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Box sx={{ p: 1, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <AdminDataTable
                    rows={DataWithID(isFiltered ? filteredData.data : data.data)} 
                    columns={column} 
                    CustomToolbar={CustomToolbar} 
                    width="100%"
                  />
                </div>
              </Box>
            </Paper>
          </div>
          </div>
        </div>
        </Fragment>
        </>
    )
}

export default ManageCustomer