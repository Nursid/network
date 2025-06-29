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

    const { userRole } = useUserRoleContext();


    return (
        // <Fragment>
        //     <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
        //         {/* Left Sidebar - 1/4 width */}
        //         <div
        //             className="sidebar"
        //             style={{
        //                 width: '25%',
        //                 height: '100vh',
        //                 position: 'fixed',
        //                 top: 0,
        //                 left: 0,
        //                 overflowY: 'auto',
        //                 zIndex: 999,
        //             }}
        //         >
        //             <AdminNavItems />
        //         </div>

        //         {/* Main Content - 3/4 width */}
        //         <div
        //             className="main-content"
        //             style={{
        //                 width: '75%',
        //                 height: '100vh',
        //                 marginLeft: '25%',
        //                 overflow: 'hidden',
        //                 display: 'flex',
        //                 flexDirection: 'column',
        //                 backgroundColor: '#f8f9fa'
        //             }}
        //         >
        //             {/* Header Section with Gradient Background */}
        //             <div 
        //                 className="flex-shrink-0"
        //                 style={{
        //                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        //                     borderRadius: '0 0 20px 20px',
        //                     boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        //                     margin: '10px',
        //                     marginBottom: '20px'
        //                 }}
        //             >
        //                 <div className='p-4'>
        //                     <div className="mb-3">
        //                         <h4 className='text-white mb-1' style={{ fontWeight: '600', fontSize: '1.5rem' }}>
        //                             💰 Account Transactions
        //                         </h4>
        //                         <p className='text-white-50 mb-0' style={{ fontSize: '0.9rem' }}>
        //                             Manage payments, collections and transaction records
        //                         </p>
        //                     </div>

        //                     {/* Tabs */}
        //                     <div className="d-flex gap-3 flex-wrap">
        //                         {userRole && userRole.AllTransaction ? 
        //                             <span 
        //                                 className={`btn ${attendanceActive === "all-transaction" ? "btn-light" : "btn-outline-light"} px-4 py-2 rounded-pill`}
        //                                 style={{ cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease' }}
        //                                 onClick={() => { setActiveAttendance("all-transaction") }}
        //                             >
        //                                 All Transactions
        //                             </span> 
        //                         : null}

        //                         {userRole && userRole.PaymentPending ? 
        //                             <span 
        //                                 className={`btn ${attendanceActive === "payment-pending" ? "btn-light" : "btn-outline-light"} px-4 py-2 rounded-pill`}
        //                                 style={{ cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease' }}
        //                                 onClick={() => { setActiveAttendance("payment-pending") }}
        //                             >
        //                                 Payment Pending
        //                             </span> 
        //                         : null}

        //                         {userRole && userRole.CollectionTally ? 
        //                             <span 
        //                                 className={`btn ${attendanceActive === "collection-tally" ? "btn-light" : "btn-outline-light"} px-4 py-2 rounded-pill`}
        //                                 style={{ cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease' }}
        //                                 onClick={() => { setActiveAttendance("collection-tally") }}
        //                             >
        //                                 Collection Tally
        //                             </span> 
        //                         : null}
        //                     </div>
        //                 </div>
        //             </div>
                    
        //             {/* Content Section */}
        //                 <div className="flex-grow-1">
        //                     <TabContent activeTab={attendanceActive}>
        //                         {userRole && userRole.AllTransaction ?
        //                             <TabPane tabId="all-transaction" >
        //                                 <AllTransaction setActiveAttendance={setActiveAttendance} />
        //                             </TabPane>
        //                             : null}

        //                         {userRole && userRole.PaymentPending ?
        //                             <TabPane tabId="payment-pending" >
        //                                 <PaymentPending setActiveAttendance={setActiveAttendance} />
        //                             </TabPane> 
        //                             : null}

        //                         {userRole && userRole.CollectionTally ?
        //                             <TabPane tabId="collection-tally" >
        //                                 <CollectionTally setActiveAttendance={setActiveAttendance} />
        //                             </TabPane>
        //                             : null}
        //                     </TabContent>
        //                 </div>
        //         </div>
        //     </div>
        // </Fragment>
        <>
        <AllTransaction />
        </>
    )
}

export default AccountTransaction;