import { Button } from '@mui/material';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { Fragment, useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom';
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../config';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

const ManageFlow = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        olt_name: '',
        port: '',
        status: true
    });

    const navigate = useNavigate();

    const fetchFlowData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/flow/getall`);
            if (response.data.status) {
                setData(response.data.data);
            } else {
                console.error("Failed to fetch flow data");
            }
        } catch (error) {
            console.error("Error fetching flow data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlowData();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Create data object to match the FlowModel schema
            const flowData = {
                name: formData.name,
                olt_name: formData.olt_name,
                port: parseInt(formData.port),
                status: formData.status
            };

            const response = await axios.post(`${API_URL}/api/flow/add`, flowData);
            if (response.data.status) {
                setSuccessMessage(response.data.message || 'Flow added successfully!');
                // Reset form after successful submission
                setFormData({
                    name: '',
                    olt_name: '',
                    port: '',
                    status: true
                });
                // Refresh the flow data
                fetchFlowData();
                // Close modal after a brief delay
                setTimeout(() => {
                    setModalOpen(false);
                    setSuccessMessage('');
                }, 2000);
            } else {
                setErrorMessage(response.data.message || 'Failed to add flow');
            }
        } catch (error) {
            console.error('Error adding flow:', error);
            setErrorMessage(error.response?.data?.message || 'An error occurred while adding the flow');
        } finally {
            setLoading(false);
        }
    };

    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined && data.length > 0) {
            for (let item of data) {
                NewData.push({ 
                    ...item, 
                    _id: data.indexOf(item) + 1,
                    date: item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY") : "-",
                    statusText: item.status ? "Active" : "Inactive"
                })
            }
        } else {
            NewData.push({ id: 0 })
        }
        return NewData
    }
   
    // Handle view flow details
    const handleViewFlow = (flowData) => {
        console.log(flowData);
        navigate('/admin/flow', { state: { flowData } });
    };

    const column = [
        { field: "_id", headerName: "Sr No", minWidth: 50, flex: 1 },       
        { field: "name", headerName: "Name", minWidth: 120, flex: 1 },
        { field: "olt_name", headerName: "OLT Name", minWidth: 120, flex: 1 },
        { field: "port", headerName: "Port", flex: 1, minWidth: 120 }, 
        { field: "date", headerName: "Created Date", flex: 1, minWidth: 120 },
        { field: "status", headerName: "Status", flex: 1, minWidth: 120,
          renderCell: (params) => (
            <div className={`badge ${params.row.status ? 'bg-success' : 'bg-danger'}`}>
                {params.row.status ? "Active" : "Inactive"}
            </div>
          )
        },
        { 
            field: "actions", 
            headerName: "Actions", 
            flex: 1, 
            minWidth: 120,
            renderCell: (params) => (
                <div className="d-flex">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewFlow(params.row)}
                        style={{ margin: "0 5px" }}
                    >
                        View
                    </Button>
                </div>
            )
        }
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
    }

    const handleAddFlow = () => {
        // Reset form and messages
        setFormData({
            name: '',
            olt_name: '',
            port: '',
            status: true
        });
        setErrorMessage('');
        setSuccessMessage('');
        setModalOpen(true);
    }

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        setErrorMessage('');
        setSuccessMessage('');
    }

    return (
        <Fragment>
            <div style={{ height: "calc(100vh - 20px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div className='flex'>  
                    <h4 className='p-2 px-4 mt-2 bg-transparent text-white headingBelowBorder' style={{ maxWidth: "18rem", minWidth: "18rem" }}>Flow List</h4>

                    <div className='AttendenceNavBtn w-100 py-1 px-4 gap-3 justify-content-end'>
                        <div 
                            className={`py-1 px-4 border shadow rounded-2 cursor-p hoverThis text-white Fw_500 d-flex align-items-center justify-content-center`} 
                            style={{ minWidth: "15rem", maxWidth: "15rem" }} 
                            onClick={handleAddFlow}
                        >
                            Add Flow
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, overflow: "auto", padding: "0 16px 0 16px", marginBottom: 0 }}>
                    <AdminDataTable 
                        rows={DataWithID(data)} 
                        columns={column} 
                        CustomToolbar={CustomToolbar} 
                        loading={loading}
                    />
                </div>
            </div>

            {/* Add Flow Modal */}
            <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal}>Add New Flow</ModalHeader>
                <ModalBody>
                    {errorMessage && (
                        <Alert color="danger">{errorMessage}</Alert>
                    )}
                    {successMessage && (
                        <Alert color="success">{successMessage}</Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="name">Connection Type</Label>
                            <Input
                                type="select"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Connection Type</option>
                                <option value="EPON">EPON</option>
                                <option value="GPON">GPON</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="olt_name">OLT Name</Label>
                            <Input
                                type="text"
                                name="olt_name"
                                id="olt_name"
                                placeholder="Enter OLT Name"
                                value={formData.olt_name}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="port">Port</Label>
                            <Input
                                type="number"
                                name="port"
                                id="port"
                                placeholder="Enter Port Number"
                                value={formData.port}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup check className="mb-3">
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                />{' '}
                                Active
                            </Label>
                        </FormGroup>
                        <div className="d-flex justify-content-end">
                            <Button 
                                type="button" 
                                color="secondary" 
                                className="me-2" 
                                onClick={toggleModal}
                                disabled={loading}
                                style={{ marginRight: "10px" }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained"
                                color="primary" 
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Flow'}
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default ManageFlow