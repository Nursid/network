import { useState, useEffect } from "react"
import AdminDataTable from "../../Elements/AdminDataTable"
import { Button } from "reactstrap"
import { GridToolbarContainer, GridToolbarQuickFilter, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { Fragment } from "react";
import { AddInventryModal } from "../../../Components/Modal";
import { GetAllInventry } from "../../../Store/Actions/Dashboard/InventryAction";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import BorderColorIcon from '@mui/icons-material/BorderColor';
import AdminNavItems from '../../Elements/AdminNavItems';

const StockManagement = () => {
    const dispatch = useDispatch();
    const [inventry, setInventry] = useState(false);
    const [allotedItems, setAllotedItems] = useState(false);
    const { data, isLoading } = useSelector(state => state.GetAllInventryReducers || []);
    const [AddInventryModalOpen, setAddInventryModalOpen] = useState(false);
    const [inventryData, setInventryData] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        dispatch(GetAllInventry());
    }, [dispatch]);

    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed)
    }

  const Inventrycolumns = [
    { field: "_id", headerName: "Sr No.", minWidth: 200,  editable: false},
    { field: "item", headerName: "Name", minWidth: 220,  editable: false },
    { field: "qty", headerName: "Quantity", minWidth: 220,  editable: false },
    { field: "action", headerName: "Action", minWidth: 220,  editable: false,
        renderCell: (params) => (
            <div className="d-flex gap-2">
                <Button variant="contained" color="primary" onClick={() => {
                    setAddInventryModalOpen(!AddInventryModalOpen);
                    setInventryData(params.row);
                }}><BorderColorIcon /></Button>
                {/* <Button variant="contained" color="danger" onClick={() => {
                    setAddInventryModalOpen(!AddInventryModalOpen);
                    setInventryData(params.row);
                }}>   <DeleteForeverIcon /></Button> */}
            </div>  

        )
     }
  ]

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


    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined) {
            for (let item of data) {
                NewData.push({ ...item, _id: data.indexOf(item) + 1, date: moment(item.createdAt).format("DD-MM-YYYY") })
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
    }

    
    return (
        <Fragment>
            <AddInventryModal
                AddInventryModalOpen={AddInventryModalOpen}
                AddInventryModalOpenFunction={() => setAddInventryModalOpen(!AddInventryModalOpen)}
                data={inventryData}
                GetAllInventry={GetAllInventry}
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
                                    📦 Stock Management
                                </h4>
                                <p className='text-white-50 mb-0' style={{ fontSize: '0.9rem' }}>
                                    Manage and track all inventory items
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
                                    onClick={() => setAddInventryModalOpen(!AddInventryModalOpen)}
                                >
                                    <span>➕</span>
                                    Add Inventory
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Data Table Section */}
                    <div className="flex-grow-1 px-4 pb-4" style={{ overflow: 'hidden' }}>
                        <AdminDataTable rows={DataWithID(data)} CustomToolbar={CustomToolbar} columns={Inventrycolumns} loading={isLoading} />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default StockManagement