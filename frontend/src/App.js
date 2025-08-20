import './App.css';
import { BrowserRouter, Route, Routes , Navigate} from 'react-router-dom';
import AdminSignIn from './AdminDashboards/Components/LoginSignup/AdminSignIn';
import AdminPannel from './AdminDashboards/AdminPannel';
import AdminProfile from './AdminDashboards/Components/profile/AdminProfile';
import { ServiceProvider } from './Store/context/serviceProvider';
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
import AllTickets from './AdminDashboards/Components/Tickets/AllTickets';
import AssignTickets from './AdminDashboards/Components/Tickets/AssignTickets';
import TicketsHead from './AdminDashboards/Components/Settings/TicketHead';
import ManagePlans from './AdminDashboards/Components/Settings/ManagePlans';
import LandingPage from './LandingPage/LandingPage';
import NetworkFlow from './AdminDashboards/Components/Network/components/NetworkFlow';
import Reminder from './AdminDashboards/Components/Reminder/Reminder';
import LeadsManagement from './AdminDashboards/Components/LeadsManagement/LeadsManagement';
import ServicesManagement from './AdminDashboards/Components/ServicesManagement/ServicesManagement';
import AdvertisementManagement from './AdminDashboards/Components/AdvertisementManagement/AdvertisementManagement';
import ReportsAnalysis from './AdminDashboards/Components/ReportsAnalysis/ReportsAnalysis';
import GSTBillsManagement from './AdminDashboards/Components/GSTBillsManagement/GSTBillsManagement';
import ExpensesManagement from './AdminDashboards/Components/ExpensesManagement/ExpensesManagement';

function App() {

  return (
    <ServiceProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />}/>
          <Route path='/admin/*'  element={<AdminSignIn />}>
            <Route path='dashboard' element={<AdminPannel />} />
            <Route path='reminder' element={<Reminder />} />
            <Route path='account-transactions' element={<AccountTransaction />}/>
            <Route path='collection-tally' element={<CollectionTally />} />
            <Route path='payment-pending' element={<PaymentPending />} />
            <Route path='customer' element={<ManageCustomer />} />
            <Route path='manage-employees' element={<ManageEmployee />} />
            <Route path='local-staff-management' element={<ManageServiceProvider />} />
            <Route path='manage-salary' element={<ManageSalary />} />
            <Route path='leads-management' element={<LeadsManagement />} />
            <Route path='all-tickets' element={<AllTickets />} />
            <Route path='assign-tickets' element={<AssignTickets />} />
            <Route path='manage-flow' element={<ManageFlow />} />
            <Route path='stock-management' element={<StockManagement />} />
            <Route path='warehouse-management' element={<WarehouseManagement />} />
            <Route path='services-management' element={<ServicesManagement />} />
            <Route path='advertisement-management' element={<AdvertisementManagement />} />
            <Route path='reports-analysis' element={<ReportsAnalysis />} />
            <Route path='gst-bills-management' element={<GSTBillsManagement />} />
            <Route path='expenses-management' element={<ExpensesManagement />} />
            <Route path='manage-plans' element={<ManagePlans />} />
            <Route path='manage-tickets-head' element={<TicketsHead />} />
            <Route path='profile' element={<AdminProfile />} />
            <Route path='flow' element={<NetworkFlow />} />
            <Route path='all-transaction' element={<AllTransaction />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ServiceProvider>
  );
}

export default App;
