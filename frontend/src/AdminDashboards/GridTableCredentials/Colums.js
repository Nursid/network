import { Button } from '@mui/material';
import { AssignSupervisorModal } from '../../Components/Modal';
import { useState } from 'react';

const AssignSupervisor = () => {
    const [complainModalOpen, setComplainModalOpen] = useState(false);

    return (
        <AssignSupervisorModal
            complainModalOpen={complainModalOpen}
            complainModalOpenFunction={() => setComplainModalOpen(!complainModalOpen)}
        />
    );
}
export const columns = [

    {
        field: "action",
        headerName: "Action",
        renderCell: (params) => (
            
            <select
                className="p-2 border-0"
                style={{ borderRadius: "5px", outline: "none", cursor: "pointer" }}
            >
                
                <option value="Cancel">Cancel</option>
                <option value="Transfer">Transfer</option>
                <option value="Hold">Hold</option>
                <option value="Complete">Complete</option>
                <option value="Edit">Edit</option>
                
            </select>
        ),
        minWidth: 150,
        editable: false,
    },
    { field: "cust_id", headerName: "Customer ID", minWidth: 120, editable: false },
    { field: "order_no", headerName: "Order Number", minWidth: 120, editable: false },
    { field: "user_type", headerName: "Type", minWidth: 80, editable: false },
    { field: "service_name", headerName: "Service Type",minWidth: 120, editable: false },
    { field: "booktime", headerName: "Booking Time", minWidth: 120, editable: false },
    { field: "bookdate", headerName: "Booking Date", minWidth: 120, editable: false },
    { field: "name", headerName: "Customer Name", flex: 1, cellClassName: "name-column--cell",
        minWidth: 150, editable: false },
    { field: "problem_des", headerName: "Problem Description ", minWidth: 150, editable: false },
    { field: "suprvisor_id", headerName: "Supervisor",
    renderCell: (params) => ( 
        <>
        {(!params.row.suprvisor_id) ? (<><Button variant='contained' color='primary' onClick={AssignSupervisor}>Supervisor</Button></> ) : <>{params.row.suprvisor_id} </> } </> ), minWidth: 150, editable: false },

    { field: "servicep_id", headerName: "Service Provider",
    renderCell: (params) => ( 
        <>
        {(!params.row.servicep_id) ? (<><Button variant='contained' color='primary'>Service Provider </Button></> ) : <>{params.row.servicep_id} </> } </> ),
    minWidth: 200, editable: false },

    { field: "vehicle_inventory", headerName: "Vehicle Used",
    renderCell: (params) => ( 
        <>
        {(!params.row.vehicle_inventory) ? (<><Button variant='contained' color='primary'> Choose Vehicle</Button></> ) : <>{params.row.vehicle_inventory} </> } </> ),
     minWidth: 200, editable: false },
    { field: "netpayamt", headerName: "Billing Amount",
    renderCell: (params) => ( 
        <>
        {(!params.row.netpayamt) ? (<><Button variant='contained' color='primary'>Amount</Button></> ) : <>{params.row.netpayamt} </> } </> ),
    minWidth: 150, editable: false },
    { field: "piadamt", headerName: "Paid Amount", minWidth: 150, editable: false },
    { field: "totalamt", headerName: "Balance Amount", minWidth: 150, editable: false },
    { field: "paymethod", headerName: "Payment Method", minWidth: 150, editable: false },
    { field: "bakof_remark", headerName: "Back Office Remark",
    
    renderCell: (params) => ( 
        <>
        {(params.row.userRole.role==="office" && !params.row.bakof_remark) ? (<><Button variant='contained' color='primary'>Remark</Button></> ) : <>{params.row.bakof_remark} </> } </> ),

    minWidth: 180, editable: false},
    { field: "admin_remark", headerName: "Admin Remark",
    renderCell: (params) => ( 
        <>
        {(params.row.userRole.role==="admin" && !params.row.admin_remark) ? (<><Button variant='contained' color='primary'>Remark</Button></> ) : <>{params.row.admin_remark} </> } </> ),
    minWidth: 150, editable: false },
    { field: "providerratings", headerName: "Provider Ratings",
    // renderCell: (params) => ( 
    //     <>
    //     {console.log("params.row.userRole-----",params.row)}
    //      </> ),

    minWidth: 150, editable: false },
    { field: "sueadmin_remark", headerName: "Super Admin Remark",
    renderCell: (params) => ( 
        <>
        {(params.row.userRole.role==="super" && !params.row.sueadmin_remark) ? (<><Button variant='contained' color='primary'>Remark</Button></> ) : <>{params.row.sueadmin_remark} </> } </> ),

    minWidth: 180, editable: false,},
    { field: "serviceproviderremark",
        headerName: "Service Provider Remark",

        renderCell: (params) => ( 
            <>
            {( params.row.userRole.role==="service" && !params.row.serviceproviderremark) ? (<><Button variant='contained' color='primary'>Remark</Button></> ) : <>{params.row.serviceproviderremark} </> } </> ),
            

        minWidth: 180,
        editable: false,
    },
    { field: "pending", headerName: "Order Status", minWidth: 150, editable: false },
    { field: "cancle_reson", headerName: "Cancel Reason", minWidth: 150, editable: false },
];

// supervisor
//admin
//super
// service
// office