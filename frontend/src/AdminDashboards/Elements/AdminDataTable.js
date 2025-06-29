import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react';
import "./AnimatedBackground.css"
const AdminDataTable = ({ rows, columns, CustomToolbar, ...args }) => {

    const getRowClassName = (params) => {
        return "";
    };

    return (
        <Box
            m="0px 0 0 0"
            height="100%"
            sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                    // backgroundColor: "red",
                },
                "& .name-column--cell": {
                    // color: colors.greenAccent[300],
                    color: "#e52c2a",
                },
                "& .MuiDataGrid-columnHeaders": {
                
                    backgroundColor: "#112c85",
                    borderBottom: "none",
                    color: "#ffffff",
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: "#f2f0f0",
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                
                    backgroundColor: "#112c85",
                    color: "#ffffff",
                },
                "& .MuiCheckbox-root": {
                    color: `#1e5245 !important`,
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `#000000 !important`,
                },
                "& .MuiDataGrid-toolbarContainer .MuiSvgIcon-root": {
                    fill: "#000000",
                },
                "& .MuiTablePagination-root": {
                    color: "#ffffff",
                },
                "& .MuiInputBase-input-MuiInput-input": {
                    color: '#ffffff !important'
                }
            }}
        >

            <DataGrid
                rows={rows}
                columns={columns}
                components={{ Toolbar: CustomToolbar }}
                getRowClassName={getRowClassName}
            />
        </Box>
    )
}

export default AdminDataTable