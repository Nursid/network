import { Switch } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import { Card, Col, Row } from 'reactstrap'
import { API_URL, roles } from '../../../../config'
import Swal from 'sweetalert2'
import axios from 'axios'

const EmployeeRolesAndPermission = ({ employeeRolesId }) => {

    const [adminRolesData, setAdminRolesData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState('admin') 

    const role = roles.admin

    // Fetch roles data from API
    const fetchRolesData = async (roleType = selectedRole) => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/roles/admin/${employeeRolesId}`)
            if (response.status === 200) {
                setAdminRolesData(response.data.data)
            } else {
                Swal.fire('Error', 'Failed to fetch roles data', 'error')
            }
        } catch (error) {
            console.error('Error fetching roles:', error)
            Swal.fire('Error', 'Failed to fetch roles data', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleTheUpdateRoles = (field, currentValue) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${currentValue ? 'disable' : 'enable'} ${field} permission?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Change it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const newValue = !currentValue;
                    const response = await axios.put(`${API_URL}/roles/admin/update/${employeeRolesId}/${field}/${newValue}`)
                    if (response.status === 200) {
                        setAdminRolesData(response.data.data)
                        Swal.fire(
                            'Updated!',
                            'Permission has been updated successfully',
                            'success'
                        )
                    } else {
                        Swal.fire('Error', 'Failed to update permission', 'error')
                    }
                } catch (error) {
                    console.error('Error updating role:', error)
                    Swal.fire('Error', 'Failed to update permission', 'error')
                }
            }
        })
    }


    let AllRoles;
    if (adminRolesData) {
        AllRoles = [Object.keys(adminRolesData).filter(x => ["_id", "role", "Profile", "__v", "id", "emp_id", "createdAt", "updatedAt"].includes(x) === false)]
    }


    useEffect(() => {
        fetchRolesData()
    }, [selectedRole])

    return (
        <Fragment>
            <div className=''>
                <Card className='bg-glass mt-2' style={{ border: 'none' }}>
                    {/* <h5 className='p-3'>
                        Roles & Permission 
                        (<span className='text-primary'>
                            {adminRolesData && adminRolesData.role ? adminRolesData.role : selectedRole}
                        </span>)
                    </h5> */}
                    
                    {loading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <Row>
                            <Col md={12}>
                                <Card className='p-3 shadow-lg d-flex flex-column gap-3 border-none'>
                                    {/* main role */}
                                    {AllRoles ? AllRoles[0].map((item, index) => (
                                        <div key={index} className='permissionWithSwitch d-flex align-items-center justify-content-between'>
                                            <h6 className='Fw_600 text-blue'>{item}</h6>
                                            <Switch 
                                                color="warning" 
                                                checked={adminRolesData[item]} 
                                                onChange={() => { handleTheUpdateRoles(item, adminRolesData[item]) }} 
                                            />
                                        </div>
                                    )) : (
                                        <div className="text-center p-4">
                                            <p>No roles data available</p>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Card>
            </div>
        </Fragment>
    )
}

export default EmployeeRolesAndPermission