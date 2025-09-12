import React, { useState, useEffect } from 'react';
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
import { getUserData, getAuthHeaders } from '../../utils/api';

const Dashboard = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  // Load dashboard statistics
  const loadDashboardStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('http://localhost:3000/api/penawaran/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setDashboardStats(data.data);
      } else {
        throw new Error(data.message || 'Failed to load dashboard stats');
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setError(error.message);
      // Set default values on error
      setDashboardStats({
        totalPenawaran: 0,
        statusStats: { menunggu: 0, disetujui: 0, ditolak: 0 },
        wilayahStats: {},
        salesStats: {},
        totalNilaiPenawaran: 0,
        recentPenawaran: [],
        summary: { totalSales: 0, totalWilayah: 0, avgNilaiPerPenawaran: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  // Data untuk status penawaran - diambil dari API
  const statusData = [
    { 
      status: 'Menunggu', 
      count: dashboardStats?.statusStats?.menunggu || 0, 
      icon: Clock, 
      color: '#fce40bff' 
    },
    { 
      status: 'Setuju', 
      count: dashboardStats?.statusStats?.disetujui || 0, 
      icon: CheckCircle, 
      color: '#3fba8c' 
    },
    { 
      status: 'Tidak Setuju', 
      count: dashboardStats?.statusStats?.ditolak || 0, 
      icon: XCircle, 
      color: '#EF4444' 
    }
  ];
  
  // Data sales for Target NR & Pencapaian Sales
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
    { name: 'HJT JAWA-BALI', value: 37, color: colors.primary },
    { name: 'HJT SUMATRA', value: 28, color: colors.secondary },
    { name: 'HJT JABODETABEK', value: 24, color: colors.accent1 },
    { name: 'HJT INTIM', value: 11, color: colors.tertiary }
  ];

  // Data untuk pie chart status penawaran
  // Data untuk pie chart status penawaran - diambil dari API
  const statusPenawaranData = [
    { 
      name: 'Menunggu', 
      value: dashboardStats?.statusStats?.menunggu || 0, 
      color: '#fce40bff' 
    },
    { 
      name: 'Disetujui', 
      value: dashboardStats?.statusStats?.disetujui || 0, 
      color: '#3fba8c' 
    },
    { 
      name: 'Ditolak', 
      value: dashboardStats?.statusStats?.ditolak || 0, 
      color: '#EF4444' 
    }
  ];

  const COLORS = [colors.primary, colors.secondary, colors.accent1, colors.tertiary];
  const STATUS_COLORS = ['#fce40bff', '#3fba8c' , '#EF4444'];

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
              <p key={index} style={{ color: colors.primary, fontWeight: '600' }}>
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
      backgroundColor: '#e7f3f5ff',
      padding: '24px',
      paddingTop: '105px'
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto'
      }}>
        {/* Header Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Card 1 - Jumlah Total Penawaran */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <Users style={{ width: '20px', height: '20px' }} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: '0.9'
                  }}>Jumlah Total Penawaran</span>
                </div>
                <div style={{
                  fontSize: '30px',
                  fontWeight: 'bold'
                }}>
                  {loading ? '...' : (dashboardStats?.totalPenawaran || 0)}
                </div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <BarChart3 style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </div>

          {/* Card 2 - Status Penawaran */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <TrendingUp style={{ width: '20px', height: '20px' }} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: '0.9'
                  }}>Status Penawaran</span>
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
                  />
                </div>
                <div style={{
                  fontSize: '30px',
                  fontWeight: 'bold'
                }}>{loading ? '...' : dashboardStats.totalPenawaran || 0}</div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <BarChart3 style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </div>

          {/* Card 3 - Total Revenue */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <DollarSign style={{ width: '20px', height: '20px' }} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: '0.9'
                  }}>Total Revenue</span>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {loading ? 'Loading...' : `Rp ${(dashboardStats?.totalNilaiPenawaran || 0).toLocaleString('id-ID')}`}
                </div>
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <DollarSign style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Target & Achievement Bar Chart */}
        <div style={{
          background: 'linear-gradient(135deg, #d7f2f5ff 0%, #f0faff 100%)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          marginBottom: '32px',
          transition: 'transform 0.2s, box-shadow 0.2s',
          border: '1px solid #035b71',
          position: 'relative',
          overflow: 'hidden'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Target NR & Pencapaian Sales
          </h3>
          <div style={{ height: '340px', paddingLeft: '32px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesBarChartData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#666', dx: 0 }} 
                  tickFormatter={v => `Rp ${v.toLocaleString()}`}
                  width={100}
                  tickMargin={16}
                />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="TargetNR" fill={colors.primary} name="Target NR" barSize={32} />
                <Bar dataKey="Achievement" fill={colors.secondary} name="Pencapaian" barSize={32} />
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
        }}>
          {/* Total Revenue Chart */}
          <div style={{
            background: 'linear-gradient(135deg, #d7f2f5ff 0%, #f0faff 100%)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: '1px solid #035b71',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>Tren Total Revenue</h3>
              <select style={{
                padding: '4px 12px',
                border: '1px solid #035b71',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}>
                <option>Years</option>
                <option>2025</option>
                <option>2026</option>
              </select>
            </div>
            <div style={{ height: '320px' }}>
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
                    stroke={colors.primary} 
                    strokeWidth={3}
                    dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: colors.secondary }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{
              marginTop: '16px',
              background: 'linear-gradient(135deg, #d7f2f5ff 100%, #f0faff 200%)',
              borderRadius: '8px',
              padding: '12px'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: colors.primary
              }}>25200</div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>Current Period Value</div>
            </div>
          </div>

          {/* Total Profit Pie Chart */}
          <div style={{
            background: 'linear-gradient(135deg, #d7f2f5ff 0%, #f0faff 100%)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: '1px solid #035b71',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>Total revenue</h3>
            <div style={{ height: '192px', marginBottom: '16px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {regionalData.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '14px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div 
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: COLORS[index]
                      }}
                    ></div>
                    <span style={{ color: '#6b7280' }}>{item.name}</span>
                  </div>
                  <span style={{
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>{item.value}%</span>
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
        }}>
          {/* Margin Trend Chart */}
          <div style={{
            background: 'linear-gradient(135deg, #d7f2f5ff 0%, #f0faff 100%)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: '1px solid #035b71',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>Tren Margin Rata-Rata </h3>
              <select style={{
                padding: '4px 12px',
                border: '1px solid #035b71',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}>
                <option>Years</option>
                <option>2025</option>
                <option>2026</option>
              </select>
            </div>
            <div style={{ height: '320px' }}>
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
                    stroke={colors.primary} 
                    strokeWidth={3}
                    dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="margin2" 
                    stroke={colors.secondary} 
                    strokeWidth={3}
                    dot={{ fill: colors.secondary, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{
              marginTop: '16px',
              backgroundColor: '#cfefedff',
              borderRadius: '8px',
              padding: '12px'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: colors.primary
              }}>57%</div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>Current Margin Rate</div>
            </div>
          </div>

          {/* Status Penawaran Pie Chart */}
          <div style={{
            background: 'linear-gradient(135deg, #d7f2f5ff 0%, #f0faff 100%)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            border: '1px solid #035b71',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>Status Penawaran</h3>
            <div style={{ height: '192px', marginBottom: '16px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {statusPenawaranData.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '14px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div 
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: STATUS_COLORS[index]
                      }}
                    ></div>
                    <span style={{ color: '#6b7280' }}>{item.name}</span>
                  </div>
                  <span style={{
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>{item.value}%</span>
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
        }} onClick={() => setShowStatusModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937'
              }}>Detail Status Penawaran</h2>
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
              >
                <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
              </button>
            </div>

            {/* Status Cards */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {statusData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: `${item.color}20`, 
                    border: `2px solid ${item.color}`,
                    transition: 'box-shadow 0.2s, transform 0.2s'
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                      }}>
                        <IconComponent style={{ 
                          width: '24px', 
                          height: '24px', 
                          color: item.color 
                        }} />
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>{item.status}</h3>
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>Status penawaran</p>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: item.color
                      }}>{item.count}</span>
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>items</span>
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
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>Total Penawaran:</span>
                <span style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: colors.primary
                }}>
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