import Flow from "./newflow"
import {Fragment} from "react";
import AdminHeader from "../AdminHeader";
import AnimatedBackground from "../../Elements/AnimatedBacground";
import AdminNavItems from "../../Elements/AdminNavItems";

const Network = () => {
	return (
		<>
			<Fragment>
				<AdminHeader/>
				<div className='position-relative'>
					<AnimatedBackground/>
					<div className='BackgroundTopContents'>
						<AdminNavItems/>
						<div className="AttendenceTabs px-3">
							<Flow/>
						</div>
					</div>
				</div>
			</Fragment>
		</>
	)
}

export default Network;
