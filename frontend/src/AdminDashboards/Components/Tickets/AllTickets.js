import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment/moment';
import ModalComponent from '../../Elements/ModalComponent';
import CreateTickets from './form/CreateTickets';

const AllTickets = () => {
    const { data } = useSelector(pre => pre.GetAllPlanReducer)
    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined) {
            for (let item of data) {
                NewData.push({ ...item, _id: data.indexOf(item), date: moment(item.createdAt).format("D / M / Y") })
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
    }

    const column = [
        { field: "_id", headerName: "Sr No", minWidth: 50 },
        { field: "ticket_code", headerName: "Ticket Code/Id", flex: 1 },
        {
            field: "details", headerName: "Details", flex: 1 },
        {
            field: "c_date", headerName: "Created Date & Time", flex: 1
        },
        {
            field: "v_date", headerName: 'Visit Date & Time', flex: 1
        },
        {
            field: "View",
            flex: 1,
            headerName: "View",
        },
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

    const [createTicket, setCreateTicket] = useState(false)
    // const ToggleMasterAddService = () => setMasterAddServices(!masterAddService)

    const ToggleAddTickets = () => {
        setCreateTicket(!createTicket)
    };

    return (
        <Fragment>
              <ModalComponent modal={createTicket} toggle={ToggleAddTickets} data={<CreateTickets ToggleMasterAddService={ToggleAddTickets} />} modalTitle={'Add Tickets'} size={'lg'} />

            <div className='flex'>
            <h4 className='p-3 px-4 mt-3 bg-transparent text-white headingBelowBorder' style={{ maxWidth: "18rem", minWidth: "18rem" }}> All Ticket</h4>

            <div className='AttendenceNavBtn w-100 py-2 px-4 gap-3 justify-content-end'>
                <div className={`py-2 px-4 border shadow rounded-2 cursor-p hoverThis text-white Fw_500 d-flex align-items-center justify-content-center `} style={{ minWidth: "18rem", maxWidth: "18rem" }}  onClick={ToggleAddTickets}>
                Create Ticket
                </div>
            </div>
            </div>

            <div className='p-4'>
                <AdminDataTable rows={DataWithID(data.data)} columns={column} CustomToolbar={CustomToolbar} />
            </div>
        </Fragment>
    )
}

export default AllTickets