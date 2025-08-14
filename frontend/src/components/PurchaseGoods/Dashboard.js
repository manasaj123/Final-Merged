import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/dashboard`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-3xl font-bold text-gray-700">{value}</p>
        </div>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      draft: 'status-draft',
      submitted: 'status-submitted',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Management Dashboard</h1>
        <p className="text-gray-600">Overview of your purchasing activities</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Purchase Requisitions"
          value={dashboardData?.statistics?.purchase_requisitions || 0}
          icon="📋"
          color="border-blue-500"
        />
        <StatCard
          title="Purchase Orders"
          value={dashboardData?.statistics?.purchase_orders || 0}
          icon="🛒"
          color="border-green-500"
        />
        <StatCard
          title="Vendors"
          value={dashboardData?.statistics?.vendors || 0}
          icon="🏢"
          color="border-purple-500"
        />
        <StatCard
          title="Materials"
          value={dashboardData?.statistics?.materials || 0}
          icon="📦"
          color="border-orange-500"
        />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchase Requisitions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Purchase Requisitions</h2>
          </div>
          <div className="p-6">
            {dashboardData?.recent_purchase_requisitions?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recent_purchase_requisitions.map((pr) => (
                  <div key={pr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">PR #{pr.pr_number}</p>
                      <p className="text-sm text-gray-600">{pr.purchasing_organization} - {pr.plant}</p>
                      <p className="text-xs text-gray-500">{formatDate(pr.created_at)}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(pr.status)}
                      <p className="text-sm text-gray-600 mt-1">{pr.items?.length || 0} items</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No purchase requisitions yet</p>
            )}
          </div>
        </div>

        {/* Recent Purchase Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Purchase Orders</h2>
          </div>
          <div className="p-6">
            {dashboardData?.recent_purchase_orders?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recent_purchase_orders.map((po) => (
                  <div key={po.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">PO #{po.po_number}</p>
                      <p className="text-sm text-gray-600">{po.vendor_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(po.created_at)}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(po.status)}
                      <p className="text-sm text-gray-600 mt-1">{po.items?.length || 0} items</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No purchase orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;