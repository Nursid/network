import { useState, useEffect } from "react"
import AdminDataTable from "../../Elements/AdminDataTable";
import { Button } from "reactstrap"
import { GridToolbarContainer, GridToolbarQuickFilter, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllAllotedItems } from "../../../Store/Actions/Dashboard/InventryAction";
import { AllotItemModal } from "../../../Components/Modal";
import moment from "moment";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AdminNavItems from '../../Elements/AdminNavItems';
import { useMediaQuery, useTheme } from '@mui/material';

const WarehouseManagement = () => {

    const dispatch = useDispatch();
    const { data, isLoading } = useSelector(state => state.GetAllAllotedItemReducers || []);
    const [allotedItemModalOpen, setAllotedItemModalOpen] = useState(false);
    const [allotedItemData, setAllotedItemData] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        dispatch(GetAllAllotedItems());
    }, [dispatch]);

    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed)
    }

    const AllotedItemsCollums = [
        { 
            field: "_id", 
            headerName: "Sr No.", 
            minWidth: isMobile ? 60 : 200,
            flex: isMobile ? 0 : undefined,
            editable: false,
            hide: isSmallMobile
        },
        { 
            field: "allotdate", 
            headerName: "Date", 
            minWidth: isMobile ? 100 : 220,
            flex: isMobile ? 0 : undefined,
            editable: false,
            hide: isSmallMobile
        },
        { 
            field: "spname", 
            headerName: isMobile ? "Alloted To" : "Alloted To", 
            minWidth: isMobile ? 120 : 220,
            flex: isMobile ? 1 : undefined,
            editable: false 
        },
        { 
            field: "item", 
            headerName: "Item", 
            minWidth: isMobile ? 100 : 220,
            flex: isMobile ? 0 : undefined,
            editable: false 
        },
        { 
            field: "aqty", 
            headerName: isMobile ? "Qty" : "Quantity", 
            minWidth: isMobile ? 60 : 220,
            flex: isMobile ? 0 : undefined,
            editable: false 
        },
        { 
            field: "remark", 
            headerName: "Remark", 
            minWidth: isMobile ? 100 : 220,
            flex: isMobile ? 0 : undefined,
            editable: false,
            hide: isSmallMobile
        },
        { 
            field: "action", 
            headerName: "Action", 
            minWidth: isMobile ? 80 : 220,
            flex: isMobile ? 0 : undefined,
            editable: false,
            sortable: false,
            renderCell: (params) => (
                <div className={`d-flex ${isMobile ? 'justify-content-center' : 'gap-2'}`}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => {
                            setAllotedItemModalOpen(!allotedItemModalOpen);
                            setAllotedItemData(params.row);
                        }}
                        style={{
                            minWidth: isMobile ? "32px" : "auto",
                            maxWidth: isMobile ? "32px" : "auto",
                            minHeight: isMobile ? "32px" : "auto",
                            maxHeight: isMobile ? "32px" : "auto",
                            padding: isMobile ? "4px" : "6px 12px"
                        }}
                    >
                        <BorderColorIcon fontSize={isMobile ? "small" : "medium"} />
                    </Button>
                </div>  
            )
        }
    ]

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

    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined) {
            for (let item of data) {
                NewData.push({ 
                    ...item, 
                    _id: data.indexOf(item) + 1,  
                })
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
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
            <AllotItemModal
                allotItemModalOpen={allotedItemModalOpen}
                allotItemModalfunction={() => setAllotedItemModalOpen(!allotedItemModalOpen)}
                inventryData={allotedItemData}
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
                                    🏭 Warehouse Management
                                </h4>
                                <p className='text-white-50 mb-0' style={{ 
                                    fontSize: isMobile ? '0.8rem' : '0.9rem' 
                                }}>
                                    Manage and track all allotted items
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
                                    onClick={() => {
                                        setAllotedItemData(null); 
                                        setAllotedItemModalOpen(!allotedItemModalOpen);
                                    }}
                                >
                                    <span>📋</span>
                                    {isMobile ? 'Allot' : 'Allot Item'}
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
                                CustomToolbar={CustomToolbar} 
                                columns={AllotedItemsCollums}
                                loading={isLoading}
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

export default WarehouseManagement