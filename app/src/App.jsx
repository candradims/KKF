import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import layouts
import MainLayout from "./components/MainLayout";
import Layout from "./components/Layout";

// Import components
import Login from "./components/Login";
import LupaPassword from './components/LupaPassword';


// Import pages sales
import SalesDashboard from "./pages/sales/Dashboard";
import Pengeluaran from "./pages/sales/Pengeluaran";

// Import pages admin
import ManagementDataUser from "./pages/admin/DataUser/Index";
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Router basename="/">
      <Routes>
        {/* Routes with MainLayout (with sidebar and navbar) */}
        <Route element={<MainLayout />}>
          {/* Sales Routes */}
          <Route path="/sales/dashboard" element={<SalesDashboard />} />
          <Route path="/sales/pengeluaran-lain-lain" element={<Pengeluaran />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/management-data-user" element={<ManagementDataUser />} />
          {/* General Routes */}
          <Route path="/dashboard" element={<SalesDashboard />} />
        </Route>

        {/* Routes with basic Layout (no sidebar/navbar) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lupa-password" element={<LupaPassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
