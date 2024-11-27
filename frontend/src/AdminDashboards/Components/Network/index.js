import Flow from "./newflow"
import {Fragment} from "react";
import AdminHeader from "../AdminHeader";
import AnimatedBackground from "../../Elements/AnimatedBacground";
import AdminNavItems from "../../Elements/AdminNavItems";

const Network = () => {
	return (
		<>
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

        {/* Main Content */}
        <div
          className="main-content flex-grow-1 position-relative"
          style={{
            width: "calc(100% - 300px)",
            overflowY: "auto",
          }}
        >
          <AnimatedBackground />
          <div className="BackgroundTopContents">
						<div className="AttendenceTabs">
							<Flow/>
						</div>
						</div>
				</div>
			</div>
			</Fragment>
		</>
	)
}

export default Network;
