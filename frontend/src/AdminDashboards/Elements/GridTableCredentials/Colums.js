export const columns = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 100, editable: false },
    { field: "registrarId", headerName: "Customer ID", minWidth: 120, editable: false },
    { field: "orderNumber", headerName: "Order Number", minWidth: 120, editable: false },
    { field: "type", headerName: "Type", minWidth: 80, editable: false },
    { field: "servicetype", headerName: "Service Type", minWidth: 120, editable: false },
    { field: "bookingtime", headerName: "Booking Time", minWidth: 120, editable: false },
    { field: "bookingdate", headerName: "Booking Date", minWidth: 120, editable: false },
    {
        field: "name",
        headerName: "Customer Name",
        flex: 1,
        cellClassName: "name-column--cell",
        minWidth: 150,
        editable: false,
    },
    { field: "service", headerName: "Service Name", minWidth: 120, editable: false },
    { field: "servicedetails", headerName: "Service Details", minWidth: 150, editable: false },
    { field: "supervisor", headerName: "Supervisor", minWidth: 120, editable: false },
    { field: "serviceprovider", headerName: "Service Provider", minWidth: 150, editable: false },
    { field: "vehicleused", headerName: "Vehicle Used", minWidth: 120, editable: false },
    { field: "billingamount", headerName: "Billing Amount", minWidth: 150, editable: false },
    { field: "paidamount", headerName: "Paid Amount", minWidth: 150, editable: false },
    { field: "balanceamount", headerName: "Balance Amount", minWidth: 150, editable: false },
    { field: "paymentmethod", headerName: "Payment Method", minWidth: 150, editable: false },
    {
        field: "backofficeremark",
        headerName: "Back Office Remark",
        minWidth: 180,
        editable: false,
    },
    { field: "adminremark", headerName: "Admin Remark", minWidth: 150, editable: false },
    { field: "providerratings", headerName: "Provider Ratings", minWidth: 150, editable: false },
    {
        field: "superadminremark",
        headerName: "Super Admin Remark",
        minWidth: 180,
        editable: false,
    },
    {
        field: "serviceproviderremark",
        headerName: "Service Provider Remark",
        minWidth: 180,
        editable: false,
    },
    { field: "orderstatus", headerName: "Order Status", minWidth: 150, editable: false },
    { field: "canclereason", headerName: "Cancel Reason", minWidth: 150, editable: false },
    {
        field: "age",
        headerName: "Age",
        type: "number",
        headerAlign: "left",
        align: "left",
        minWidth: 80,
        editable: false,
    },
    { field: "phone", headerName: "Phone Number", flex: 1, minWidth: 150, editable: false },
    { field: "email", headerName: "Email", flex: 1, minWidth: 150, editable: false },
    { field: "address", headerName: "Address", flex: 1, minWidth: 150, editable: false },
    { field: "city", headerName: "City", flex: 1, minWidth: 150, editable: false },
    { field: "zipCode", headerName: "Zip Code", flex: 1, minWidth: 150, editable: false },
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
                <option value="Delete">Delete</option>
            </select>
        ),
        minWidth: 150,
        editable: false,
    },
    {
        field: "status",
        headerName: "Status",
        className: "centerTheElement",
        renderCell: (params) => (
            <p
                className="text-danger p-2 bg-light"
                style={{
                    borderRadius: "5px",
                    cursor: "pointer",
                    transform: "translate(25%,25%)",
                }}
            >
                Check In
            </p>
        ),
        minWidth: 150,
        editable: false,
    },
];
