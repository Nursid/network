import { Button } from '@mui/material';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom/dist';
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../config';

const ManageFlow = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        fetchFlowData();
    }, []);

    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined && data.length > 0) {
            for (let item of data) {
                NewData.push({ 
                    ...item, 
                    _id: data.indexOf(item) + 1,
                    date: item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY") : "-",
                    statusText: item.status ? "Active" : "Inactive"
                })
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
    }
   
    const column = [
        { field: "_id", headerName: "Sr No", minWidth: 50, flex: 1 },       
        { field: "olt_name", headerName: "OLT Name", minWidth: 120, flex: 1 },
        { field: "port", headerName: "Port", flex: 1, minWidth: 120 }, 
        { field: "status", headerName: "Status", flex: 1, minWidth: 120,
          renderCell: (params) => (
            <div className={`badge ${params.row.status ? 'bg-success' : 'bg-danger'}`}>
                {params.row.status ? "Active" : "Inactive"}
            </div>
          )
        },
        { field: "date", headerName: "Created Date", flex: 1, minWidth: 120 }
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

    const handleAddFlow = () => {
        navigate('/admin/flow/add');
    }

    return (
        <Fragment>
            <div style={{ height: "calc(100vh - 20px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div className='flex'>  
                    <h4 className='p-2 px-4 mt-2 bg-transparent text-white headingBelowBorder' style={{ maxWidth: "18rem", minWidth: "18rem" }}>Flow List</h4>

                    <div className='AttendenceNavBtn w-100 py-1 px-4 gap-3 justify-content-end'>
                        <div 
                            className={`py-1 px-4 border shadow rounded-2 cursor-p hoverThis text-white Fw_500 d-flex align-items-center justify-content-center`} 
                            style={{ minWidth: "15rem", maxWidth: "15rem" }} 
                            onClick={handleAddFlow}
                        >
                            Add Flow
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, overflow: "auto", padding: "0 16px 0 16px", marginBottom: 0 }}>
                    <AdminDataTable 
                        rows={DataWithID(data)} 
                        columns={column} 
                        CustomToolbar={CustomToolbar} 
                        loading={loading}
                    />
                </div>
            </div>
        </Fragment>
    )
}

export default ManageFlow