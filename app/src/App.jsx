import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import layouts
import MainLayout from "./components/MainLayout";
import Layout from "./components/Layout";

// Import components
import Login from "./components/Login";

// Import pages
import SalesDashboard from "./pages/sales/Dashboard";

// Buat komponen Dashboard sederhana untuk admin
const AdminDashboard = () => (
  <div style={{
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }}>
    <h1 style={{
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '1rem'
    }}>
      Admin Dashboard
    </h1>
    <p style={{
      color: '#6B7280',
      fontSize: '1rem'
    }}>
      Selamat datang di dashboard admin PLN Icon Plus
    </p>
  </div>
);

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
          
          {/* General Routes */}
          <Route path="/dashboard" element={<SalesDashboard />} />
        </Route>

        {/* Routes with basic Layout (no sidebar/navbar) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
