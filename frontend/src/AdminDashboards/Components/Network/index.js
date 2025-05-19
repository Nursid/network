import Flow from "./newflow"
import {Fragment} from "react";
import AdminHeader from "../AdminHeader";
import AnimatedBackground from "../../Elements/AnimatedBacground";
import AdminNavItems from "../../Elements/AdminNavItems";
import ManageFlow from "./ManageFlow";

const Network = () => {
	return (
		<>
			<Fragment>
      <AdminHeader />
      <div className="d-flex" style={{ height: "calc(100vh - 60px)", overflow: "hidden" }}>
        <div
          className="sidebar bg-light"
          style={{ overflow: "hidden" }}
        >
          <AdminNavItems />
        </div>

        {/* Main Content */}
        <div
          className="main-content flex-grow-1 position-relative"
          style={{
            width: "calc(100% - 300px)",
            overflow: "hidden",
          }}
        >
          <AnimatedBackground />
          <div className="BackgroundTopContents" style={{ height: "100%" }}>
							<ManageFlow/>
						</div>
				</div>
			</div>
			</Fragment>
		</>
	)
}

export default Network;
