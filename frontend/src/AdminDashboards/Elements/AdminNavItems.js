import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserRoleContext } from '../../Context/RolesContext'
import { CiGrid41, CiViewList } from 'react-icons/ci';
import { TbCalendarCheck } from "react-icons/tb";
import { GiPayMoney } from 'react-icons/gi';
import { TbReport } from 'react-icons/tb';
import { MdOutlinePeople, MdPeopleOutline } from 'react-icons/md';
import { CgWebsite } from 'react-icons/cg';
import { FaPeopleCarry } from 'react-icons/fa';
import { FaRegClock } from "react-icons/fa";
import { MdReportProblem } from "react-icons/md";
import { MdAirplaneTicket } from "react-icons/md";
import { FcSupport } from "react-icons/fc";
import { GoReport } from "react-icons/go";
import { useLocation } from 'react-router-dom';
import { IoIosGitNetwork } from "react-icons/io";

const AdminNavItems = () => {
    const { userRole } = useUserRoleContext();
  const navigate = useNavigate();
  const location = useLocation();

  const NavItems = [
    { field: "Dashboard", title: "Dashboard", icon: <CiViewList size={30} /> },
    // { field: "MonthlyService", title: "Monthly Service", icon: <TbCalendarCheck size={30} /> },
    { field: "Expenses", title: "Account", icon: <GiPayMoney size={30} /> },
    { field: "Attendence", title: "Attendance", icon: <TbReport size={30} /> },
    { field: "ManageHR", title: "Manage HR", icon: <MdPeopleOutline size={30} /> },
    { field: "ManageService", title: "Manage Master", icon: <CiGrid41 size={30} /> },
    { field: "ManagePage", title: "Manage Website", icon: <CgWebsite size={30} /> },
    { field: "Customer", title: "Customer", icon: <FaPeopleCarry size={30} /> },
    { field: "RolesAndPermission", title: "Roles & Permission", icon: <MdOutlinePeople size={30} /> },
    // { field: "Availability", title: "Availability", icon: <FaRegClock size={30} /> },
    { field: "Tickets", title: "Tickets", icon: <MdAirplaneTicket size={30} /> },
    // { field: "OrderReports", title: "Reports", icon: <GoReport size={30} /> },
    { field: "Network", title: "Network", icon: <IoIosGitNetwork size={30} /> },
  ];

  return (

<div className="d-flex flex-column bg-light sidebar p-3">
      {/* <h3 className="fw-bold mb-4"> Laxdeep System & Service</h3> */}
      <div className="d-flex flex-column gap-3">
      {NavItems.filter(x => (userRole ? userRole[x.field] : false)).map((item, index) => {
        const isActive = location.pathname === `/admin/${item.title.toLocaleLowerCase().split(" ").join("-")}`;
        return (
          <div
            key={index}
            onClick={() => navigate(item.title !== "" ? `/admin/${item.title.toLocaleLowerCase().split(" ").join("-")}` : "/admin")}
            className={`${isActive ? "activeNavItem" : ""} d-flex align-items-center cursor-pointer bg-white text-blue hoverShadow hoverPrimary gap-2 p-2 border rounded-3 hoverNavItem cursor-pointer`} 
            style={{
              cursor: "pointer", // Inline style to override conflicts
              transition: "background-color 0.3s",
            }}
          >
            {item.icon}
            <h6 className="m-0">{item.title}</h6>
          </div>
        );
      })}
    </div>
    </div>
  );
}
export default AdminNavItems