import { combineReducers } from "redux";
import GetLogInReducers from "./LandingPage/AuthReducer";
import GetEmployeeRegReducer from "./Dashboard/EmployeeReducers/EmployeeRegReducer";
import GetAllEmployeeDataReducer from "./Dashboard/EmployeeReducers/GetAllEmployeeReducer";
import GetAllServiceProviderReducer from "./Dashboard/Authentication/AllServiceProviderReducer";
import GetAllCustomerReducer from "./CustomersReducers.js/GetAllCustomerReducers";
import GetAllMembersReducer from "./CustomersReducers.js/GetAllMembersReducer";
import GetCustomerUpdateReducer from "./CustomersReducers.js/GetCustomerUpdateReducer";
import FilterCustomersReducer from "./CustomersReducers.js/FilterCustomersReducer";

import {GetAllInventryReducers,GetAllAllotedItemReducers} from "./Dashboard/GetAllInventryReducers";
import AccountReducers from "./Dashboard/AccountReducers";
import AttendanceReducers from "./Dashboard/AttendanceReducers";
import { ServiceProviderAttendanceReducers, AttendanceReportReducers, ServiceProviderAttendanceReportReducers } from "./Dashboard/AttendanceReducers";
import GetAllPlanReducer from "./Dashboard/PlanGetReducers";
import GetAllTicketReducers from "./Dashboard/TicketReducers";
import GetAllTicketHeadReducers from "./Dashboard/TicketHeadReducers";
import GetAllServicesReducer from "./Dashboard/GetAllServicesReducer";

const rootReducer = combineReducers({
    GetEmployeeRegReducer: GetEmployeeRegReducer,
    GetAllEmployeeDataReducer: GetAllEmployeeDataReducer,
    GetAllServiceProviderReducer: GetAllServiceProviderReducer,
    GetAllCustomerReducer: GetAllCustomerReducer,
    GetCustomerUpdateReducer: GetCustomerUpdateReducer,
    FilterCustomersReducer: FilterCustomersReducer,
    GetLogInReducers: GetLogInReducers,
    GetAllInventryReducers:GetAllInventryReducers,
    GetAllAllotedItemReducers:GetAllAllotedItemReducers,
    AccountReducers:AccountReducers,
    AttendanceReducers: AttendanceReducers,
    ServiceProviderAttendanceReducers: ServiceProviderAttendanceReducers,
    AttendanceReportReducers: AttendanceReportReducers,
    ServiceProviderAttendanceReportReducers: ServiceProviderAttendanceReportReducers,
    GetAllPlanReducer: GetAllPlanReducer,
    GetAllTicketReducers: GetAllTicketReducers,
    GetAllTicketHeadReducers: GetAllTicketHeadReducers,
    GetAllServicesReducer: GetAllServicesReducer
})



export default rootReducer