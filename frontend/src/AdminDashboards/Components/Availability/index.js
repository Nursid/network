import React, { Fragment, useEffect, useState } from 'react';
import AdminHeader from '../AdminHeader';
import { TabContent, TabPane } from 'reactstrap';
import Availability from './Availability'; // Ensure this component exists
import AdminNavItems from '../../Elements/AdminNavItems';
import AnimatedBackground from '../../Elements/AnimatedBacground';
import { useUserRoleContext } from '../../../Context/RolesContext';
import { WaitLoader } from '../../Elements/WaitLoader';
import SupervisorAvailability from './supervisorAvailability';

const AvailabilityIndex = () => {
    const [activeTab, setActiveTab] = useState("serviceProvider");
    const { userRole, UserRoleCalled } = useUserRoleContext();

    useEffect(() => {
        UserRoleCalled();
    }, []);

    // Function to set the active tab based on user roles
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

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
                            {/* set role wise display  */}


                            {userRole && userRole.AttendenceServiceProvider ? <span className={` ${activeTab === "serviceProvider" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveTab("serviceProvider") }}>Service-Provider Availability</span> : null}

                            {userRole && userRole.Availability ? <span className={` ${activeTab === "supervisor" ? "AttendenceTabs_Active" : ""}`} onClick={() => { setActiveTab("supervisor") }}>Supervisor Availability</span> : null}

                        </div>

                        <TabContent activeTab={activeTab}>
                                    <TabPane tabId="supervisor">
                                     <SupervisorAvailability />
                                    </TabPane>
                                    <TabPane tabId="serviceProvider">
                                        <Availability />
                                    </TabPane>
                        </TabContent>
                    </div>
                    </div>
                </div>
            </Fragment>
    );
}

export default AvailabilityIndex;
