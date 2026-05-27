import React, { useEffect, useState } from 'react';
import { DollarSign, Shield, Activity, TrendingUp } from 'lucide-react';
import api from '../../api';

interface FinanceData {
  totalRent: number;
  totalSecurityDeposit: number;
}

const LandlordDashboard: React.FC = () => {
  const [finances, setFinances] = useState<FinanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/landlord/finances');
        // Backend returns: { totalRent: ..., totalSecurityDeposit: ... }
        setFinances(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="text-slate-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const statCards = [
    {
      title: 'Total Monthly Rent',
      value: `₹${finances?.totalRent?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Total Security Deposits',
      value: `₹${finances?.totalSecurityDeposit?.toLocaleString() || 0}`,
      icon: Shield,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Revenue Growth',
      value: '+12%',
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-600',
      subtitle: 'Vs Last Month'
    },
    {
      title: 'Active Leases',
      value: 'View Details',
      icon: Activity,
      color: 'bg-orange-100 text-orange-600',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your properties today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-slate-400 mt-1">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder for Quick Actions or Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-64 flex flex-col justify-center items-center text-slate-400">
          <p>Recent Payments Chart (Coming Soon)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-64 flex flex-col justify-center items-center text-slate-400">
          <p>Recent Activity Log (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
