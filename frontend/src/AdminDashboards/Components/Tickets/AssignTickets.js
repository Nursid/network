
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment/moment';
import { GetAllTicket } from '../../../Store/Actions/Dashboard/TicketAction';

const AssignTickets = () => {
    const { data } = useSelector(pre => pre.GetAllTicketReducers)
    const dispatch = useDispatch()
    const DataWithID = (data) => {
        const NewData = [];
        if (Array.isArray(data) && data.length > 0) {
            for (let item of data) {
                if(item.technician !== null){
                const mergedCustomer = {
                    ...item.customer, 
                    ...item.customer?.NewCustomer // Merge customer and NewCustomer
                };
                delete mergedCustomer.NewCustomer; 
                NewData.push({
                    ...item,
                    _id: item.id, // Use item's ID for _id
                    formattedDate: moment(item.date).format("DD MMM YYYY, hh:mm a"), // Format the `date` field
                    createdAt: moment(item.createdAt).format("DD MMM YYYY, hh:mm a"), // Format the `date` field
                    customer: mergedCustomer // Replace customer with the merged object
                });
            }
            }
        } else {
            NewData.push({ id: 0 });
        }
        return NewData;
    };

    const column = [
        { field: "_id", headerName: "Sr No", minWidth: 50 },
        {
            field: "ticket_code",
            headerName: "Ticket Code/Id",
            flex: 1,
            renderCell: (params) => {
                return (
                    <div
                        className="d-flex flex-column justify-content-center align-items-start p-2"
                        style={{ width: "200px", height: "100px" }} // Inline style for width and height
                    >
                        <div>{params.row.customer?.name}</div>
                        {/* <div>CustomerId: {params.row.customer?.id}</div>
                        <div>Box Unique No: {params.row.customer?.other_id}</div> */}
                    </div>
                );
            }
        },        
        {
            field: "details", headerName: "Details", flex: 1 },
        {
            field: "createdAt", headerName: "Created Date & Time", flex: 1
        },
        {
            field: "formattedDate", headerName: 'Visit Date & Time', flex: 1
        },
        { field: "technician", headerName: "Assign Technician", minWidth: 200},
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
    };
    
    useEffect(() => {
        dispatch(GetAllTicket())
    }, [])

    return (
        <Fragment>
            <div className='flex'>
            <h4 className='p-3 px-4 mt-3 bg-transparent text-white headingBelowBorder' style={{ maxWidth: "18rem", minWidth: "18rem" }}> Assign Tickets</h4>
            </div>

            <div className='p-4'>
                <AdminDataTable rows={DataWithID(data.data)} columns={column} CustomToolbar={CustomToolbar} />
            </div>
        </Fragment>
    )
}

export default AssignTickets