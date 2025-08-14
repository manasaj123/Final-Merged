import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/purchase-requisitions', label: 'Purchase Requisitions', icon: '📋' },
    { path: '/purchase-orders', label: 'Purchase Orders', icon: '🛒' },
    { path: '/vendors', label: 'Vendors', icon: '🏢' },
    { path: '/materials', label: 'Materials', icon: '📦' },
    { path: '/goods', label: 'Goods', icon: '📦' } 
  ];

  return (
    <nav className="sap-blue text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Purchase Management System</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <span className="text-blue-100 text-sm">SAP Easy Access</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
