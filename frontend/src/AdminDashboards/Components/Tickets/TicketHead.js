import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment/moment';
import { GetAllTicketHead } from '../../../Store/Actions/Dashboard/TicketHeadAction';
import ModalComponent from '../../Elements/ModalComponent';
import AddTicketHead from './form/AddTicketHead';
import { Button } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Swal from 'sweetalert2';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { API_URL } from '../../../config';

const TicketsHead = () => {
    const { data } = useSelector(pre => pre.GetAllTicketHeadReducers)
    const [createTicket, setCreateTicket] = useState(false)

    const [editData, setEditData] = useState([])
    const dispatch = useDispatch()
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
        { field: "shortCode", headerName: "Short Code", flex: 1 },
        {
            field: "name", headerName: "Name", flex: 1 },
        {
            field: "Type", headerName: "Type", flex: 1
        },
        {
            field: "TAT", headerName: 'TAT', flex: 1
        },
        {
            field: "action",
            headerName: "Action",
            minWidth: 160,
            renderCell: (params) => (
                <div className="d-flex gap-2">
                    <Button variant='contained' color='primary'
                    style={{minWidth: "40px", maxWidth: "40px"}}
                    onClick={() => handleEdit(params.row)}
                    ><BorderColorIcon /></Button>
                    <Button onClick={() => handleDeleteServices(params.row.id)} variant="contained" color="error"
                        style={{minWidth: "40px", maxWidth: "40px"}}
                        >
                        <DeleteForeverIcon />
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(()=>{
        dispatch((GetAllTicketHead()))
    }, [])

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
        if (createTicket) {
            setEditData(null); // Reset editData when closing masterAddService
        }
    };
    const handleEdit = (data) =>{
        setEditData(data)
        ToggleAddTickets()
    }


    const handleDeleteServices = (itemID)=>{
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
          if (result.isConfirmed) {
              const response = await axios.delete(API_URL + '/api/ticket-head/delete/' + itemID)
              if (response.status === 200) {
                  Swal.fire(
                      'Deleted!',
                      response.data.message,
                      'success'
                  )
                  dispatch(GetAllTicketHead())
              } else {
                  Swal.fire({
                      title: 'failed to delete try again',
                      icon: "error",
                  })
              }
          }
      })
    
    
      }

    return (
        <Fragment>
            <ModalComponent modal={createTicket} toggle={ToggleAddTickets} data={<AddTicketHead ToggleMasterAddService={ToggleAddTickets} GetAllTicketHead={GetAllTicketHead} editData={editData}  />} modalTitle={ editData?.id ? 'Update Ticket Head' : 'Add Tickets Head'} size={'lg'} />

             <div className='flex'>
            <h4 className='p-3 px-4 mt-3 bg-transparent text-white headingBelowBorder' style={{ maxWidth: "18rem", minWidth: "18rem" }}>  Ticket Head</h4>

            <div className='AttendenceNavBtn w-100 py-2 px-4 gap-3 justify-content-end'>
                <div className={`py-2 px-4 border shadow rounded-2 cursor-p hoverThis text-white Fw_500 d-flex align-items-center justify-content-center `} style={{ minWidth: "18rem", maxWidth: "18rem" }}  onClick={ToggleAddTickets}>
                Create New Ticket Head
                </div>
            </div>
            </div>

            <div className='p-4'>
                <AdminDataTable rows={DataWithID(data.data)} columns={column} CustomToolbar={CustomToolbar} />
            </div>
        </Fragment>
    )
}

export default TicketsHead