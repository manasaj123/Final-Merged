import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useLocation} from "react-router-dom";
import { Toaster } from './components/ui/toaster';
import MaterialDashboard from './components/MaterialCreation/MaterialDashboard';
import MaterialList from './components/MaterialCreation/MaterialList';
import MaterialForm from './components/MaterialCreation/MaterialForm';
import VendorDashboard from './components/VendorDashboard';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import AppGoods from "./components/PurchaseGoods/AppGoods";
import Dashboard from "./components/PurchaseGoods/Dashboard";
import Materials from "./components/PurchaseGoods/Materials";
import Navbar from "./components/PurchaseGoods/Navbar";
import PurchaseOrders from "./components/PurchaseGoods/PurchaseOrders";
import PurchaseRequisitions from "./components/PurchaseGoods/PurchaseRequisitions";
import Vendors from "./components/PurchaseGoods/Vendors";
import BillingPage from "./components/Billing/BillingPage";
import InvoicePage from "./components/Billing/InvoicePage";

import {
  Package,
  Plus,
  List,
  BarChart3,
  Settings,
  Home,
  ShoppingCart,
  FileText,
  Users
} from 'lucide-react';

/* -------------------- MAIN NAVIGATION -------------------- */
const Navigation = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'list', label: 'Materials', icon: List },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'vendor', label: 'Vendors', icon: Package },
    { id: 'purchaseDashboard', label: 'Purchase Dashboard', icon: BarChart3 },
    { id: 'goods', label: 'goods', icon: ShoppingCart },
    { id: 'billing', label: 'Billing', icon: FileText },   // ✅ Added
    { id: 'invoice', label: 'Invoice', icon: FileText }    // ✅ Added
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">MaterialPro</h1>
            </div>
            <div className="flex items-center space-x-1">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    onClick={() => onViewChange(item.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- PURCHASE GOODS HEADER -------------------- */
const PurchaseGoodsHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Purchase Dashboard", icon: BarChart3, path: "/purchase-dashboard" },
    { label: "goods", icon: Home, path: "/goods" },
    { label: "Purchase Requisitions", icon: FileText, path: "/purchase-requisitions" },
    { label: "Purchase Orders", icon: ShoppingCart, path: "/purchase-orders" },
    { label: "Materials", icon: Package, path: "/purchase-materials" },
    { label: "Vendors", icon: Users, path: "/purchase-vendors" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 ${isActive ? "bg-primary text-white" : ""}`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------- WELCOME SCREEN -------------------- */
const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="max-w-2xl w-full shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Package className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome to MaterialPro
            </CardTitle>
            <p className="text-muted-foreground text-lg mt-2">
              Complete Manufacturing Material Creation & Management System
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Raw Materials</h3>
                <p className="text-sm text-muted-foreground">Manage raw material inventory</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <Settings className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <h3 className="font-semibold">Semi-Finished</h3>
                <p className="text-sm text-muted-foreground">Track production stages</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Finished Products</h3>
                <p className="text-sm text-muted-foreground">Complete product management</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Key Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {[
                  ["blue", "Multi-level material hierarchy"],
                  ["green", "Plant & warehouse management"],
                  ["purple", "MRP integration"],
                  ["orange", "Batch & serial tracking"],
                  ["red", "Real-time analytics"],
                  ["teal", "Industry-specific configurations"],
                ].map(([color, text], idx) => (
                  <div className="flex items-center space-x-2" key={idx}>
                    <div className={`w-2 h-2 bg-${color}-500 rounded-full`}></div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Home className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/* -------------------- MAIN APP LAYOUT -------------------- */
const MainApp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let currentView = 'dashboard';
  if (location.pathname === '/' || location.pathname === '') {
    currentView = 'dashboard';
  } else if (location.pathname.startsWith('/materials/create')) {
    currentView = 'create';
  } else if (location.pathname.startsWith('/materials')) {
    currentView = 'list';
  } else if (location.pathname.startsWith('/vendors')) {
    currentView = 'vendor';
  } else if (location.pathname.startsWith('/purchase-dashboard')) {
    currentView = 'purchaseDashboard';
  } else if (location.pathname.startsWith('/goods')) {
    currentView = 'goods';
  } else if (location.pathname.startsWith('/billing')) {
    currentView = 'billing';
  } else if (location.pathname.startsWith('/invoice')) {
    currentView = 'invoice';
  }

  const onViewChange = (view) => {
    switch (view) {
      case 'dashboard':
        navigate('/');
        break;
      case 'list':
        navigate('/materials');
        break;
      case 'create':
        navigate('/materials/create');
        break;
      case 'vendor':
        navigate('/vendors');
        break;
      case 'purchaseDashboard':
        navigate('/purchase-dashboard');
        break;
      case 'goods':
        navigate('/goods');
        break;
      case 'billing':
        navigate('/billing');
        break;
      case 'invoice':
        navigate('/invoice');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={onViewChange} />
      {location.pathname.startsWith('/goods') ? (
        <PurchaseGoodsHeader />
      ) : null}
      <main className="py-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

/* -------------------- APP ROOT -------------------- */
function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />;
  }

  return (
    <BrowserRouter>
    
      <Routes>
        
        <Route path="/" element={<MainApp />}>
          <Route index element={<MaterialDashboard />} />
          <Route path="materials" element={<MaterialList />} />
          <Route path="materials/create" element={<MaterialForm />} />
          <Route path="vendors" element={<VendorDashboard />} />

          {/* Purchase section */}
          <Route path="purchase-dashboard" element={<Dashboard />} />
          <Route path="purchase-requisitions" element={<PurchaseRequisitions />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="goods" element={<AppGoods />} />
          <Route path="Navbar" element={<Navbar />} />
          <Route path="purchase-vendors" element={<Vendors />} />
          <Route path="purchase-materials" element={<Materials />} />

          {/* Billing section */}
          <Route path="billing" element={<BillingPage />} />
          <Route path="invoice" element={<InvoicePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
