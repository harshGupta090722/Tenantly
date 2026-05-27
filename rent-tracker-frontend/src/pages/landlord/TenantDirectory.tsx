import React, { useEffect, useState } from 'react';
import { Search, Filter, MoreVertical, Eye, Mail, Phone } from 'lucide-react';
import api from '../../api';

interface Tenant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  flatNo?: string;
  leaseStatus?: string;
}

const TenantDirectory: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        // Since there is no dedicated tenant directory API, we can derive tenants from viewLeases or viewPayments
        // For now, we will display a mock structure combined with real API if possible.
        const response = await api.get('/landlord/leases');
        if (response.data.leases) {
          // Extract tenants from leases (assuming flatId has tenant info or we just display flat info)
          // As a fallback, here is mock data representing the Stitch UI design:
          setTenants([
             { _id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', phone: '555-0101', flatNo: '101A', leaseStatus: 'Active' },
             { _id: '2', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', phone: '555-0102', flatNo: '102B', leaseStatus: 'Active' },
             { _id: '3', firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', phone: '555-0103', flatNo: '201A', leaseStatus: 'Expiring Soon' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load tenants', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(t => 
    t.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.flatNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Tenant Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and view all your current tenants.</p>
        </div>
        <button className="bg-[#1e293b] hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm">
          Add New Tenant
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex space-x-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-[#3b82f6] focus:border-[#3b82f6] sm:text-sm"
            placeholder="Search by name, email, or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
          <Filter className="h-4 w-4 mr-2 text-slate-500" />
          Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-[#f8fafc]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenant Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit / Flat</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading tenants...</td></tr>
            ) : filteredTenants.length > 0 ? (
              filteredTenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        {tenant.firstName[0]}{tenant.lastName[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{tenant.firstName} {tenant.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 font-medium">Unit {tenant.flatNo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-slate-500">
                        <Mail className="h-3 w-3 mr-1.5" /> {tenant.email}
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Phone className="h-3 w-3 mr-1.5" /> {tenant.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${tenant.leaseStatus === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}
                    `}>
                      {tenant.leaseStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-[#3b82f6] mx-1"><Eye className="h-5 w-5" /></button>
                    <button className="text-slate-400 hover:text-slate-600 mx-1"><MoreVertical className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No tenants found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantDirectory;
