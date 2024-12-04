import React, { Fragment, useState } from 'react'
import AdminHeader from '../AdminHeader'
import AnimatedBackground from '../../Elements/AnimatedBacground'
import AdminNavItems from '../../Elements/AdminNavItems'
import { TabContent, TabPane } from 'reactstrap'
import AdminRoles from './AdminRoles'
import SupervisorRoles from './SupervisorRoles'
import OfficeRoles from './OfficeRoles'
import { useUserRoleContext } from '../../../Context/RolesContext'
import ServiceProviderRoles from './ServiceProviderRoles'

const AdminRolesAndPermission = () => {
    const [attendanceActive, setActiveAttendance] = useState("admin")

    const { supervisorRoles,
        backOfficeRoles,
        serviceProviderRoles,
        adminRoles } = useUserRoleContext();


    return (
        <Fragment>
        <AdminHeader />
        <div className="d-flex">
          <div
            className="sidebar bg-light"
            style={{
              width: "300px",
              position: "sticky",
              top: 0,
              height: "100vh",
            }}
          >
            <AdminNavItems  />
          </div>
          <div
            className="main-content flex-grow-1 position-relative"
            style={{
              width: "calc(100% - 300px)",
              overflowY: "auto",
            }}
          >
            <AnimatedBackground />
            <div className="BackgroundTopContents">
                      <div className="AttendenceTabs px-3 pt-2">
                        <span className={` ${attendanceActive === "admin" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("admin") }}>Admin</span>
                        {/* <span className={` ${attendanceActive === "supervisor" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("supervisor") }}>Supervisor</span>

                        <span className={` ${attendanceActive === "office" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("office") }}>Back Office</span> */}

                        <span className={` ${attendanceActive === "service" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("service") }}>Service Provider</span>


                        {/* <span className={` ${attendanceActive === "enquiry" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("enquiry") }}></span> */}
                    </div>
                    <TabContent activeTab={attendanceActive} >
                        <TabPane tabId="admin">
                            <AdminRoles adminRoles={adminRoles} />
                        </TabPane>
                        <TabPane tabId="supervisor">
                            <SupervisorRoles supervisorRoles={supervisorRoles} />
                        </TabPane>
                        <TabPane tabId="office">
                            <OfficeRoles backOfficeRoles={backOfficeRoles} />
                        </TabPane>
                        <TabPane tabId="service">
                            <ServiceProviderRoles serviceprovider={serviceProviderRoles} />
                        </TabPane>
                    </TabContent>
                </div>
            </div>
            </div>
        </Fragment>
    )
}

export default AdminRolesAndPermission