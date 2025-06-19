import { useState, useEffect } from "react"
import AdminDataTable from "../../Elements/AdminDataTable"
import { Button } from "reactstrap"
import { GridToolbarContainer, GridToolbarQuickFilter, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { Fragment } from "react";
import { AddInventryModal } from "../../../Components/Modal";
import { GetAllInventry } from "../../../Store/Actions/Dashboard/InventryAction";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import BorderColorIcon from '@mui/icons-material/BorderColor';

const Inventory = () => {
    const dispatch = useDispatch();
    const [inventry, setInventry] = useState(false);
    const [allotedItems, setAllotedItems] = useState(false);
    const { data, isLoading } = useSelector(state => state.GetAllInventryReducers || []);
    const [AddInventryModalOpen, setAddInventryModalOpen] = useState(false);
    const [inventryData, setInventryData] = useState(null);

    useEffect(() => {
        dispatch(GetAllInventry());
    }, [dispatch]);

  const Inventrycolumns = [
    { field: "_id", headerName: "Sr No.", minWidth: 200,  editable: false},
    { field: "item", headerName: "Name", minWidth: 220,  editable: false },
    { field: "qty", headerName: "Quantity", minWidth: 220,  editable: false },
    { field: "action", headerName: "Action", minWidth: 220,  editable: false,
        renderCell: (params) => (
            <div className="d-flex gap-2">
                <Button variant="contained" color="primary" onClick={() => {
                    setAddInventryModalOpen(!AddInventryModalOpen);
                    setInventryData(params.row);
                }}><BorderColorIcon /></Button>
                {/* <Button variant="contained" color="danger" onClick={() => {
                    setAddInventryModalOpen(!AddInventryModalOpen);
                    setInventryData(params.row);
                }}>   <DeleteForeverIcon /></Button> */}
            </div>  

        )
     }
  ]

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


    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined) {
            for (let item of data) {
                NewData.push({ ...item, _id: data.indexOf(item) + 1, date: moment(item.createdAt).format("DD-MM-YYYY") })
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
    }

    
    return (
            <Fragment>

    <AddInventryModal
        AddInventryModalOpen={AddInventryModalOpen}
        AddInventryModalOpenFunction={() => setAddInventryModalOpen(!AddInventryModalOpen)}
        data={inventryData}
        GetAllInventry={GetAllInventry}
      />


<div className='flex'>
<h4 className='p-3 px-4 mt-3 bg-transparent text-white headingBelowBorder' style={{ maxWidth: "18rem", minWidth: "18rem" }}> All Inventory List</h4>

<div className='AttendenceNavBtn w-100 py-2 px-4 gap-3 justify-content-end'>
    <div className={`py-2 px-4 border shadow rounded-2 cursor-p hoverThis text-white Fw_500 d-flex align-items-center justify-content-center `} style={{ minWidth: "18rem", maxWidth: "18rem" }} onClick={() => setAddInventryModalOpen(!AddInventryModalOpen)} >
    Add Inventory
    </div>
</div>
</div>

<div className='p-4'>
    <AdminDataTable rows={DataWithID(data)} CustomToolbar={CustomToolbar} columns={Inventrycolumns} />
</div>
</Fragment>


    )
}

export default Inventory