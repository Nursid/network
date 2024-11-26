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
            <div className='position-relative'>
                <AnimatedBackground />
                <div className='BackgroundTopContents'>
                    <AdminNavItems />


                    <div className="AttendenceTabs px-3">
                        <span className={`${attendanceActive === "packs" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("out") }}>Packs/Plans</span>

                        <span className={` ${attendanceActive === "service" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("in") }}>Service</span>
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
        </Fragment>
    )
}

export default AdminManageMaster