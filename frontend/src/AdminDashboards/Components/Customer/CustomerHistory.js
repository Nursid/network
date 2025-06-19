import React, { Fragment, useState } from 'react'
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid'

import { mockDataContacts } from '../../data/mockData'
import { useEffect } from 'react';
import AdminDataTable from '../../Elements/AdminDataTable';
import { GetAllLastServices } from '../../../Store/Actions/Dashboard/Customer/CustomerActions';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
const CustomerHistory = () => {

    // active and not active memeber 
    const [activeMember, setActiveMember] = useState(false);


    const { data, isLoading } = useSelector(state => state.GetALLLastServicesReducers)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(GetAllLastServices())
    }, [])



    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined) {
            for (let item of data) {
                let orders = item.orders;
                let orderProcess =item.orderProcess
                let mergedItem = {...item, ...orderProcess,orders};
                NewData.push({ ...mergedItem,id: item.id, _id: data.indexOf(item), date: moment(orderProcess.bookdate).format("D / M / Y") })
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
    }

    const column = [
        { field: "_id", headerName: "Sr No", minWidth: 50 },
        { field: "id", headerName: "Member Id",  minWidth: 250 },
            

        { field: "cust_id", headerName: "Customer ID", minWidth: 120, editable: false,  },
    { field: "order_no", headerName: "Order Number", minWidth: 120, editable: false },
    { field: "user_type", headerName: "Type", minWidth: 80, editable: false },
    { field: "service_name", headerName: "Service Type",minWidth: 120, editable: false },
    { field: "booktime", headerName: "Booking Time", minWidth: 120, editable: false },
    { field: "bookdate", headerName: "Booking Date", minWidth: 120, editable: false },
    { field: "name", headerName: "Customer Name",minWidth: 150, editable: false },
    { field: "problem_des", headerName: "Problem Description ", minWidth: 150, editable: false },
    { field: "suprvisor_id", headerName: "Supervisor",
     minWidth: 150, editable: false },

    { field: "servicep_id", headerName: "Service Provider",
    minWidth: 200, editable: false },

    { field: "vehicle_inventory", headerName: "Vehicle Used",
     minWidth: 200, editable: false },
    { field: "netpayamt", headerName: "Billing Amount",
    minWidth: 150 },
    { field: "paymethod", headerName: "Payment Method", minWidth: 150},
    { field: "piadamt", headerName: "Paid Amount", minWidth: 150 },
    { field: "totalamt", headerName: "Balance Amount", minWidth: 150},
    { field: "cust_remark", headerName: "Customer Feedback", minWidth: 150 },

    { field: "bakof_remark", headerName: "Back Office Remark", minWidth: 180, editable: false},
    { field: "admin_remark", headerName: "Admin Remark",
    minWidth: 150, editable: false },
    { field: "sueadmin_remark", headerName: "Super Admin Remark",
    minWidth: 180, editable: false,},
    { field: "serviceproviderremark",
        headerName: "Service Provider Remark",
        minWidth: 180,
        editable: false,
    },
    { field: "pending", headerName: "Order Status", minWidth: 150, editable: false },
    { field: "cancle_reson", headerName: "Cancel Reason", minWidth: 150, editable: false },


    ];
    const CustomToolBar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarQuickFilter />
                <GridToolbarFilterButton />
                <GridToolbarColumnsButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
                {/* <h6 className={`p-1 text-light cursor-p rounded-2 ${!activeMember ? "Nav_hover_active" : "Nav_hover"} `} onClick={() => setActiveMember(false)}>Active Customer</h6>
                <h6 className={`p-1 text-light cursor-p rounded-2 ${activeMember ? "Nav_hover_active" : "Nav_hover"} `} onClick={() => setActiveMember(true)}>Non Active Customer</h6> */}
            </GridToolbarContainer>
        )
    }
    return (
        <Fragment>
            <h4 className='p-3 px-4 mt-3 bg-transparent headingBelowBorder text-white' style={{ maxWidth: "fit-content" }}>Customer List</h4>
            <div className='p-4'>
                <AdminDataTable rows={DataWithID(data.data)} columns={column} CustomToolbar={CustomToolBar} />
            </div>
        </Fragment>
    )
}

export default CustomerHistory