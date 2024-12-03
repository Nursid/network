import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment/moment';
import ModalComponent from '../../Elements/ModalComponent';
import CreateTickets from './form/CreateTickets';
import { GetAllTicket } from '../../../Store/Actions/Dashboard/TicketAction';
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Button } from '@mui/material';
import AssignTechnician from './form/AssignTechnician';
import TicketView from './view/TicketVIew';

const AllTickets = () => {
    const { data } = useSelector(pre => pre.GetAllTicketReducers)
    const dispatch = useDispatch()
    const DataWithID = (data) => {
        const NewData = [];
        if (Array.isArray(data) && data.length > 0) {
            for (let item of data) {
                const mergedCustomer = {
                    ...item.customer, 
                    ...item.customer?.NewCustomer // Merge customer and NewCustomer
                };
    
                delete mergedCustomer.NewCustomer; // Remove nested NewCustomer if needed
    
                NewData.push({
                    ...item,
                    _id: item.id, // Use item's ID for _id
                    formattedDate: moment(item.date).format("DD MMM YYYY, hh:mm a"), // Format the `date` field
                    createdAt: moment(item.createdAt).format("DD MMM YYYY, hh:mm a"), // Format the `date` field
                    customer: mergedCustomer // Replace customer with the merged object
                });
            }
        } else {
            NewData.push({ id: 0 });
        }
        return NewData;
    };
    const [serviceProviderModalOpen, setServiceProviderModalOpen] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const [viewData, setViewData] = useState('');
    const [createTicket, setCreateTicket] = useState(false)
    const [viewTicket, setViewTicket] = useState(false)
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
        { field: "technician", headerName: "Assign Technician",
            renderCell: (params) => ( 
                <>
                {
                !params.row.technician   ? (
                  <Button variant='contained' color='primary' onClick={() => AssignServiceProvider(params.row.id)} >
                    Technician
                  </Button>
        
                ) : (
                  params.row.service_provider?.name
                )
            }
            </> ),

            minWidth: 200,  editable: false },
        {
            field: "action",
            headerName: "Action",
            minWidth: 150,
            renderCell: (params) => (

                <div className="d-flex gap-2">
                

                <Button variant="contained" color="success" 
                onClick={(e)=>{toggleView(params.row)}}
                style={{minWidth: "40px", maxWidth: "40px"}}
                >
                    <VisibilityIcon />
                </Button>
            </div>
            ),
        },
    ];

    const toggleView = (data) =>{
        setViewData(data)
        ToggleVIewTickets();
    }

    const AssignServiceProvider = (id) => { 
        setTicketId(id)
        setServiceProviderModalOpen(!serviceProviderModalOpen)
      }

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

    const ToggleAddTickets = () => {
        setCreateTicket(!createTicket)
    };

    const ToggleVIewTickets = () => {
        setViewTicket(!viewTicket)
    };

    const ToggleAssingTickets = () => {
        setServiceProviderModalOpen(!serviceProviderModalOpen)
    };

    useEffect(() => {
        dispatch(GetAllTicket())
    }, [])

    return (
        <Fragment>
              <ModalComponent modal={createTicket} toggle={ToggleAddTickets} data={<CreateTickets ToggleMasterAddService={ToggleAddTickets} GetAllTicket={GetAllTicket}  />} modalTitle={'Add Tickets'} size={'lg'} />

              <ModalComponent modal={viewTicket} toggle={ToggleVIewTickets} data={<TicketView  data={viewData}  />} modalTitle={'VIew Tickets'} size={'xl'} />

              <ModalComponent modal={serviceProviderModalOpen} toggle={ToggleAssingTickets} data={<AssignTechnician ToggleAssingTickets={ToggleAssingTickets}  ticketId={ticketId} GetAllTicket={GetAllTicket}/>} modalTitle={'Assign Technician'} size={'md'} />

            <div className='flex'>
            <h4 className='p-3 px-4 mt-3 bg-transparent text-white headingBelowBorder' style={{ maxWidth: "18rem", minWidth: "18rem" }}> All Ticket</h4>

            <div className='AttendenceNavBtn w-100 py-2 px-4 gap-3 justify-content-end'>
                <div className={`py-2 px-4 border shadow rounded-2 cursor-p hoverThis text-white Fw_500 d-flex align-items-center justify-content-center `} style={{ minWidth: "18rem", maxWidth: "18rem" }}  onClick={ToggleAddTickets}>
                Create Ticket
                </div>
            </div>
            </div>

            <div className='p-4'>
                <AdminDataTable rows={DataWithID(data.data)} columns={column} CustomToolbar={CustomToolbar}
                
                />
            </div>
        </Fragment>
    )
}

export default AllTickets