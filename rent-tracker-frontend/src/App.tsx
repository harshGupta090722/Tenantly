import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SidebarLayout from './layouts/SidebarLayout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import LandlordDashboard from './pages/landlord/Dashboard';
import TenantDirectory from './pages/landlord/TenantDirectory';
import Flats from './pages/landlord/Flats';
import Approvals from './pages/landlord/Approvals';
import TenantDashboard from './pages/tenant/Dashboard';
import TenantPayments from './pages/tenant/Payments';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Landlord Routes (Protected) */}
          <Route 
            path="/landlord" 
            element={
              <ProtectedRoute allowedRole="landlord">
                <SidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<LandlordDashboard />} />
            <Route path="flats" element={<Flats />} />
            <Route path="tenants" element={<TenantDirectory />} />
            <Route path="finances" element={<div className="p-4 bg-white rounded-lg shadow">Finances & Ledger (Phase 2)</div>} />
            <Route path="approvals" element={<Approvals />} />
          </Route>

          {/* Tenant Routes (Protected) */}
          <Route 
            path="/tenant" 
            element={
              <ProtectedRoute allowedRole="tenant">
                <SidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<TenantDashboard />} />
            <Route path="payments" element={<TenantPayments />} />
            <Route path="documents" element={<div className="p-4 bg-white rounded-lg shadow">Document Vault (Phase 3)</div>} />
            <Route path="settings" element={<div className="p-4 bg-white rounded-lg shadow">Account Settings (Phase 3)</div>} />
            <Route path="support" element={<div className="p-4 bg-white rounded-lg shadow">Support Center (Phase 3)</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;