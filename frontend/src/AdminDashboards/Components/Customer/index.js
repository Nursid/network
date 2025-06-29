import React, { Fragment, useEffect, useState } from 'react'
import AdminHeader from '../AdminHeader'
import AnimatedBackground from '../../Elements/AnimatedBacground'
import AdminNavItems from '../../Elements/AdminNavItems'
import { TabContent, TabPane } from 'reactstrap'
import ManageCustomer from './ManageCustomer'
import ManageEnquiry from './ManageEnquiry'
import { useUserRoleContext } from '../../../Context/RolesContext'

const AdminCustomerManage = () => {
    const [attendanceActive, setActiveAttendance] = useState("customer")

    const { userRole, setUserRole, UserRoleCalled } = useUserRoleContext();
    // to set the active page 
    const ActiveTabFunction = () => {
        if (userRole.ManageCustomer) {
            setActiveAttendance('customer')
        }
        else if (userRole.ManageEnquiry) {
            setActiveAttendance('enquiry')
        }
    }

    useEffect(() => {
        ActiveTabFunction()
    }, [userRole])


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
                        {userRole && userRole.ManageCustomer ? <span className={` ${attendanceActive === "customer" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("customer") }}>Manage Customers</span> : null}

                        {userRole && userRole.ManageEnquiry ? < span className={` ${attendanceActive === "enquiry" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("enquiry") }}>Manage Enquiry</span> : null}
                    </div>
                    <TabContent activeTab={attendanceActive} >
                        {userRole && userRole.ManageCustomer ?
                            <TabPane tabId="customer">
                                <ManageCustomer />
                            </TabPane>
                            : null}

                        {userRole && userRole.ManageEnquiry ?
                            <TabPane tabId="enquiry">
                                <ManageEnquiry />
                            </TabPane>
                            : null}
                    </TabContent>
                    </div>
                    </div>
			</div>
			</Fragment>
    )
}

export default AdminCustomerManage