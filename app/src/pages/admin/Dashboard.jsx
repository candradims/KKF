import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, Users, DollarSign, BarChart3, X, Clock, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

const Dashboard = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Data untuk status penawaran
  const statusData = [
    { status: 'Menunggu', count: 20, icon: Clock, color: '#F59E0B' },
    { status: 'Setuju', count: 25, icon: CheckCircle, color: '#10B981' },
    { status: 'Tidak Setuju', count: 5, icon: XCircle, color: '#EF4444' }
  ];
  
  // Data sales for Target NR & Pencapaian Sales (same as super admin)
  const salesBarChartData = [
    { name: 'Achmad', TargetNR: 3802105336, Achievement: Math.round(3802105336 * 0.1) },
    { name: 'Firmanda', TargetNR: 14257895010, Achievement: Math.round(14257895010 * 0.1) },
    { name: 'Pungky', TargetNR: 7604210672, Achievement: Math.round(7604210672 * 0.1) },
    { name: 'Divia', TargetNR: 3802105336, Achievement: Math.round(3802105336 * 0.1) },
    { name: 'Mohamad', TargetNR: 12356842342, Achievement: Math.round(12356842342 * 0.1) },
    { name: 'Yanur', TargetNR: 4752631670, Achievement: Math.round(4752631670 * 0.1) },
    { name: 'Senna', TargetNR: 4752631670, Achievement: Math.round(4752631670 * 0.1) },
    { name: 'Rahma', TargetNR: 3802105336, Achievement: Math.round(3802105336 * 0.1) },
    { name: 'Yesy', TargetNR: 4752631670, Achievement: Math.round(4752631670 * 0.1) },
    { name: 'Gumilang', TargetNR: 4752631670, Achievement: Math.round(4752631670 * 0.1) },
    { name: 'Deidra', TargetNR: 3802105336, Achievement: Math.round(3802105336 * 0.1) },
    { name: 'Febrina', TargetNR: 4752631670, Achievement: Math.round(4752631670 * 0.1) },
    { name: 'Yeni', TargetNR: 9505263340, Achievement: Math.round(9505263340 * 0.1) },
    { name: 'Yustika', TargetNR: 3802105336, Achievement: Math.round(3802105336 * 0.1) },
    { name: 'Ganjar', TargetNR: 4752631670, Achievement: Math.round(4752631670 * 0.1) },
    { name: 'Zahrotul', TargetNR: 3802105336, Achievement: Math.round(3802105336 * 0.1) }
  ];
  // Data untuk line chart Total Revenue
  const totalRevenueData = [
    { month: 'JAN', value: 15000 },
    { month: 'FEB', value: 18000 },
    { month: 'MAR', value: 22000 },
    { month: 'APR', value: 25200 },
    { month: 'MAY', value: 28000 },
    { month: 'JUN', value: 24000 },
    { month: 'JUL', value: 26000 },
    { month: 'AUG', value: 30000 },
    { month: 'SEP', value: 32000 },
    { month: 'OCT', value: 29000 },
    { month: 'NOV', value: 35000 },
    { month: 'DEC', value: 38000 }
  ];

  // Data untuk line chart Margin Trend
  const marginTrendData = [
    { month: 'JAN', margin1: 45.2, margin2: 35.8 },
    { month: 'FEB', margin1: 48.1, margin2: 40.3 },
    { month: 'MAR', margin1: 52.7, margin2: 45.1 },
    { month: 'APR', margin1: 57.3, margin2: 50.6 },
    { month: 'MAY', margin1: 55.9, margin2: 48.2 },
    { month: 'JUN', margin1: 53.4, margin2: 46.7 },
    { month: 'JUL', margin1: 56.8, margin2: 49.5 },
    { month: 'AUG', margin1: 60.2, margin2: 52.3 },
    { month: 'SEP', margin1: 58.7, margin2: 50.9 },
    { month: 'OCT', margin1: 62.1, margin2: 55.4 },
    { month: 'NOV', margin1: 65.3, margin2: 58.7 },
    { month: 'DEC', margin1: 68.5, margin2: 60.2 }
  ];

  // Data untuk pie chart regional
  const regionalData = [
    { name: 'HJT JAWA-BALI', value: 37, color: '#00AEEF' },
    { name: 'HJT SUMATRA', value: 28, color: '#2D396B' },
    { name: 'HJT JABODETABEK', value: 24, color: '#60A5FA' },
    { name: 'HJT INTIM', value: 11, color: '#93C5FD' }
  ];

  // Data untuk pie chart status penawaran
  const statusPenawaranData = [
    { name: 'Menunggu', value: 40, color: '#F59E0B' },
    { name: 'Disetujui', value: 50, color: '#10B981' },
    { name: 'Ditolak', value: 10, color: '#EF4444' }
  ];

  const COLORS = ['#00AEEF', '#2D396B', '#60A5FA', '#93C5FD'];
  const STATUS_COLORS = ['#F59E0B', '#10B981', '#EF4444'];

  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <p style={{ color: '#6b7280' }}>{`Month: ${label}`}</p>
          {payload.map((entry, index) => {
            // Add percentage symbol for margin data
            const isMarginData = entry.dataKey.includes('margin');
            const displayValue = isMarginData ? `${entry.value}%` : entry.value;
            return (
              <p key={index} style={{ color: '#00AEEF', fontWeight: '600' }}>
                {`${entry.dataKey}: ${displayValue}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '24px'
    }} className="min-h-screen bg-gray-50 p-6">
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto'
      }} className="max-w-7xl mx-auto">
        {/* Header Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 - Jumlah Total Penawaran */}
          <div style={{
            background: 'linear-gradient(to right, #035b71, #035b71)',
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'box-shadow 0.2s'
          }} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }} className="flex items-center justify-between">
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }} className="flex items-center gap-2 mb-2">
                  <Users style={{ width: '20px', height: '20px' }} className="w-5 h-5" />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: '0.9'
                  }} className="text-sm font-medium opacity-90">Jumlah Total Penawaran</span>
                </div>
                <div style={{
                  fontSize: '30px',
                  fontWeight: 'bold'
                }} className="text-3xl font-bold">50</div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '8px'
              }} className="bg-white bg-opacity-20 p-3 rounded-lg">
                <BarChart3 style={{ width: '24px', height: '24px' }} className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2 - Status Penawaran */}
          <div 
            style={{
              background: 'linear-gradient(to right, #035b71, #035b71)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transition: 'box-shadow 0.2s'
            }} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }} className="flex items-center justify-between">
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }} className="flex items-center gap-2 mb-2">
                  <TrendingUp style={{ width: '20px', height: '20px' }} className="w-5 h-5" />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: '0.9'
                  }} className="text-sm font-medium opacity-90">Status Penawaran</span>
                  <ChevronDown 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusModal(true);
                    }}
                    style={{ 
                      width: '16px', 
                      height: '16px',
                      marginLeft: '4px',
                      opacity: '0.8',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s'
                    }} 
                    className="w-4 h-4 ml-1 opacity-80 cursor-pointer hover:opacity-100 transition-opacity" />
                </div>
                <div style={{
                  fontSize: '30px',
                  fontWeight: 'bold'
                }} className="text-3xl font-bold">50</div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '8px'
              }} className="bg-white bg-opacity-20 p-3 rounded-lg">
                <BarChart3 style={{ width: '24px', height: '24px' }} className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 3 - Total Revenue */}
          <div style={{
            background: 'linear-gradient(to right, #035b71, #035b71)',
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'box-shadow 0.2s'
          }} className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }} className="flex items-center justify-between">
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }} className="flex items-center gap-2 mb-2">
                  <DollarSign style={{ width: '20px', height: '20px' }} className="w-5 h-5" />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: '0.9'
                  }} className="text-sm font-medium opacity-90">Total Revenue</span>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold'
                }} className="text-2xl font-bold">Rp 52.000.000,-</div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '8px'
              }} className="bg-white bg-opacity-20 p-3 rounded-lg">
                <DollarSign style={{ width: '24px', height: '24px' }} className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Target & Achievement Bar Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          marginBottom: '32px'
        }} className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '16px'
          }} className="text-lg font-semibold text-gray-800 mb-4">
            Target NR & Pencapaian Sales
          </h3>
          <div style={{ height: '340px', paddingLeft: '32px' }} className="h-80 pl-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesBarChartData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#666', dx: 0 }} 
                  tickFormatter={v => `Rp ${v.toLocaleString()}`}
                  width={100}
                  tickMargin={16}
                />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="TargetNR" fill="#00AEEF" name="Target NR" barSize={32} />
                <Bar dataKey="Achievement" fill="#2D396B" name="Pencapaian" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Total Revenue Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }} className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }} className="flex items-center justify-between mb-6">
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }} className="text-lg font-semibold text-gray-800">Tren Total Revenue</h3>
              <select style={{
                padding: '4px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }} className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Years</option>
                <option>2025</option>
                <option>2026</option>
              </select>
            </div>
            <div style={{ height: '320px' }} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={totalRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <Tooltip content={renderCustomTooltip} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00AEEF" 
                    strokeWidth={3}
                    dot={{ fill: '#00AEEF', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#2D396B' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{
              marginTop: '16px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              padding: '12px'
            }} className="mt-4 bg-blue-50 rounded-lg p-3">
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#00AEEF'
              }} className="text-2xl font-bold text-blue-600">25200</div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }} className="text-sm text-gray-600">Current Period Value</div>
            </div>
          </div>

          {/* Total Revenue Pie Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }} className="bg-white rounded-xl p-6 shadow-lg">
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }} className="text-lg font-semibold text-gray-800 mb-4">Total revenue</h3>
            <div style={{ height: '192px', marginBottom: '16px' }} className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {regionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="space-y-2">
              {regionalData.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '14px'
                }} className="flex items-center justify-between text-sm">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }} className="flex items-center gap-2">
                    <div 
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: COLORS[index]
                      }}
                      className="w-3 h-3 rounded-full"
                    ></div>
                    <span style={{ color: '#6b7280' }} className="text-gray-600">{item.name}</span>
                  </div>
                  <span style={{
                    fontWeight: '600',
                    color: '#1f2937'
                  }} className="font-semibold text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px'
        }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Margin Trend Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }} className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }} className="flex items-center justify-between mb-6">
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }} className="text-lg font-semibold text-gray-800">Tren Margin Rata-Rata </h3>
              <select style={{
                padding: '4px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }} className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Years</option>
                <option>2025</option>
                <option>2026</option>
              </select>
            </div>
            <div style={{ height: '320px' }} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marginTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={renderCustomTooltip} />
                  <Line 
                    type="monotone" 
                    dataKey="margin1" 
                    stroke="#00AEEF" 
                    strokeWidth={3}
                    dot={{ fill: '#00AEEF', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="margin2" 
                    stroke="#2D396B" 
                    strokeWidth={3}
                    dot={{ fill: '#2D396B', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{
              marginTop: '16px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              padding: '12px'
            }} className="mt-4 bg-blue-50 rounded-lg p-3">
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#00AEEF'
              }} className="text-2xl font-bold text-blue-600">57%</div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }} className="text-sm text-gray-600">Current Margin Rate</div>
            </div>
          </div>

          {/* Status Penawaran Pie Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }} className="bg-white rounded-xl p-6 shadow-lg">
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }} className="text-lg font-semibold text-gray-800 mb-4">Status Penawaran</h3>
            <div style={{ height: '192px', marginBottom: '16px' }} className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPenawaranData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusPenawaranData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="space-y-2">
              {statusPenawaranData.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '14px'
                }} className="flex items-center justify-between text-sm">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }} className="flex items-center gap-2">
                    <div 
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: STATUS_COLORS[index]
                      }}
                      className="w-3 h-3 rounded-full"
                    ></div>
                    <span style={{ color: '#6b7280' }} className="text-gray-600">{item.name}</span>
                  </div>
                  <span style={{
                    fontWeight: '600',
                    color: '#1f2937'
                  }} className="font-semibold text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Penawaran Modal */}
      {showStatusModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setShowStatusModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }} className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }} className="flex items-center justify-between mb-6">
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937'
              }} className="text-2xl font-bold text-gray-800">Detail Status Penawaran</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X style={{ width: '20px', height: '20px', color: '#6b7280' }} className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Status Cards */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }} className="space-y-4">
              {statusData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    backgroundColor: '#f9fafb',
                    transition: 'box-shadow 0.2s'
                  }} className="flex items-center justify-between p-5 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-md transition-shadow">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }} className="flex items-center gap-4">
                      <div style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                      }} className="p-3 rounded-xl bg-white shadow-sm">
                        <IconComponent style={{ 
                          width: '24px', 
                          height: '24px', 
                          color: item.color 
                        }} className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }} className="text-lg font-semibold text-gray-800">{item.status}</h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280'
                        }} className="text-sm text-gray-600">Status penawaran</p>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }} className="flex items-center gap-2">
                      <span style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: item.color
                      }} className="text-3xl font-bold">{item.count}</span>
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }} className="text-sm text-gray-600">items</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#eff6ff',
              borderRadius: '12px'
            }} className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }} className="flex items-center justify-between">
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937'
                }} className="text-lg font-semibold text-gray-800">Total Penawaran:</span>
                <span style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#00AEEF'
                }} className="text-2xl font-bold text-blue-600">
                  {statusData.reduce((total, item) => total + item.count, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;