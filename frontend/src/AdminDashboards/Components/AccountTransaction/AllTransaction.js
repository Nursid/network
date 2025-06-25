import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment';
const AllTransaction = () => { 
    
    const data = [
        { id: 1, person_name: "John Doe", amount: 100, date: "2021-01-01", remark: "Payment for services", payment_mode: "Cash", type_payment: "Debit" },
        { id: 2, person_name: "Jane Smith", amount: 200, date: "2021-01-02", remark: "Payment for services", payment_mode: "Online", type_payment: "Credit" },
    ]

    const all_columns = [
        { field: "id", headerName: "Id", flex: 1, minWidth: 200 },
        { field: "person_name", headerName: "Party Name", flex: 1, minWidth: 120 },
        { field: "amount", headerName: "Amount", flex: 1, minWidth: 120 },
        { field: "date", headerName: "Date", flex: 1, minWidth: 120 },
        { field: "remark", headerName: "Remark", flex: 1, minWidth: 120 },
        { field: "payment_mode", headerName: "Payment Mode", flex: 1, minWidth: 120 },
        { field: "type_payment", headerName: "Type Payment", flex: 1, minWidth: 120 },
    ];

    const DataWithID = (data) => {
            const newData = [];
            if (data) {
                for (let item of data) {
                    newData.push({
                        ...item,
                        _id: data.indexOf(item),
                        date: moment(item.date).format("DD-MM-YYYY"),
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
                All Transaction
            </h5>
        
                <div className='p-4'>
                    <AdminDataTable rows={DataWithID(data)} columns={all_columns} CustomToolbar={CustomToolbar} />
                </div>
            
        </Fragment>
    );
};

export default AllTransaction;
