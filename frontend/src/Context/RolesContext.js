import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config";
import axios from "axios";

const roles = {
    super: "super",
    admin: "admin",
    office: "office",
    service: "service",
    supervisor: "supervisor"
}


const RolesContext = createContext()

const RolesProvider = ({ children }) => {

    const [activeUser, setActiveUser] = useState(null)
    const [userMobile, setUserMobile] = useState(
        sessionStorage.getItem("userMobile")
    )
    const [userRole, setUserRole] = useState(
        JSON.parse(sessionStorage.getItem("roles"))
    )
    // every roles
    const [adminRoles, setAdminRoles] = useState(null)
    const [supervisorRoles, setSupervisorRoles] = useState(null)
    const [backOfficeRoles, setBackOfficeRoles] = useState(null)
    const [serviceProviderRoles, setServiceProviderRoles] = useState(null)


    // Role retrieval function
    const getRolesByType = async (roleType, mobileNo = null) => {
        try {
            let url = `${API_URL}/roles/get/${roleType}`;
            if (mobileNo && roleType !== 'super') {
                url += `?mobile=${mobileNo}`;
            }
            const response = await axios.get(url);
            if (response.status === 200) {
                return response.data.data;
            }
        } catch (error) {
            console.log(error);
        }
    };

    const UserRoleCalled = async (Role, mobileNo = null) => {
        const role = Role ? Role : sessionStorage.getItem("role");
        if (role) {
            const rolesData = await getRolesByType(role, mobileNo);
            if (rolesData) {
                sessionStorage.setItem("roles", JSON.stringify(rolesData));
                setUserRole(rolesData);
                // Store mobile number if provided for non-super roles
                if (mobileNo && role !== 'super') {
                    sessionStorage.setItem("userMobile", mobileNo);
                    setUserMobile(mobileNo);
                }
                // console.log(rolesData);
            }
        }
    };

    // Use the useEffect hook to call UserRoleCalled when the person logs in for the first time
    useEffect(() => {
        UserRoleCalled();
    }, []);

    // Use the useEffect hook to call other role retrieval functions on component mount
    useEffect(() => {
        getAdminRoles();
        getSupervisorRole();
        // GetBackofficeRoles();
        // GetServiceProvider();
    }, []);

    // Other role retrieval functions
    const getAdminRoles = async () => {
        const rolesData = await getRolesByType("admin");
        if (rolesData) {
            setAdminRoles(rolesData);
        }
    };

    const getSupervisorRole = async () => {
        const rolesData = await getRolesByType("supervisor");
        if (rolesData) {
            setSupervisorRoles(rolesData);
        }
    };

    const GetBackofficeRoles = async () => {
        const rolesData = await getRolesByType("office");
        if (rolesData) {
            setBackOfficeRoles(rolesData);
        }
    };

    const GetServiceProvider = async () => {
        const rolesData = await getRolesByType("service");
        if (rolesData) {
            setServiceProviderRoles(rolesData);
        }
    };

    // Function to get current user's mobile number
    const getUserMobile = () => {
        return sessionStorage.getItem("userMobile");
    };

    // Function to clear user mobile when logging out
    const clearUserMobile = () => {
        sessionStorage.removeItem("userMobile");
        setUserMobile(null);
    };

    return <RolesContext.Provider value={{
        UserRoleCalled,
        userRole,
        activeUser,
        userMobile,
        setUserRole,
        setUserMobile,
        supervisorRoles,
        backOfficeRoles,
        serviceProviderRoles,
        adminRoles,
        setActiveUser,
        getAdminRoles,
        getSupervisorRole,
        GetBackofficeRoles,
        GetServiceProvider,
        getUserMobile,
        clearUserMobile,
    }}>
        {children}
    </RolesContext.Provider>
}




const useUserRoleContext = () => {
    return useContext(RolesContext)
}


export { RolesProvider, useUserRoleContext }