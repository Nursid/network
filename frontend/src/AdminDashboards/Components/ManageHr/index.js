import React, { Fragment, useEffect, useState } from 'react'
import AdminHeader from '../AdminHeader'
import AnimatedBackground from '../../Elements/AnimatedBacground'
import AdminNavItems from '../../Elements/AdminNavItems'
import { TabContent, TabPane } from 'reactstrap'
import ManageEmployee from './ManageEmployee'
import ManageServiceProvider from './ManageServiceProvider'
import { useUserRoleContext } from '../../../Context/RolesContext'
// import ManageMonthService from './ManageMonthService'

const AdminManageHr = () => {
  const [attendanceActive, setActiveAttendance] = useState("employee")
  const { userRole, setUserRole, UserRoleCalled } = useUserRoleContext();
  // to set the active page 
  const ActiveTabFunction = () => {
    if (userRole.ManageEmployee) {
      setActiveAttendance('employee')
    } else if (userRole.ManageServiceProvider) {
      setActiveAttendance("service-provider")
    }
    // else if (userRole.ManageMonthService) {
    //   setActiveAttendance("monthly-services")
    // }
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
            {userRole && userRole.ManageEmployee ? <span className={` ${attendanceActive === "employee" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("employee") }}> Employee Management</span> : null}

            {/* {userRole && userRole.ManageMonthService ? <span className={` ${attendanceActive === "monthly-services" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("monthly-services") }}>Manage Monthly Service </span> : null} */}

            {userRole && userRole.ManageServiceProvider ? <span className={` ${attendanceActive === "service-provider" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("service-provider") }}> Local Service Provider</span> : null}
          </div>


          <TabContent activeTab={attendanceActive} >
            <TabPane tabId="employee">
              <ManageEmployee setActiveAttendance={setActiveAttendance} />
            </TabPane>
            <TabPane tabId="service-provider">
              <ManageServiceProvider setActiveAttendance={setActiveAttendance} />
            </TabPane>

            {/* <TabPane tabId="monthly-services">
              <ManageMonthService setActiveAttendance={setActiveAttendance} />
            </TabPane> */}


          </TabContent>
        </div>
        </div>
      </div>
    </Fragment>
  )
}
export default AdminManageHr