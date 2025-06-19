import { useState, useEffect } from "react"
import AdminDataTable from "../../Elements/AdminDataTable";
import { Button } from "reactstrap"
import { GridToolbarContainer, GridToolbarQuickFilter, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllAllotedItems } from "../../../Store/Actions/Dashboard/InventryAction";
import { AllotItemModal } from "../../../Components/Modal";
import moment from "moment";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import BorderColorIcon from '@mui/icons-material/BorderColor';

const AllotedItem = () => {

    const dispatch = useDispatch();
    const { data, isLoading } = useSelector(state => state.GetAllAllotedItemReducers || []);
    const [allotedItemModalOpen, setAllotedItemModalOpen] = useState(false);
    const [allotedItemData, setAllotedItemData] = useState(null);

    useEffect(() => {
        dispatch(GetAllAllotedItems());
    }, [dispatch]);

    const AllotedItemsCollums = [
        { field: "_id", headerName: "Sr No.", minWidth: 200, editable: false },
        { field: "allotdate", headerName: "Date", minWidth: 220, editable: false },
        { field: "spname", headerName: "Alloted To", minWidth: 220, editable: false },
        { field: "item", headerName: "Item", minWidth: 220, editable: false },
        { field: "aqty", headerName: "Quantity", minWidth: 220, editable: false },
        { field: "remark", headerName: "Remark", minWidth: 220, editable: false },
        { 
            field: "action", 
            headerName: "Action", 
            minWidth: 220,  
            editable: false,
            renderCell: (params) => (
                <div className="d-flex gap-2">
                    <Button variant="contained" color="primary" onClick={() => {
                        setAllotedItemModalOpen(!allotedItemModalOpen);
                        setAllotedItemData(params.row);
                    }}>
                        <BorderColorIcon />
                    </Button>
                    {/* <Button variant="contained" color="danger" onClick={() => {
                        // Add delete functionality here if needed
                        console.log('Delete item:', params.row);
                    }}>   
                        <DeleteForeverIcon />
                    </Button> */}
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
                NewData.push({ 
                    ...item, 
                    _id: data.indexOf(item) + 1,  
                })
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
    }

  

    return (    
        <Fragment>
            <AllotItemModal
                allotItemModalOpen={allotedItemModalOpen}
                allotItemModalfunction={() => setAllotedItemModalOpen(!allotedItemModalOpen)}
                inventryData={allotedItemData}
            />

            <div className='flex'>
                <h4 className='p-3 px-4 mt-3 bg-transparent text-white headingBelowBorder' style={{ maxWidth: "18rem", minWidth: "18rem" }}>
                    All Alloted Item List
                </h4>

                <div className='AttendenceNavBtn w-100 py-2 px-4 gap-3 justify-content-end'>
                    <div 
                        className={`py-2 px-4 border shadow rounded-2 cursor-p hoverThis text-white Fw_500 d-flex align-items-center justify-content-center`} 
                        style={{ minWidth: "18rem", maxWidth: "18rem" }} 
                        onClick={() => {
                            setAllotedItemData(null); 
                            setAllotedItemModalOpen(!allotedItemModalOpen);
                        }}
                    >
                        Allot Item
                    </div>
                </div>
            </div>

            <div className='p-4'>
                <AdminDataTable 
                    rows={DataWithID(data)} 
                    CustomToolbar={CustomToolbar} 
                    columns={AllotedItemsCollums}
                    loading={isLoading}
                />
            </div>
        </Fragment> 
    )
}

export default AllotedItem