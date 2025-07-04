import { Button } from '@mui/material';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../config';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import AdminNavItems from '../../Elements/AdminNavItems';
import { useMediaQuery } from '@mui/material';

const ManageFlow = () => {
    // Mobile responsiveness hooks
    const isMobile = useMediaQuery('(max-width:768px)');
    const isSmallMobile = useMediaQuery('(max-width:480px)');

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        olt_name: '',
        port: '',
        status: true
    });

    const navigate = useNavigate();

    const fetchFlowData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/flow/getall`);
            if (response.data.status) {
                setData(response.data.data);
            } else {
                console.error("Failed to fetch flow data");
            }
        } catch (error) {
            console.error("Error fetching flow data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Search flows by MAC or userId
    const searchFlows = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/flow/search?query=${encodeURIComponent(query)}`);
            if (response.data.status) {
                setSearchResults(response.data.data);
                setIsSearching(true);
            } else {
                console.error("Failed to search flows");
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Error searching flows:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        // Auto-search as user types (with debounce)
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        const newTimeout = setTimeout(() => {
            searchFlows(query);
        }, 500); // 500ms debounce
        
        setSearchTimeout(newTimeout);
    };

    // Handle search button click
    const handleSearchClick = () => {
        searchFlows(searchQuery);
    };

    // Clear search results
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setIsSearching(false);
    };

    // Handle Enter key press in search input
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchFlows(searchQuery);
        }
    };

    useEffect(() => {
        fetchFlowData();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Create data object to match the FlowModel schema
            const flowData = {
                name: formData.name,
                olt_name: formData.olt_name,
                port: parseInt(formData.port),
                status: formData.status
            };

            const response = await axios.post(`${API_URL}/api/flow/add`, flowData);
            if (response.data.status) {
                setSuccessMessage(response.data.message || 'Flow added successfully!');
                // Reset form after successful submission
                setFormData({
                    name: '',
                    olt_name: '',
                    port: '',
                    status: true
                });
                // Refresh the flow data
                fetchFlowData();
                // Close modal after a brief delay
                setTimeout(() => {
                    setModalOpen(false);
                    setSuccessMessage('');
                }, 2000);
            } else {
                setErrorMessage(response.data.message || 'Failed to add flow');
            }
        } catch (error) {
            console.error('Error adding flow:', error);
            setErrorMessage(error.response?.data?.message || 'An error occurred while adding the flow');
        } finally {
            setLoading(false);
        }
    };

    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined && data.length > 0) {
            for (let item of data) {
                // Parse the JSON data to calculate totals
                let totalONU = 0;
                let totalRouter = 0;
                let totalONT = 0;
                let matchingNodes = []; // Track nodes that match the search query
                
                try {
                    if (item.data) {
                        const parsedData = item.data;

                        if (parsedData.nodes && Array.isArray(parsedData.nodes)) {
                            parsedData.nodes.forEach(node => {
                                // Count OLT devices (nodes with oltName or deviceType OLT)
                               
                                
                                // Count device nodes only (nodeType: "device")
                                if (node.data?.nodeType === "device") {
                                    switch (node.data?.deviceType) {
                                        case "ONU":
                                            totalONU++;
                                            break;
                                        case "Router":
                                            totalRouter++;
                                            break;
                                        case "ONT":
                                            totalONT++;
                                            break;
                                    }
                                }
                                
                                // Also check deviceModel for backup counting
                                if (node.data?.deviceModel) {
                                    switch (node.data?.deviceModel) {
                                        case "ONU":
                                            if (node.data?.deviceType !== "ONU") totalONU++;
                                            break;
                                        case "Router":
                                            if (node.data?.deviceType !== "Router") totalRouter++;
                                            break;
                                        case "ONT":
                                            if (node.data?.deviceType !== "ONT") totalONT++;
                                            break;
                                    }
                                }

                                // Check if this node matches the current search query
                                if (isSearching && searchQuery.trim()) {
                                    const query = searchQuery.toLowerCase().trim();
                                    const nodeData = node.data || {};
                                    
                                    // Check various fields that might match the search
                                    const searchableFields = [
                                        nodeData.macAddress,
                                        nodeData.userId,
                                        nodeData.deviceId,
                                        nodeData.label,
                                        nodeData.name
                                    ];
                                    
                                    if (searchableFields.some(field => 
                                        field && field.toString().toLowerCase().includes(query)
                                    )) {
                                        matchingNodes.push({
                                            nodeId: node.id,
                                            nodeData: nodeData,
                                            matchedField: searchableFields.find(field => 
                                                field && field.toString().toLowerCase().includes(query)
                                            )
                                        });
                                    }
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error parsing flow data:", error);
                }
                
                // Calculate total users (ONU + Router)
                const totalUsers = totalONU + totalRouter;
                
                NewData.push({ 
                    ...item, 
                    _id: data.indexOf(item) + 1,
                    date: item.createdAt ? moment(item.createdAt).format(isMobile ? "DD/MM/YY" : "DD/MM/YYYY") : "-",
                    statusText: item.status ? "Active" : "Inactive",
                    totalONU,
                    totalRouter,
                    totalONT,
                    totalUsers,
                    matchingNodes: isSearching ? matchingNodes : [] // Include matching nodes info
                })
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
    }
   
    // Handle view flow details
    const handleViewFlow = (flowData) => {
        // Pass search context if we're currently searching
        const navigationState = {
            flowData,
            searchContext: isSearching ? {
                searchQuery,
                isFromSearch: true,
                matchingNodes: flowData.matchingNodes || []
            } : null
        };
        navigate('/admin/flow', { state: navigationState });
    };

    const column = [
        { 
            field: "_id", 
            headerName: "Sr No", 
            minWidth: isSmallMobile ? 40 : 50, 
            flex: isMobile ? 0 : 1,
            hide: isSmallMobile
        },       
        { 
            field: "name", 
            headerName: isMobile ? "Type" : "Connection Type", 
            minWidth: isMobile ? 100 : 120, 
            flex: isMobile ? 1 : 1,
            renderCell: (params) => (
                <div className="d-flex align-items-center">
                    <span style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                        {params.row.name}
                    </span>
                    {params.row.matchingNodes && params.row.matchingNodes.length > 0 && (
                        <span 
                            className="badge bg-warning text-dark ms-2" 
                            style={{ fontSize: isMobile ? '8px' : '10px' }}
                            title={`${params.row.matchingNodes.length} matching node(s) found`}
                        >
                            {params.row.matchingNodes.length}
                        </span>
                    )}
                </div>
            )
        },
        { 
            field: "olt_name", 
            headerName: isMobile ? "OLT" : "OLT Name", 
            minWidth: isMobile ? 80 : 120, 
            flex: isMobile ? 0 : 1,
            hide: isSmallMobile
        },
        { 
            field: "port", 
            headerName: "Port", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 60 : 120,
            hide: isMobile
        }, 
        { 
            field: "totalONU", 
            headerName: "ONU", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 60 : 100,
            renderCell: (params) => (
                <span style={{ 
                    color: '#28a745', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}>
                    {params.value}
                </span>
            )
        },
        { 
            field: "totalRouter", 
            headerName: isMobile ? "Router" : "Total Router", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 70 : 120,
            hide: isSmallMobile,
            renderCell: (params) => (
                <span style={{ 
                    color: '#007bff', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}>
                    {params.value}
                </span>
            )
        },
        { 
            field: "totalONT", 
            headerName: "ONT", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 60 : 100,
            hide: isMobile,
            renderCell: (params) => (
                <span style={{ 
                    color: '#ffc107', 
                    fontWeight: '500',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}>
                    {params.value}
                </span>
            )
        },
        { 
            field: "totalUsers", 
            headerName: isMobile ? "Users" : "Total Users", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 70 : 120,
            renderCell: (params) => (
                <div className="badge bg-info text-dark" style={{
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                    padding: isMobile ? '2px 6px' : '4px 8px'
                }}>
                    {params.row.totalUsers}
                </div>
            )
        },
        { 
            field: "date", 
            headerName: isMobile ? "Date" : "Created Date", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 80 : 120,
            hide: isSmallMobile
        },
        { 
            field: "status", 
            headerName: "Status", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 80 : 120,
            hide: isMobile,
            renderCell: (params) => (
                <div className={`badge ${params.row.status ? 'bg-success' : 'bg-danger'}`} style={{
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                    padding: isMobile ? '2px 6px' : '4px 8px'
                }}>
                    {params.row.status ? "Active" : "Inactive"}
                </div>
            )
        },
        { 
            field: "actions", 
            headerName: "Actions", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 80 : 120,
            sortable: false,
            renderCell: (params) => (
                <div className="d-flex">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size={isMobile ? "small" : "small"}
                        startIcon={!isSmallMobile ? <VisibilityIcon /> : null}
                        onClick={() => handleViewFlow(params.row)}
                        style={{ 
                            margin: "0 5px",
                            minWidth: isMobile ? "60px" : "80px",
                            fontSize: isMobile ? '0.7rem' : '0.8rem',
                            padding: isMobile ? '4px 8px' : '6px 16px'
                        }}
                    >
                        {isSmallMobile ? <VisibilityIcon fontSize="small" /> : 'View'}
                    </Button>
                </div>
            )
        }
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

    const handleAddFlow = () => {
        // Reset form and messages
        setFormData({
            name: '',
            olt_name: '',
            port: '',
            status: true
        });
        setErrorMessage('');
        setSuccessMessage('');
        setModalOpen(true);
    }

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        setErrorMessage('');
        setSuccessMessage('');
    }

    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed)
    }

    return (
        <Fragment>
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
                                    📊 Network Flow
                                </h4>
                                <p className='text-white-50 mb-0' style={{ 
                                    fontSize: isMobile ? '0.8rem' : '0.9rem' 
                                }}>
                                    Manage and track all network flows
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
                                    onClick={handleAddFlow}
                                >
                                    <span>📈</span>
                                    {isMobile ? 'Add Flow' : 'Add New Flow'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className='AttendenceNavBtn w-100 py-1 gap-3 justify-content-end' style={{ 
                        padding: isMobile ? '8px 15px' : '8px 16px'
                    }}>
                        <div className='d-flex align-items-center gap-2' style={{ 
                            minWidth: isMobile ? "100%" : "25rem",
                            flexDirection: isMobile ? 'column' : 'row'
                        }}>
                            <div className='d-flex align-items-center border rounded-2 bg-white' style={{ 
                                flex: 1,
                                width: isMobile ? '100%' : 'auto'
                            }}>
                                <input
                                    type="text"
                                    placeholder={isMobile ? "Search by MAC or User ID..." : "Search by MAC address or User ID..."}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyPress={handleSearchKeyPress}
                                    className="form-control border-0"
                                    style={{ 
                                        boxShadow: 'none',
                                        fontSize: isMobile ? '13px' : '14px'
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={handleSearchClick}
                                    disabled={loading}
                                    style={{ 
                                        minWidth: isMobile ? '35px' : '40px',
                                        margin: '2px',
                                        borderRadius: '4px',
                                        height: isMobile ? '32px' : '36px'
                                    }}
                                >
                                    <SearchIcon fontSize="small" />
                                </Button>
                            </div>
                            
                            {isSearching && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={clearSearch}
                                    startIcon={<ClearIcon />}
                                    style={{ 
                                        minWidth: isMobile ? '80px' : '100px',
                                        color: '#6c757d',
                                        borderColor: '#6c757d',
                                        fontSize: isMobile ? '0.7rem' : '0.8rem',
                                        marginTop: isMobile ? '8px' : '0'
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
          
                    {/* Data Table Section */}
                    <div className="flex-grow-1" style={{ 
                        padding: isMobile ? '0 5px 10px 5px' : '0 16px 16px 16px',
                        overflow: 'hidden' 
                    }}>
                        <AdminDataTable
                            rows={DataWithID(isSearching ? searchResults : data)} 
                            columns={column} 
                            CustomToolbar={CustomToolbar} 
                            loading={loading}
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

            {/* Add Flow Modal */}
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal}>Add New Flow</ModalHeader>
                <ModalBody>
                    {errorMessage && (
                        <Alert color="danger">{errorMessage}</Alert>
                    )}
                    {successMessage && (
                        <Alert color="success">{successMessage}</Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="name">Connection Type</Label>
                            <Input
                                type="select"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Connection Type</option>
                                <option value="EPON">EPON</option>
                                <option value="GPON">GPON</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="olt_name">OLT Name</Label>
                            <Input
                                type="text"
                                name="olt_name"
                                id="olt_name"
                                placeholder="Enter OLT Name"
                                value={formData.olt_name}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="port">Port</Label>
                            <Input
                                type="number"
                                name="port"
                                id="port"
                                placeholder="Enter Port Number"
                                value={formData.port}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup check className="mb-3">
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                />{' '}
                                Active
                            </Label>
                        </FormGroup>
                        <div className="d-flex justify-content-end">
                            <Button 
                                type="button" 
                                color="secondary" 
                                className="me-2" 
                                onClick={toggleModal}
                                disabled={loading}
                                style={{ marginRight: "10px" }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained"
                                color="primary" 
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Flow'}
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default ManageFlow