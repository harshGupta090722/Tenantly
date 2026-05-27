import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Home,
  Users,
  PieChart,
  CheckSquare,
  CreditCard,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
  Building
} from 'lucide-react';

const SidebarLayout: React.FC = () => {
  const { role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const landlordLinks = [
    { name: 'Dashboard', path: '/landlord/dashboard', icon: LayoutDashboard },
    { name: 'Flats & Inventory', path: '/landlord/flats', icon: Home },
    { name: 'Tenant Directory', path: '/landlord/tenants', icon: Users },
    { name: 'Finances & Ledger', path: '/landlord/finances', icon: PieChart },
    { name: 'Approvals Queue', path: '/landlord/approvals', icon: CheckSquare },
  ];

  const tenantLinks = [
    { name: 'Dashboard', path: '/tenant/dashboard', icon: LayoutDashboard },
    { name: 'Payments', path: '/tenant/payments', icon: CreditCard },
    { name: 'Document Vault', path: '/tenant/documents', icon: FolderOpen },
    { name: 'Settings', path: '/tenant/settings', icon: Settings },
    { name: 'Support', path: '/tenant/support', icon: HelpCircle },
  ];

  const links = role === 'landlord' ? landlordLinks : tenantLinks;

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#1e293b] text-white flex flex-col shadow-xl">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Building className="w-6 h-6 mr-3 text-[#3b82f6]" />
          <span className="text-lg font-bold tracking-wide">Tenantly</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {links.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${isActive
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 hover:text-white transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Area could go here */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-slate-800">
            {links.find(l => location.pathname.startsWith(l.path))?.name || 'Dashboard'}
          </h1>

          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
              {role === 'landlord' ? 'L' : 'T'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;
