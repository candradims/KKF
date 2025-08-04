import React from 'react';
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
  Cell
} from 'recharts';
import { TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  // Data untuk line chart Total Profit
  const totalProfitData = [
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
    { month: 'JAN', margin1: 45, margin2: 35 },
    { month: 'FEB', margin1: 48, margin2: 40 },
    { month: 'MAR', margin1: 52, margin2: 45 },
    { month: 'APR', margin1: 57, margin2: 50 },
    { month: 'MAY', margin1: 55, margin2: 48 },
    { month: 'JUN', margin1: 53, margin2: 46 },
    { month: 'JUL', margin1: 56, margin2: 49 },
    { month: 'AUG', margin1: 60, margin2: 52 },
    { month: 'SEP', margin1: 58, margin2: 50 },
    { month: 'OCT', margin1: 62, margin2: 55 },
    { month: 'NOV', margin1: 65, margin2: 58 },
    { month: 'DEC', margin1: 68, margin2: 60 }
  ];

  // Data untuk pie chart regional
  const regionalData = [
    { name: 'NTT JAWA-BALI', value: 37, color: '#00AEEF' },
    { name: 'NTT SUMATRA', value: 28, color: '#2D396B' },
    { name: 'NTT JABODETABEK', value: 24, color: '#60A5FA' },
    { name: 'NTT RNTM', value: 11, color: '#93C5FD' }
  ];

  const penawananData = [
    { name: 'NTT JAWA-BALI', value: 37, color: '#00AEEF' },
    { name: 'NTT SUMATRA', value: 28, color: '#2D396B' },
    { name: 'NTT JABODETABEK', value: 24, color: '#60A5FA' },
    { name: 'NTT RNTM', value: 11, color: '#93C5FD' }
  ];

  const COLORS = ['#00AEEF', '#2D396B', '#60A5FA', '#93C5FD'];

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
          {payload.map((entry, index) => (
            <p key={index} style={{ color: '#00AEEF', fontWeight: '600' }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
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
            background: 'linear-gradient(to right, #00AEEF, #2D396B)',
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
          <div style={{
            background: 'linear-gradient(to right, #00AEEF, #2D396B)',
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

          {/* Card 3 - Total Profit */}
          <div style={{
            background: 'linear-gradient(to right, #00AEEF, #2D396B)',
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
                  }} className="text-sm font-medium opacity-90">Total Profit</span>
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

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Total Profit Chart */}
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
              }} className="text-lg font-semibold text-gray-800">Tren Total Profit</h3>
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
                <LineChart data={totalProfitData}>
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

          {/* Total Profit Pie Chart */}
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
            }} className="text-lg font-semibold text-gray-800 mb-4">Total profit</h3>
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
              }} className="text-lg font-semibold text-gray-800">Tren Margin Rata-Rata</h3>
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

          {/* Penawaran Pie Chart */}
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
            }} className="text-lg font-semibold text-gray-800 mb-4">Penawaran</h3>
            <div style={{ height: '192px', marginBottom: '16px' }} className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={penawananData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {penawananData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="space-y-2">
              {penawananData.map((item, index) => (
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
      </div>
    </div>
  );
};

export default Dashboard;