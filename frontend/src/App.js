import './App.css';
import { BrowserRouter, Route, Routes , Navigate} from 'react-router-dom';
import AdminSignIn from './AdminDashboards/Components/LoginSignup/AdminSignIn';
import AdminAttendance from './AdminDashboards/Components/Attendence';
import AdminExpenses from './AdminDashboards/Components/Expenses';
import AdminManageHr from './AdminDashboards/Components/ManageHr';
import AdminAddEmployeeForm from './AdminDashboards/Components/ManageHr/Forms/AdminAddEmployeeForm';
import AdminManageMaster from './AdminDashboards/Components/ManageMaster';
import AdminManageWebsite from './AdminDashboards/Components/ManagePage';
import AdminCustomerManage from './AdminDashboards/Components/Customer';
import AdminRolesAndPermission from './AdminDashboards/Components/RolesAndPermission';
import AdminPannel from './AdminDashboards/AdminPannel';
import AdminProfile from './AdminDashboards/Components/profile/AdminProfile';
import Availability from './AdminDashboards/Components/Availability';
import { ServiceProvider } from './Store/context/serviceProvider';
import AdminComplain from './AdminDashboards/Components/Complain';
import Reports from './AdminDashboards/Components/Reports';
import MonthService from './AdminDashboards/Components/MonthlyService';
import Network from './AdminDashboards/Components/Network';
import Tickets from './AdminDashboards/Components/Tickets';
import NetworkFlow from './AdminDashboards/Components/Network/components/NetworkFlow';
import AdminInventory from './AdminDashboards/Components/Inventory';

function App() {

  return (
    <ServiceProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path='/admin/*'  element={<AdminSignIn />}>
            <Route path='dashboard' element={<AdminPannel />} />
            <Route path='attendance' element={<AdminAttendance />} />
            <Route path='account-transactions' element={<AdminExpenses />} />
            <Route path='team-management' element={<AdminManageHr />} />
            <Route path='manage-hr/employee-form' element={<AdminAddEmployeeForm />} />
            <Route path='settings' element={<AdminManageMaster />} />
            <Route path='manage-website' element={<AdminManageWebsite />} />
            <Route path='customer' element={<AdminCustomerManage />} />
            <Route path='roles-&-permission' element={<AdminRolesAndPermission />} />
            <Route path='profile' element={<AdminProfile />} />
            <Route path='availability' element={<Availability />} />
            <Route path='support' element={<AdminComplain />} />
            <Route path='reports' element={<Reports />} />
            <Route path='network' element={<Network />} />
            <Route path='monthly-service' element={<MonthService />} />
            <Route path='task-management' element={<Tickets />} />
            <Route path='flow' element={<NetworkFlow />} />
            <Route path='inventory-management' element={<AdminInventory />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ServiceProvider>
  );
}

export default App;
