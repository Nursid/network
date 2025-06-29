import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../config';

const CollectionTally = () => { 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch account data from API - filtered for collections
    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/account-listing`);
                if (response.data.status) {
                    // Filter for collection records (you can adjust this filter based on your business logic)
                    const collectionData = response.data.data.filter(item => 
                        item.payment_mode && item.amount > 0
                    );
                    setData(collectionData);
                } else {
                    setError('Failed to fetch collection data');
                }
            } catch (error) {
                console.error('Error fetching collection data:', error);
                setError('Error fetching collection data');
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
    }, []);

    const all_columns = [
        { field: "id", headerName: "ID", flex: 1, minWidth: 80 },
        { field: "date", headerName: "Date", flex: 1, minWidth: 120 },
        { field: "cust_id", headerName: "Customer ID", flex: 1, minWidth: 120 },
        { field: "cust_name", headerName: "Customer Name", flex: 1, minWidth: 150 },
        { field: "vc_no", headerName: "Voucher No.", flex: 1, minWidth: 120 },
        { field: "address", headerName: "Address", flex: 1, minWidth: 200 },
        { 
            field: "amount", 
            headerName: "Amount", 
            flex: 1, 
            minWidth: 120,
            renderCell: (params) => `₹${params.value || 0}`
        },
        { field: "payment_mode", headerName: "Payment Mode", flex: 1, minWidth: 120 },
        { 
            field: "balance", 
            headerName: "Balance", 
            flex: 1, 
            minWidth: 120,
            renderCell: (params) => `₹${params.value || 0}`
        },
        { field: "trans_id", headerName: "Transaction ID", flex: 1, minWidth: 150 },
        { field: "partner_emp_id", headerName: "Partner/Emp. ID", flex: 1, minWidth: 140 },
        { 
            field: "auto_renew", 
            headerName: "Auto Renew", 
            flex: 1, 
            minWidth: 100,
            renderCell: (params) => params.value ? 'Yes' : 'No'
        },
        { 
            field: "recharge_status", 
            headerName: "Recharge Status", 
            flex: 1, 
            minWidth: 130,
            renderCell: (params) => (
                <span 
                    className={`badge ${
                        params.value === 'Due' ? 'bg-danger' : 
                        params.value === 'Paid' ? 'bg-success' : 
                        'bg-warning'
                    }`}
                >
                    {params.value || 'Pending'}
                </span>
            )
        }
    ];

    const DataWithID = (data) => {
        const newData = [];
        if (data && Array.isArray(data)) {
            for (let item of data) {
                newData.push({
                    ...item,
                    _id: item.id || data.indexOf(item),
                    date: item.date ? moment(item.date).format("DD-MM-YYYY") : 'N/A',
                });
            }
        }
        return newData.reverse();
    }

    const CustomToolbar = () => (
        <GridToolbarContainer>
            <GridToolbarQuickFilter />
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarExport />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );

    return (
        <Fragment>
            <h5 className='pt-4 pb-3 px-4 text-white headingBelowBorder d-flex flex-nowrap' style={{ width: "fit-content" }}>
                Collection Tally
            </h5>
            <div className='p-4'>
                <AdminDataTable 
                    rows={DataWithID(data)} 
                    columns={all_columns} 
                    CustomToolbar={CustomToolbar}
                    loading={loading}
                />
            </div>
        </Fragment>
    );
};

export default CollectionTally;
