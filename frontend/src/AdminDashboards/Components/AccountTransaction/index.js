import React, { Fragment, useEffect, useState } from 'react'
import AdminHeader from '../AdminHeader'
import AnimatedBackground from '../../Elements/AnimatedBacground'
import AdminNavItems from '../../Elements/AdminNavItems'
import { TabContent, TabPane } from 'reactstrap'
import AllTransaction from './AllTransaction'
import PaymentPending from './PaymentPending'
import CollectionTally from './CollectionTally'
import { useUserRoleContext } from '../../../Context/RolesContext'

const AccountTransaction = () => {

    const [attendanceActive, setActiveAttendance] = useState("all-transaction")

    const { userRole, setUserRole, UserRoleCalled } = useUserRoleContext();
    
    // to set the active page 
    const ActiveTabFunction = () => {
        if (userRole.AllTransaction) {
            setActiveAttendance('all-transaction')
        } else if (userRole.PaymentPending) {
            setActiveAttendance("payment-pending")
        } else if (userRole.CollectionTally) {
            setActiveAttendance("collection-tally")
        }
    }

    // useEffect(() => {
    //     ActiveTabFunction()
    // }, [userRole])

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

                        {userRole && userRole.AllTransaction ? <span className={` ${attendanceActive === "all-transaction" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("all-transaction") }}>All Transaction</span> : null}

                        {userRole && userRole.PaymentPending ? <span className={` ${attendanceActive === "payment-pending" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("payment-pending") }}>Payment Pending</span> : null}

                        {userRole && userRole.CollectionTally ? <span className={` ${attendanceActive === "collection-tally" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveAttendance("collection-tally") }}>Collection Tally</span> : null}
                        
                    </div>
                    <TabContent activeTab={attendanceActive} >

                        {userRole && userRole.AllTransaction ?
                            <TabPane tabId="all-transaction">
                                <AllTransaction setActiveAttendance={setActiveAttendance} />
                            </TabPane>
                            : null}

                        {userRole && userRole.PaymentPending ?
                            <TabPane tabId="payment-pending">
                                <PaymentPending setActiveAttendance={setActiveAttendance} />
                            </TabPane> 
                            : null}

                        {userRole && userRole.CollectionTally ?
                            <TabPane tabId="collection-tally">
                                <CollectionTally setActiveAttendance={setActiveAttendance} />
                            </TabPane>
                            : null}
                    </TabContent>
                    </div>
				</div>
			</div>
			</Fragment>
    )
}

export default AccountTransaction;