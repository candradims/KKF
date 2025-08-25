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
import LaporanLaba from "./pages/sales/LaporanLaba";
import Penawaran from "./pages/sales/Penawaran";

// Import pages admin
import DataUser from "./pages/admin/DataUser/Index";
import DataLayanan from "./pages/admin/DataLayanan/Index";
import AdminDashboard from "./pages/admin/Dashboard";
import LabaLaporan from "./pages/admin/LaporanLaba/Index";
import DataPenawaranAdmin from "./pages/admin/DataPenawaran/Index";

// Import pages Super admin
import SuperAdminDashboard from "./pages/superAdmin/Dashboard";
import DataPenawaranSuperAdmin from "./pages/superAdmin/DataPenawaran/Index";

function App() {
  return (
    <Router basename="/">
      <Routes>
        {/* Routes with MainLayout (with sidebar and navbar) */}
        <Route element={<MainLayout />}>
          {/* Sales Routes */}
          <Route path="/sales/dashboard" element={<SalesDashboard />} />
          <Route path="/sales/data-penawaran" element={<Penawaran />} />
          <Route path="/sales/pengeluaran-lain-lain" element={<Pengeluaran />} />
          <Route path="/sales/laporan-laba" element={<LaporanLaba />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/data-user" element={<DataUser />} />
          <Route path="/admin/data-layanan" element={<DataLayanan />} />
          <Route path="/admin/data-penawaran" element={<DataPenawaranAdmin />} />
          <Route path="/admin/laporan-laba" element={<LabaLaporan />} />

          {/* Super Admin Routes */}
          <Route path="/superAdmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superAdmin/data-penawaran" element={<DataPenawaranSuperAdmin />} />

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
