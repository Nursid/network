import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../config';

const PaymentPending = () => { 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch account data from API - filtered for pending payments
    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/account-listing`);
                if (response.data.status) {
                    // Filter for pending payment records
                    const pendingData = response.data.data.filter(item => 
                        item.recharge_status === 'Due' || 
                        item.recharge_status === 'Pending' || 
                        (item.balance && item.balance > 0)
                    );
                    setData(pendingData);
                } else {
                    setError('Failed to fetch pending payment data');
                }
            } catch (error) {
                console.error('Error fetching pending payment data:', error);
                setError('Error fetching pending payment data');
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
            renderCell: (params) => (
                <span className={`fw-bold ${params.value > 0 ? 'text-danger' : 'text-success'}`}>
                    ₹{params.value || 0}
                </span>
            )
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
                        params.value === 'Pending' ? 'bg-warning' : 
                        'bg-secondary'
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
                Payment Pending
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

export default PaymentPending;
