import './App.css';
import { BrowserRouter, Route, Routes , Navigate} from 'react-router-dom';
import AdminSignIn from './AdminDashboards/Components/LoginSignup/AdminSignIn';
import AdminAttendance from './AdminDashboards/Components/Attendence';
import AdminManageHr from './AdminDashboards/Components/ManageHr';
import AdminPannel from './AdminDashboards/AdminPannel';
import AdminProfile from './AdminDashboards/Components/profile/AdminProfile';
import { ServiceProvider } from './Store/context/serviceProvider';
import Network from './AdminDashboards/Components/Network';
import AccountTransaction from './AdminDashboards/Components/AccountTransaction';
import AllTransaction from './AdminDashboards/Components/AccountTransaction/AllTransaction';
import CollectionTally from './AdminDashboards/Components/AccountTransaction/CollectionTally';
import PaymentPending from './AdminDashboards/Components/AccountTransaction/PaymentPending';
import ManageCustomer from './AdminDashboards/Components/Customer/ManageCustomer';
import ManageFlow from './AdminDashboards/Components/Network/ManageFlow';
import ManageEmployee from './AdminDashboards/Components/ManageHr/ManageEmployee';
import ManageServiceProvider from './AdminDashboards/Components/ManageHr/ManageServiceProvider';
import ManageSalary from './AdminDashboards/Components/ManageHr/ManageSalary';
import StockManagement from './AdminDashboards/Components/Inventory/stockManagement';
import WarehouseManagement from './AdminDashboards/Components/Inventory/warehouseManagement';
import ManageService from './AdminDashboards/Components/Settings/ManageService';
import AllTickets from './AdminDashboards/Components/Tickets/AllTickets';
import AssignTickets from './AdminDashboards/Components/Tickets/AssignTickets';
import TicketsHead from './AdminDashboards/Components/Settings/TicketHead';
import ManagePlans from './AdminDashboards/Components/Settings/ManagePlans';
import LandingPage from './LandingPage/LandingPage';
import NetworkFlow from './AdminDashboards/Components/Network/components/NetworkFlow';


function App() {

  return (
    <ServiceProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />}/>
          <Route path='/admin/*'  element={<AdminSignIn />}>
            <Route path='dashboard' element={<AdminPannel />} />
            <Route path='attendance' element={<AdminAttendance />} />
            <Route path='account-transactions' element={<AccountTransaction />} />
            <Route path='team-management' element={<AdminManageHr />} />
            <Route path='customer' element={<ManageCustomer />} />
            <Route path='profile' element={<AdminProfile />} />
            <Route path='network' element={<Network />} />
            <Route path='flow' element={<NetworkFlow />} />
            <Route path='manage-flow' element={<ManageFlow />} />
            <Route path='all-transaction' element={<AllTransaction />} />
            <Route path='collection-tally' element={<CollectionTally />} />
            <Route path='payment-pending' element={<PaymentPending />} />
            <Route path='manage-employees' element={<ManageEmployee />} />
            <Route path='local-staff-management' element={<ManageServiceProvider />} />
            <Route path='manage-salary' element={<ManageSalary />} />
            <Route path='stock-management' element={<StockManagement />} />
            <Route path='warehouse-management' element={<WarehouseManagement />} />
            
            <Route path='manage-services' element={<ManageService />} />
            <Route path='all-tickets' element={<AllTickets />} />
            <Route path='assign-tickets' element={<AssignTickets />} />
            <Route path='manage-tickets-head' element={<TicketsHead />} />
            <Route path='manage-plans' element={<ManagePlans />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </ServiceProvider>
  );
}

export default App;
