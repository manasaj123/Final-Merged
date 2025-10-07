import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Outlet, useLocation, Link } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import MaterialDashboard from "./components/MaterialCreation/MaterialDashboard";
import MaterialList from "./components/MaterialCreation/MaterialList";
import MaterialForm from "./components/MaterialCreation/MaterialForm";
import VendorDashboard from "./components/VendorDashboard";
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
  FileText,
  ShoppingCart,
  Users,
  Home,
  ClipboardList,
  Truck,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Menu,
  Database,
} from "lucide-react";

/* -------------------- SIDEBAR -------------------- */
const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/materials", label: "Material Management", icon: Package },
    { path: "/vendors", label: "Vendor Management", icon: Users },
    { path: "/purchase-requisitions", label: "Purchase Requisitions", icon: ClipboardList },
    { path: "/purchase-orders", label: "Purchase Orders", icon: ShoppingCart },
    { path: "/goods", label: "Goods Receipt", icon: Truck },
    { path: "/goods-issue", label: "Goods Issue", icon: AlertCircle },
    { path: "/invoice", label: "Invoice Verification", icon: CheckCircle },
    { path: "/billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-[#0d1b2a] text-white h-screen fixed left-0 top-0 p-4 transition-all duration-300 overflow-y-auto`}
    >
      {/* Header with logo + toggle */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <Database className="w-8 h-8 text-blue-400" />
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">Db4MM</h1>
              <p className="text-xs text-gray-400">Material Management</p>
            </div>
          )}
        </Link>

        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-blue-900 ${
                active ? "bg-blue-700" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

/* -------------------- HEADER -------------------- */
const TopHeader = ({ collapsed }) => {
  const location = useLocation();

  // Map path to title
  const pageTitles = {
    "/": "Dashboard",
    "/materials": "Material Management",
    "/vendors": "Vendor Management",
    "/purchase-requisitions": "Purchase Requisitions",
    "/purchase-orders": "Purchase Orders",
    "/goods": "Goods Receipt",
    "/goods-issue": "Goods Issue",
    "/invoice": "Invoice Verification",
    "/billing": "Billing",
  };

  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div
      className={`fixed ${collapsed ? "left-20" : "left-64"} right-0 top-0 bg-white border-b p-4 flex items-center justify-between z-10 transition-all duration-300`}
    >
      {/* Left side page title */}
      <h2 className="text-lg font-semibold">{title}</h2>

      {/* Right side search + settings */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Search..."
          className="border px-3 py-1 rounded-lg w-64"
        />
        <button className="relative">
          ⚙
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

/* -------------------- DASHBOARD PAGE -------------------- */
const DashboardPage = () => {
  const cards = [
    { title: "Total Materials", value: "2,847", change: "+12%", icon: Package, color: "blue" },
    { title: "Active Vendors", value: "156", change: "+3%", icon: Users, color: "green" },
    { title: "Pending Orders", value: "23", change: "-8%", icon: FileText, color: "red" },
    { title: "Monthly Revenue", value: "$2.4M", change: "+15%", icon: CreditCard, color: "green" },
  ];

  const activities = [
    "Purchase Order PO-2024-001 approved",
    "New vendor registration: ABC Suppliers",
    "Material shortage alert: Steel Rods",
    "Goods receipt completed: GR-2024-045",
    "Invoice verification pending: IV-2024-078",
  ];

  const tasks = [
    { task: "Approve Purchase Requisition PR-2024-089", priority: "high" },
    { task: "Review vendor performance report", priority: "medium" },
    { task: "Update material master data", priority: "low" },
    { task: "Process goods issue GI-2024-056", priority: "high" },
  ];

  return (
    <div className="ml-0 mt-0 p-6 min-h-screen bg-gray-100">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl shadow flex items-center gap-4 w-full h-36">
              <div className={`p-4 rounded-full bg-${card.color}-100`}>
                <Icon className={`w-8 h-8 text-${card.color}-600`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
                <p
                  className={`text-sm ${
                    card.change.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {card.change} vs last month
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activities & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Activities</h3>
            <button className="text-blue-500 text-sm">View All</button>
          </div>
          <ul className="space-y-4 flex-1 overflow-y-auto">
            {activities.map((activity, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-500 mt-2"></span>
                <div>
                  <p className="text-sm">{activity}</p>
                  <p className="text-xs text-gray-400">{[2, 15, 30, 60, 120][i]} minutes ago</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Pending Tasks</h3>
            <button className="text-blue-500 text-sm">View All</button>
          </div>
          <ul className="space-y-4 flex-1 overflow-y-auto">
            {tasks.map((t, i) => (
              <li key={i} className="flex items-center justify-between">
                <p className="text-sm">{t.task}</p>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    t.priority === "high"
                      ? "bg-red-100 text-red-600"
                      : t.priority === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {t.priority}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/* -------------------- MAIN APP LAYOUT -------------------- */
const MainApp = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <TopHeader collapsed={collapsed} />
      <main
        className={`bg-gray-100 min-h-screen transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        } mt-16 p-6`}
      >
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

/* -------------------- APP ROOT -------------------- */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />}>
          <Route index element={<DashboardPage />} />
          <Route path="materials" element={<MaterialList />} />
          <Route path="materials/create" element={<MaterialForm />} />
          <Route path="vendors" element={<VendorDashboard />} />
          <Route path="purchase-dashboard" element={<Dashboard />} />
          <Route path="purchase-requisitions" element={<PurchaseRequisitions />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="goods" element={<AppGoods />} />
          <Route path="Navbar" element={<Navbar />} />
          <Route path="purchase-vendors" element={<Vendors />} />
          <Route path="purchase-materials" element={<Materials />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="invoice" element={<InvoicePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
