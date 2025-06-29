import './App.css';
import { BrowserRouter, Route, Routes , Navigate} from 'react-router-dom';
import AdminSignIn from './AdminDashboards/Components/LoginSignup/AdminSignIn';
import AdminAttendance from './AdminDashboards/Components/Attendence';
import AdminManageHr from './AdminDashboards/Components/ManageHr';
import AdminManageMaster from './AdminDashboards/Components/ManageMaster';
import AdminManageWebsite from './AdminDashboards/Components/ManagePage';
import AdminCustomerManage from './AdminDashboards/Components/Customer';
import AdminPannel from './AdminDashboards/AdminPannel';
import AdminProfile from './AdminDashboards/Components/profile/AdminProfile';
import { ServiceProvider } from './Store/context/serviceProvider';
import Network from './AdminDashboards/Components/Network';
import Tickets from './AdminDashboards/Components/Tickets';
import NetworkFlow from './AdminDashboards/Components/Network/components/NetworkFlow';
import AdminInventory from './AdminDashboards/Components/Inventory';
import AccountTransaction from './AdminDashboards/Components/AccountTransaction';
import AllTransaction from './AdminDashboards/Components/AccountTransaction/AllTransaction';
import CollectionTally from './AdminDashboards/Components/AccountTransaction/CollectionTally';
import PaymentPending from './AdminDashboards/Components/AccountTransaction/PaymentPending';
import ManageCustomer from './AdminDashboards/Components/Customer/ManageCustomer';
import ManageFlow from './AdminDashboards/Components/Network/ManageFlow';

function App() {

  return (
    <ServiceProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path='/admin/*'  element={<AdminSignIn />}>
            <Route path='dashboard' element={<AdminPannel />} />
            <Route path='attendance' element={<AdminAttendance />} />
            <Route path='account-transactions' element={<AccountTransaction />} />
            <Route path='team-management' element={<AdminManageHr />} />
            <Route path='settings' element={<AdminManageMaster />} />
            <Route path='manage-website' element={<AdminManageWebsite />} />
            <Route path='customer' element={<ManageCustomer />} />
            <Route path='profile' element={<AdminProfile />} />
            <Route path='network' element={<Network />} />
            <Route path='task-management' element={<Tickets />} />
            <Route path='flow' element={<ManageFlow />} />
            <Route path='inventory-management' element={<AdminInventory />} />
            <Route path='all-transaction' element={<AllTransaction />} />
            <Route path='collection-tally' element={<CollectionTally />} />
            <Route path='payment-pending' element={<PaymentPending />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ServiceProvider>
  );
}

export default App;
