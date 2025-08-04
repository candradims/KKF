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

// Import pages admin
import ManagementDataUser from "./pages/admin/DataUser";
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Router basename="/">
      <Routes>
        {/* Routes with MainLayout (with sidebar and navbar) */}
        <Route element={<MainLayout />}>
          {/* Sales Routes */}
          <Route path="/sales/dashboard" element={<SalesDashboard />} />
          
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
