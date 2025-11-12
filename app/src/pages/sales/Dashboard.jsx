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
  Legend,
  ComposedChart
} from 'recharts';
import { TrendingUp, Users, DollarSign, BarChart3, X, Clock, CheckCircle, XCircle, ChevronDown, Target, Calendar, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { penawaranAPI, getUserData, getAuthHeaders } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [totalPenawaran, setTotalPenawaran] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    menunggu: 0,
    disetujui: 0,
    ditolak: 0
  });
  const [loadingData, setLoadingData] = useState(true);
  const [totalRevenueData, setTotalRevenueData] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [regionalRevenueData, setRegionalRevenueData] = useState([]);
  const [loadingRegionalRevenue, setLoadingRegionalRevenue] = useState(true);
  const [marginTrendData, setMarginTrendData] = useState([]);
  const [loadingMarginData, setLoadingMarginData] = useState(true);

  // Load data functions (keep your existing functions)
  const loadPenawaranData = async () => {
    try {
      setLoadingData(true);
      const userData = getUserData();
      if (!userData) {
        console.error('User data not found');
        return;
      }

      const response = await penawaranAPI.getAll();
      
      if (response && response.success && response.data) {
        const penawaranList = response.data;
        
        let filteredData = penawaranList;
        if (userData.role_user === 'sales') {
          const filtered = penawaranList.filter(item => 
            item.sales === userData.nama_user || 
            item.created_by === userData.id_user ||
            item.sales === userData.email_user
          );
          filteredData = filtered.length > 0 ? filtered : penawaranList;
        }
        
        setTotalPenawaran(filteredData.length);
        
        const counts = {
          menunggu: filteredData.filter(item => 
            item.status === 'Menunggu' || item.status === 'menunggu'
          ).length,
          disetujui: filteredData.filter(item => 
            item.status === 'Disetujui' || item.status === 'disetujui' || item.status === 'Setuju'
          ).length,
          ditolak: filteredData.filter(item => 
            item.status === 'Ditolak' || item.status === 'ditolak' || item.status === 'Tidak Setuju'
          ).length
        };
        
        setStatusCounts(counts);
      }
    } catch (error) {
      console.error('Error loading penawaran data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadFinalRevenueData = async () => {
    try {
      setLoadingRevenue(true);
      const currentUser = getUserData();
      if (!currentUser) {
        console.error('❌ No user data found');
        setLoadingRevenue(false);
        return;
      }

      const response = await penawaranAPI.getAll();
      
      if (response && response.success && response.data) {
        const penawaranList = response.data;
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyData = {};
        
        monthNames.forEach(month => {
          monthlyData[month] = {
            totalProfit: 0,
            pencapaian: 0,
            target: parseFloat(currentUser.target_nr) || 0
          };
        });

        let totalRevenue = 0;

        for (const penawaran of penawaranList) {
          try {
            const hasilData = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilData && hasilData.success && hasilData.data) {
              const profit = parseFloat(hasilData.data.profit_dari_hjt_excl_ppn) || 0;
              const pencapaian = parseFloat(hasilData.data.total_per_bulan_harga_final_sebelum_ppn) || 0;
              
              if (profit > 0 || pencapaian > 0) {
                totalRevenue += profit;
                
                if (penawaran.tanggal_dibuat) {
                  const date = new Date(penawaran.tanggal_dibuat);
                  const monthIndex = date.getMonth();
                  const monthName = monthNames[monthIndex];
                  monthlyData[monthName].totalProfit += profit;
                  monthlyData[monthName].pencapaian += pencapaian;
                } else {
                  const currentMonth = monthNames[new Date().getMonth()];
                  monthlyData[currentMonth].totalProfit += profit;
                  monthlyData[currentMonth].pencapaian += pencapaian;
                }
              }
            }
          } catch (error) {
            console.error(`Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        const chartData = monthNames.map(month => ({
          month,
          totalProfit: Math.round(monthlyData[month].totalProfit),
          pencapaian: Math.round(monthlyData[month].pencapaian),
          target: Math.round(monthlyData[month].target)
        }));

        setTotalRevenueData(chartData);
      }
    } catch (error) {
      console.error('Error loading revenue data:', error);
      setTotalRevenueData([]);
    } finally {
      setLoadingRevenue(false);
    }
  };

  const loadRegionalRevenueData = async () => {
    try {
      setLoadingRegionalRevenue(true);
      const response = await penawaranAPI.getAll();
      
      if (response && response.success && response.data) {
        const penawaranList = response.data;
        let totalPencapaianAccumulated = 0;

        for (const penawaran of penawaranList) {
          try {
            const hasilData = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilData && hasilData.success && hasilData.data) {
              const pencapaian = parseFloat(hasilData.data.total_per_bulan_harga_final_sebelum_ppn) || 0;
              if (pencapaian > 0) {
                totalPencapaianAccumulated += pencapaian;
              }
            }
          } catch (error) {
            console.error(`Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        const userData = getUserData();
        const userTarget = (userData && userData.target_nr) ? parseFloat(userData.target_nr) : 0;

        const achievedPercent = userTarget > 0 ? Math.min(100, (totalPencapaianAccumulated / userTarget) * 100) : 0;
        const remainingPercent = Math.max(0, 100 - achievedPercent);

        const chartData = [
          {
            name: 'Tercapai',
            value: Math.round(achievedPercent * 10) / 10,
            amount: Math.round(totalPencapaianAccumulated),
            color: '#10b981'
          },
          {
            name: 'Belum Tercapai',
            value: Math.round(remainingPercent * 10) / 10,
            amount: Math.round(Math.max(userTarget - totalPencapaianAccumulated, 0)),
            color: '#f59e0b'
          }
        ];

        setRegionalRevenueData(chartData);
      }
    } catch (error) {
      console.error('Error loading regional revenue data:', error);
      setRegionalRevenueData([]);
    } finally {
      setLoadingRegionalRevenue(false);
    }
  };

  const loadMarginTrendData = async () => {
    try {
      setLoadingMarginData(true);
      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyMargin = {};
        monthNames.forEach(month => {
          monthlyMargin[month] = 0;
        });

        for (const penawaran of response.data) {
          try {
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const margin = parseFloat(hasilResponse.data.margin_dari_hjt) || 0;
              
              if (margin > 0) {
                let monthName = null;
                
                if (penawaran.tanggal_penawaran) {
                  try {
                    let date;
                    if (penawaran.tanggal_penawaran.includes('T')) {
                      date = new Date(penawaran.tanggal_penawaran);
                    } else if (penawaran.tanggal_penawaran.includes('-')) {
                      const parts = penawaran.tanggal_penawaran.split('-');
                      if (parts[0].length === 4) {
                        date = new Date(penawaran.tanggal_penawaran);
                      } else {
                        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                      }
                    } else {
                      date = new Date(penawaran.tanggal_penawaran);
                    }
                    
                    if (!isNaN(date.getTime())) {
                      monthName = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                    }
                  } catch (dateError) {
                    console.log(`Date parsing error:`, dateError);
                  }
                }
                
                if (!monthName || !monthNames.includes(monthName)) {
                  const currentDate = new Date();
                  monthName = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                }
                
                monthlyMargin[monthName] += margin;
              }
            }
          } catch (error) {
            console.error(`Error processing penawaran:`, error);
          }
        }

        const chartData = monthNames.map(month => ({
          month,
          margin: Math.round(monthlyMargin[month] * 100) / 100
        }));

        setMarginTrendData(chartData);
      }
    } catch (error) {
      console.error('Error loading margin data:', error);
      setMarginTrendData([]);
    } finally {
      setLoadingMarginData(false);
    }
  };

  useEffect(() => {
    loadPenawaranData();
    setTimeout(() => {
      loadFinalRevenueData();
      loadRegionalRevenueData();
      loadMarginTrendData();
    }, 1000);
    
    const interval = setInterval(() => {
      loadPenawaranData();
      setTimeout(() => {
        loadFinalRevenueData();
        loadRegionalRevenueData();
      }, 1000);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
    warning: '#f59e0b',
    gradientStart: '#035b71',
    gradientEnd: '#00a2b9'
  };

  const statusData = [
    { status: 'Menunggu', count: statusCounts.menunggu, icon: Clock, color: '#f59e0b' },
    { status: 'Setuju', count: statusCounts.disetujui, icon: CheckCircle, color: '#3fba8c' },
    { status: 'Tidak Setuju', count: statusCounts.ditolak, icon: XCircle, color: '#EF4444' }
  ];

  const statusPenawaranData = [
    { name: 'Menunggu', value: statusCounts.menunggu, color: '#f59e0b' },
    { name: 'Disetujui', value: statusCounts.disetujui, color: '#3fba8c' },
    { name: 'Ditolak', value: statusCounts.ditolak, color: '#EF4444' }
  ];

  const pencapaianChartData = (regionalRevenueData && regionalRevenueData.length > 0)
    ? regionalRevenueData.map(item => ({
        ...item,
        color: item.name === 'Belum Tercapai' ? colors.warning : colors.success
      }))
    : [];

  const formatNumber = (value) => {
    return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
  };

  // Calculate current period values
  const getCurrentPeriodValue = () => {
    const currentDate = new Date();
    const currentMonthShort = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    
    let currentPeriodData = totalRevenueData.find(item => item.month === currentMonthShort);
    
    if (!currentPeriodData || currentPeriodData.totalProfit === 0) {
      const monthsWithData = totalRevenueData
        .filter(item => item.totalProfit > 0)
        .reverse();
      currentPeriodData = monthsWithData[0];
    }
    
    return currentPeriodData ? currentPeriodData.totalProfit : 0;
  };

  const getCurrentMarginValue = () => {
    const currentDate = new Date();
    const currentMonthShort = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    
    let currentMarginData = marginTrendData.find(item => item.month === currentMonthShort);
    
    if (!currentMarginData || currentMarginData.margin === 0) {
      const monthsWithData = marginTrendData
        .filter(item => item.margin > 0)
        .reverse();
      currentMarginData = monthsWithData[0];
    }
    
    return currentMarginData ? currentMarginData.margin : 0;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#e7f3f5ff',
      padding: '24px',
    }}>
      <style>
      {`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(10px); }
        }
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(3, 91, 113, 0.1);
            opacity: 1;
          }
          50% { 
            box-shadow: 0 0 30px rgba(3, 91, 113, 0.3);
            opacity: 0.7;
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
      
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>

        {/* Header Section dengan Fokus Sales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Card Total Penawaran */}
          <div style={{
            background: 'linear-gradient(135deg, #035b71 0%, #00a2b9 100%)',
            borderRadius: '20px',
            padding: '28px',
            color: 'white',
            boxShadow: '0 20px 40px rgba(3, 91, 113, 0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            animation: 'glow 3s ease-in-out infinite'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 30px 50px rgba(3, 91, 113, 0.3)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(3, 91, 113, 0.2)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Users style={{ width: '24px', height: '24px' }} />
                  </div>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    opacity: '0.9'
                  }}>Total Penawaran</span>
                </div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {loadingData ? (
                    <div style={{
                      width: '60px',
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '30px',
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '4px',
                        animation: 'loading 1.5s ease-in-out infinite',
                        position: 'absolute'
                      }} />
                    </div>
                  ) : totalPenawaran}
                </div>
              </div>
              <div style={{
                animation: 'float 3s ease-in-out infinite'
              }}>
                <BarChart3 style={{ width: '48px', height: '48px', opacity: '0.8' }} />
              </div>
            </div>
          </div>

         {/* Card Status Penawaran */}
        <div style={{
          background: 'linear-gradient(135deg, #035b71 0%, #00a2b9 100%)',
          borderRadius: '20px',
          padding: '28px',
          color: 'white',
          boxShadow: '0 20px 40px rgba(3, 91, 113, 0.2)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }} onClick={() => !loadingData && setShowStatusModal(true)}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Activity style={{ width: '24px', height: '24px' }} />
                </div>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  opacity: '0.9'
                }}>Status Penawaran</span>
                <ChevronDown 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusModal(true);
                  }}
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    marginLeft: '4px',
                    opacity: '0.8',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }} 
                />
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {loadingData ? (
                  <div style={{
                    width: '60px',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '30px',
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '4px',
                      animation: 'loading 1.5s ease-in-out infinite',
                      position: 'absolute'
                    }} />
                  </div>
                ) : totalPenawaran}
              </div>
            </div>
            <div style={{
              animation: 'float 3s ease-in-out infinite',
              animationDelay: '0.5s'
            }}>
              <TrendingUp style={{ width: '48px', height: '48px', opacity: '0.8' }} />
            </div>
          </div>
        </div>

          {/* Card Total Revenue */}
          <div style={{
            background: 'linear-gradient(135deg, #035b71 0%, #00a2b9 100%)',
            borderRadius: '20px',
            padding: '28px',
            color: 'white',
            boxShadow: '0 20px 40px rgba(3, 91, 113, 0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 30px 50px rgba(3, 91, 113, 0.3)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(3, 91, 113, 0.2)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <DollarSign style={{ width: '24px', height: '24px' }} />
                  </div>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    opacity: '0.9'
                  }}>Total Revenue</span>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {loadingRevenue ? 'Loading...' : `Rp ${getCurrentPeriodValue().toLocaleString('id-ID')}`}
                </div>
              </div>
              <div style={{
                animation: 'float 3s ease-in-out infinite',
                animationDelay: '1s'
              }}>
                <DollarSign style={{ width: '48px', height: '48px', opacity: '0.8' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '32px',
          marginBottom: '32px'
        }}>
          
          {/* LEFT COLUMN */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            
            {/* Performa Sales */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 250, 255, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(3, 91, 113, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 30px 60px rgba(3, 91, 113, 0.15)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(3, 91, 113, 0.1)';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    padding: '10px 10px 6px 10px',
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                    borderRadius: '12px',
                    color: 'white'
                  }}>
                    <Target size={20} />
                  </div>
                  Performa Sales
                </h3>
                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(3, 91, 113, 0.1)',
                  borderRadius: '12px',
                  border: `1px solid ${colors.primary}30`,
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.primary
                }}>
                  Real-time
                </div>
              </div>
              <div style={{ height: '380px' }}>
                {loadingRevenue ? (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      border: `4px solid ${colors.primary}20`,
                      borderTop: `4px solid ${colors.primary}`,
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{
                      color: colors.primary,
                      fontWeight: '600',
                      fontSize: '16px'
                    }}>
                      Memuat data performa...
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart 
                      data={totalRevenueData}
                      margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                    >
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="rgba(3, 91, 113, 0.1)" 
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: colors.primary, fontWeight: '600' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: colors.primary, fontWeight: '600' }}
                        tickFormatter={formatNumber}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: `2px solid ${colors.primary}`,
                          borderRadius: '12px',
                          boxShadow: '0 20px 40px rgba(3, 91, 113, 0.2)',
                          backdropFilter: 'blur(10px)'
                        }}
                        formatter={(value, name, props) => {
                          const formattedValue = `Rp ${Math.round(value).toLocaleString('id-ID')}`;
                          const labelMap = {
                            'pencapaian': 'Pencapaian',
                            'totalProfit': 'Revenue', 
                            'target': 'Target'
                          };
                          
                          return [formattedValue, labelMap[name] || name];
                        }}
                        labelFormatter={(label) => `Bulan: ${label}`}
                      />
                      <Legend 
                        wrapperStyle={{ 
                          paddingTop: '20px', 
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                        iconType="rect"
                        iconSize={12}
                      />
                      <Bar 
                        dataKey="pencapaian" 
                        fill={colors.warning}
                        name="Pencapaian"
                        radius={[8, 8, 0, 0]}
                        barSize={24}
                      />
                      <Bar 
                        dataKey="totalProfit" 
                        fill={colors.primary}
                        name="Revenue"
                        radius={[8, 8, 0, 0]}
                        barSize={24}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke={colors.secondary}
                        strokeWidth={3}
                        dot={{ fill: colors.secondary, strokeWidth: 2, r: 5 }}
                        strokeDasharray="5 5"
                        name="Target"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Tren Revenue & Margin */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              
              {/* Tren Revenue */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 250, 255, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 15px 30px rgba(3, 91, 113, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: colors.primary,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    padding: '8px 8px 6px 6px',
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                    borderRadius: '12px',
                    color: 'white'
                  }}>
                    <TrendingUp size={18} />
                  </div>
                  Tren Revenue
                </h4>
                <div style={{ height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={totalRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(3, 91, 113, 0.1)" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: colors.primary }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: colors.primary }}
                        tickFormatter={(value) => {
                          if (value >= 1000000000) return `${(value/1000000000).toFixed(1)}B`;
                          if (value >= 1000000) return `${(value/1000000).toFixed(1)}M`;
                          if (value >= 1000) return `${(value/1000).toFixed(1)}K`;
                          return value;
                        }}
                      />
                      <Tooltip 
                        formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: `1px solid ${colors.primary}`,
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalProfit" 
                        stroke={colors.primary} 
                        strokeWidth={3}
                        dot={{ fill: colors.primary, strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, fill: colors.secondary }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tren Margin */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 250, 255, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 15px 30px rgba(3, 91, 113, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: colors.primary,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    padding: '8px 8px 6px 6px',
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                    borderRadius: '12px',
                    color: 'white'
                  }}>
                    <Activity size={18} />
                  </div>
                  Tren Margin
                </h4>
                <div style={{ height: '200px' }}>
                  {loadingMarginData ? (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      color: colors.primary
                    }}>
                      Loading...
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marginTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(3, 91, 113, 0.1)" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: colors.primary }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: colors.primary }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Margin']}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: `1px solid ${colors.primary}`,
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="margin" 
                          stroke={colors.accent1} 
                          strokeWidth={3}
                          dot={{ fill: colors.accent1, strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            
            {/* Pencapaian Target */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 250, 255, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 15px 30px rgba(3, 91, 113, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: colors.primary,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                    padding: '10px 10px 6px 10px',
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                    borderRadius: '12px',
                    color: 'white'
                }}>
                  <Target size={20} />
                </div>
                Progress Target
              </h4>
              <div style={{ height: '180px', marginBottom: '20px' }}>
                {loadingRegionalRevenue ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: colors.primary
                  }}>
                    Loading...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pencapaianChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pencapaianChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pencapaianChartData.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    padding: '8px 12px',
                    background: 'rgba(3, 91, 113, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: item.color
                      }} />
                      <span style={{ fontWeight: '600', color: colors.primary }}>
                        {item.name}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: colors.primary }}>
                        {item.value}%
                      </div>
                      <div style={{ fontSize: '12px', color: colors.primary, opacity: '0.7' }}>
                        Rp {item.amount?.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Penawaran */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 250, 255, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 15px 30px rgba(3, 91, 113, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: colors.primary,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                    padding: '8px 8px 6px 6px',
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                    borderRadius: '12px',
                    color: 'white'
                }}>                
                  <PieChartIcon size={18} />
                </div>
                Status Penawaran
              </h4>
              <div style={{ height: '180px', marginBottom: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPenawaranData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusPenawaranData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                    fontSize: '14px',
                    padding: '8px 12px',
                    background: 'rgba(3, 91, 113, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: item.color
                      }} />
                      <span style={{ color: colors.primary }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: '600', color: colors.primary }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Penawaran Modal */}
      {showStatusModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(3, 91, 113, 0.3)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setShowStatusModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              rotate: [0, 0.5, -0.5, 0]
            }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 250, 255, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '20px',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '70vh',
              overflow: 'auto',
              boxShadow: '0 32px 64px rgba(3, 91, 113, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Background Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '60px',
              height: '60px',
              background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`,
              borderRadius: '0 20px 0 50px',
              zIndex: 0
            }} />
            
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '50px',
              height: '50px',
              background: `linear-gradient(135deg, ${colors.tertiary}15 0%, ${colors.accent1}15 100%)`,
              borderRadius: '0 35px 0 20px',
              zIndex: 0
            }} />

            {/* Modal Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              
              {/* Modal Header */}
              <motion.div 
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '14px',
                  borderBottom: `2px solid ${colors.primary}15`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{
                      padding: '8px 10px 6px 10px',
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                      borderRadius: '10px',
                      boxShadow: '0 8px 20px rgba(3, 91, 113, 0.3)'
                    }}
                  >
                    <Activity style={{ width: '18px', height: '18px', color: 'white' }} />
                  </motion.div>
                  <div>
                    <h2 style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      margin: 0
                    }}>
                      Status Penawaran
                    </h2>
                    <p style={{
                      fontSize: '12px',
                      color: colors.primary,
                      opacity: '0.7',
                      margin: '2px 0 0 0',
                      fontWeight: '500'
                    }}>
                      Ringkasan lengkap status penawaran
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowStatusModal(false)}
                  style={{
                    padding: '6px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(3, 91, 113, 0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X style={{ width: '16px', height: '16px', color: colors.primary }} />
                </motion.button>
              </motion.div>

              {/* Status Cards Grid */}
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '14px',
                  marginBottom: '18px'
                }}
              >
                {statusData.map((item, index) => {
                  const IconComponent = item.icon;
                  const cardColors = {
                    menunggu: {
                      gradient: `linear-gradient(135deg, ${colors.warning}15 0%, ${colors.warning}05 100%)`,
                      border: `${colors.warning}90`,
                      iconBg: colors.warning
                    },
                    setuju: {
                      gradient: `linear-gradient(135deg, ${colors.success}15 0%, ${colors.success}05 100%)`,
                      border: `${colors.success}90`,
                      iconBg: colors.success
                    },
                    ditolak: {
                      gradient: `linear-gradient(135deg, #EF444415 0%, #EF444405 100%)`,
                      border: '#EF444490',
                      iconBg: '#EF4444'
                    }
                  };
                  
                  const cardColor = {
                    gradient: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
                    border: `${item.color}90`,
                    iconBg: item.color
                  };

                  return (
                    <motion.div 
                      key={index}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      style={{
                        background: cardColor.gradient,
                        backdropFilter: 'blur(10px)',
                        borderRadius: '14px',
                        padding: '16px',
                        border: `2px solid ${cardColor.border}`,
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Animated Background Element */}
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        style={{
                          position: 'absolute',
                          top: '-30%',
                          right: '-30%',
                          width: '60px',
                          height: '60px',
                          background: `radial-gradient(circle, ${cardColor.iconBg}15 0%, transparent 70%)`,
                          borderRadius: '50%',
                        }}
                      />
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            style={{
                              padding: '14px 10px 6px 10px',
                              background: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: '10px',
                              boxShadow: '0 6px 16px rgba(3, 91, 113, 0.1)',
                              border: `1px solid ${cardColor.iconBg}90`,
                            }}
                          >
                            <IconComponent style={{ 
                              width: '18px',
                              height: '18px',
                              color: cardColor.iconBg 
                            }} />
                          </motion.div>
                          <div>
                            <h3 style={{
                              fontSize: '14px',
                              fontWeight: '700',
                              color: colors.primary,
                              margin: '0 0 3px 0'
                            }}>
                              {item.status}
                            </h3>
                            <p style={{
                              fontSize: '12px',
                              color: colors.primary,
                              opacity: '0.6',
                              margin: 0,
                              fontWeight: '500'
                            }}>
                              Total penawaran
                            </p>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '2px'
                        }}>
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + (index * 0.1), type: "spring", stiffness: 300 }}
                            style={{
                              fontSize: '22px',
                              fontWeight: '800',
                              color: cardColor.iconBg,
                              lineHeight: '1'
                            }}
                          >
                            {item.count}
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Summary Footer */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}05 0%, ${colors.secondary}05 100%)`,
                  backdropFilter: 'blur(10px)',
                  borderRadius: '14px',
                  padding: '16px',
                  border: `2px solid ${colors.primary}25`,
                  textAlign: 'center'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px'
                }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: colors.primary,
                    opacity: '0.8'
                  }}>
                    Total Semua Penawaran:
                  </span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
                    style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {loadingData ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <div style={{
                          width: '12px',
                          height: '12px',
                          border: `2px solid ${colors.primary}30`,
                          borderTop: `2px solid ${colors.primary}`,
                          borderRadius: '50%',
                        }} />
                        Loading...
                      </motion.div>
                    ) : (
                      totalPenawaran.toLocaleString('id-ID')
                    )}
                  </motion.span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '16px',
                  marginTop: '32px'
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowStatusModal(false)}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
                    color: '#ffffff',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: `0 4px 15px rgba(3, 91, 113, 0.3)`,
                    letterSpacing: '0.02em'
                  }}
                >
                  Batal
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;