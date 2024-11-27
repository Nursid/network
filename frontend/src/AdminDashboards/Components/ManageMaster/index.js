import React, { Fragment, useState } from 'react'
import ManageService from './ManageService'
import AdminHeader from '../AdminHeader'
import AnimatedBackground from '../../Elements/AnimatedBacground'
import AdminNavItems from '../../Elements/AdminNavItems'
import { TabContent, TabPane } from 'reactstrap'
import ManagePlans from './ManagePlans'

const AdminManageMaster = () => {
    const [attendanceActive, setActiveAttendance] = useState("packs")
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
                        <span className={`${attendanceActive === "packs" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("packs") }}>Packs/Plans</span>

                        <span className={` ${attendanceActive === "service" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("service") }}>Service</span>
                    </div>


                    <TabContent activeTab={attendanceActive} >
                        <TabPane tabId="service">
                            <ManageService />
                        </TabPane>
                        <TabPane tabId="packs">
                            <ManagePlans />
                        </TabPane>
                    </TabContent>
                </div>
            </div>
            </div>
        </Fragment>
    )
}

export default AdminManageMaster