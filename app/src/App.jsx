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
import LaporanLaba from "./pages/sales/LaporanLaba";
import Penawaran from "./pages/sales/Penawaran";

// Import pages admin
import DataUser from "./pages/admin/DataUser/Index";
import DataLayanan from "./pages/admin/DataLayanan/Index";
import AdminDashboard from "./pages/admin/Dashboard";
import LabaLaporan from "./pages/admin/LaporanLaba/Index";
import DataPenawaran from "./pages/admin/DataPenawaran/Index";

function App() {
  return (
    <Router basename="/">
      <Routes>
        {/* Routes with MainLayout (with sidebar and navbar) */}
        <Route element={<MainLayout />}>
          {/* Sales Routes */}
          <Route path="/sales/dashboard" element={<SalesDashboard />} />
          <Route path="/sales/data-penawaran" element={<Penawaran />} />
          <Route path="/sales/laporan-laba" element={<LaporanLaba />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/data-user" element={<DataUser />} />
          <Route path="/admin/data-layanan" element={<DataLayanan />} />
           <Route path="/admin/data-penawaran" element={<DataPenawaran />} />
          <Route path="/admin/laporan-laba" element={<LabaLaporan />} />
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
