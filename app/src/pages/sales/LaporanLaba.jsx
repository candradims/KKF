import React, { useState, useEffect } from 'react';
import { CircleDollarSign, TrendingUp, Users, Calendar, Filter, RotateCcw, DollarSign, UserCheck, Target, TrendingDown, Award, BarChart3, Activity, PieChart, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Legend,
  ReferenceLine
} from 'recharts';
import { penawaranAPI, getUserData } from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const LaporanLaba = () => {
  const [salesData, setSalesData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('performance');
  const [totalRevenueFromProfit, setTotalRevenueFromProfit] = useState(0);
  const [nilaiPencapaian, setNilaiPencapaian] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
    warning: '#f59e0b',
    danger: '#ef4444',
    light: '#e7f3f5',
    white: '#ffffff'
  };

  const monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
    'JUL', 'AGS', 'SEP', 'OKT', 'NOV', 'DES'
  ];

  const calculatePencapaianFromDatabase = async (currentUser) => {
    try {
      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        let totalPencapaian = 0;

        for (const penawaran of response.data) {
          try {
            if (penawaran.nama_sales !== currentUser?.nama_user) {
              continue;
            }

            // Filter: hanya ambil data dengan status Menunggu atau Disetujui
            const status = penawaran.status?.toLowerCase();
            if (status === 'ditolak') {
              continue;
            }

            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const totalPerBulan = parseFloat(hasilResponse.data.total_per_bulan_harga_final_sebelum_ppn) || 0;
              
              if (totalPerBulan > 0) {
                totalPencapaian += totalPerBulan;
              }
            }
          } catch (error) {
            console.error(`Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        setNilaiPencapaian(totalPencapaian);
        return totalPencapaian;
      }
      return 0;
    } catch (error) {
      console.error('Error calculating pencapaian:', error);
      return 0;
    }
  };

  // Load revenue data function (keep your existing logic)
  const loadRevenueData = async () => {
    try {
      setIsLoading(true);
      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const salesRevenueMap = new Map();
        const monthlyRevenueMap = new Map();
        const monthlyPencapaianMap = new Map();
        const salesTargetMap = new Map();

        let totalRevenueAccumulated = 0;
        let totalPencapaianAccumulated = 0;

        for (const penawaran of response.data) {
          try {
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const profit = parseFloat(hasilResponse.data.profit_dari_hjt_excl_ppn) || 0;
              const totalPerBulan = parseFloat(hasilResponse.data.total_per_bulan_harga_final_sebelum_ppn) || 0;
              const status = penawaran.status?.toLowerCase();
              
              if (profit > 0) {
                // Target tetap dihitung untuk semua status (termasuk ditolak)
                totalRevenueAccumulated += profit;
                
                const salesPerson = penawaran.nama_sales || penawaran.sales_person || 'Sales';
                const dateString = penawaran.tanggal_dibuat || penawaran.created_at;
                const createdAt = dateString ? new Date(dateString) : new Date();
                const month = createdAt.getMonth();
                const monthKey = monthNames[month];
                
                const currentRevenue = salesRevenueMap.get(salesPerson) || 0;
                salesRevenueMap.set(salesPerson, currentRevenue + profit);
                
                const currentMonthlyRevenue = monthlyRevenueMap.get(monthKey) || 0;
                monthlyRevenueMap.set(monthKey, currentMonthlyRevenue + profit);
                
                if (!salesTargetMap.has(salesPerson)) {
                  salesTargetMap.set(salesPerson, profit * 1.2);
                }
                
                // Pencapaian hanya dihitung untuk status Menunggu dan Disetujui
                if (status !== 'ditolak' && totalPerBulan > 0) {
                  totalPencapaianAccumulated += totalPerBulan;
                  
                  const currentMonthlyPencapaian = monthlyPencapaianMap.get(monthKey) || 0;
                  monthlyPencapaianMap.set(monthKey, currentMonthlyPencapaian + totalPerBulan);
                }
              }
            }
          } catch (error) {
            console.error(`Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        setTotalRevenueFromProfit(totalRevenueAccumulated);
        setNilaiPencapaian(totalPencapaianAccumulated);

        const currentUser = getUserData();
        const userName = currentUser?.nama_user || currentUser?.name || 'Sales User';
        const userTargetNR = currentUser?.target_nr || null;

        const salesDataArray = [];
        
        if (totalRevenueAccumulated > 0 || totalPencapaianAccumulated > 0) {
          const target = userTargetNR && userTargetNR > 0 
            ? userTargetNR 
            : (totalRevenueAccumulated * 1.2);
          
          const targetFull = target;
          const growth = targetFull > 0 ? (totalPencapaianAccumulated / targetFull) * 100 : 0;
          const achievementRate = growth;
          const isAchieved = totalPencapaianAccumulated > 0 && totalPencapaianAccumulated >= targetFull;
          const lastMonth = totalPencapaianAccumulated * 0.9;
          const komisi = totalRevenueAccumulated * 0.1;
          const sisaTarget = Math.max(targetFull - totalPencapaianAccumulated, 0);

          salesDataArray.push({
            id: 1,
            nama: userName,
            penawaran: Math.round(totalRevenueAccumulated),
            pencapaian: Math.round(totalPencapaianAccumulated),
            target: Math.round(target),
            targetFull: Math.round(targetFull),
            komisi: Math.round(komisi),
            growth: parseFloat(growth.toFixed(1)),
            lastMonth: Math.round(lastMonth),
            achievement: parseFloat(achievementRate.toFixed(1)),
            isAchieved: isAchieved,
            sisaTarget: Math.round(sisaTarget)
          });
        }

        const monthlyDataArray = generateMonthlyData(monthlyRevenueMap, monthlyPencapaianMap, userTargetNR);
        
        setSalesData(salesDataArray);
        setMonthlyData(monthlyDataArray);
      } else {
        setTotalRevenueFromProfit(0);
        setNilaiPencapaian(0);
        setSalesData(fallbackSales);
        setMonthlyData(fallbackMonthly);
      }
    } catch (error) {
      console.error('Error loading revenue data:', error);
      setTotalRevenueFromProfit(0);
      setNilaiPencapaian(0);
      setSalesData(fallbackSales);
      setMonthlyData(fallbackMonthly);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Generate monthly data (keep your existing logic)
  const generateMonthlyData = (monthlyRevenueMap, monthlyPencapaianMap, userTargetNR) => {
    const monthlyData = [];
    
    for (let month = 0; month < 12; month++) {
      const monthKey = monthNames[month];
      const actualRevenue = monthlyRevenueMap.get(monthKey) || 0;
      const actualPencapaian = monthlyPencapaianMap.get(monthKey) || 0;
      const target = userTargetNR && userTargetNR > 0 ? userTargetNR : (actualRevenue * 1.15);
      const achievement = target > 0 ? (actualRevenue / target) * 100 : 0;
      const growth = month > 0 ? 
        ((actualRevenue - (monthlyData[month-1]?.revenue || actualRevenue * 0.9)) / (monthlyData[month-1]?.revenue || actualRevenue * 0.9)) * 100 
        : 0;

      monthlyData.push({
        month: month + 1,
        monthName: monthNames[month],
        revenue: Math.round(actualRevenue),
        pencapaian: Math.round(actualPencapaian),
        target: Math.round(target),
        achievement: parseFloat(achievement.toFixed(1)),
        growth: parseFloat(growth.toFixed(1))
      });
    }
    
    return monthlyData;
  };

  // Fetch sales data from API
  useEffect(() => {
    loadRevenueData();
  }, []);

  // Year fixed to 2025 — use all monthly data
  const filteredMonthlyData = monthlyData;

  // Calculate statistics
  const totalRevenue = totalRevenueFromProfit > 0 ? totalRevenueFromProfit : salesData.reduce((sum, sales) => sum + sales.penawaran, 0);
  const totalKomisi = salesData.reduce((sum, sales) => sum + sales.komisi, 0);
  const totalPencapaian = nilaiPencapaian > 0 ? nilaiPencapaian : salesData.reduce((sum, sales) => sum + (sales.pencapaian || 0), 0);
  const achievementRate = salesData.length > 0 && salesData[0].target > 0 ? (totalPencapaian / salesData[0].target) * 100 : 0;  
  const averageGrowth = salesData.length > 0 ? salesData.reduce((sum, sales) => sum + (sales.growth || 0), 0) / salesData.length : 0;

  // Data untuk chart performa bulanan
  const monthlyPerformanceData = filteredMonthlyData.map(item => ({
    name: item.monthName,
    revenue: item.revenue,
    pencapaian: item.pencapaian || 0,
    target: item.target,
    achievement: item.achievement,
    growth: item.growth
  }));

  const formatNumber = (num) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID') ;
  };

  const formatPercent = (num) => {
    return `${num.toFixed(1)}%`;
  };

  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: colors.white,
          padding: '16px',
          border: `2px solid ${colors.primary}`,
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(3, 91, 113, 0.2)',
          fontSize: '14px',
          color: colors.primary,
          minWidth: '200px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '16px', color: colors.primary }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: entry.color, fontWeight: '600', fontSize: '14px' }}>
                {entry.name}:
              </span>
              <span style={{ color: entry.color, fontWeight: 'bold', marginLeft: '12px', fontSize: '14px' }}>
                {formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setActiveChart('performance');
    loadRevenueData();
  };

  const chartTabs = [
    { id: 'performance', label: 'Performa', icon: BarChart3 }
  ];

  const stats = [
    {
      title: 'Target',
      value: formatNumber(salesData && salesData.length > 0 ? salesData[0].target : 0),
      icon: Target,
      color: colors.primary,
      gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`
    },
    {
      title: 'Pencapaian Target',
      value: formatNumber(totalPencapaian),
      icon: Award,
      color: colors.secondary,
      gradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`
    },
    {
      title: 'Progress ke Target',
      value: `${averageGrowth.toFixed(1)}%`,
      icon: averageGrowth >= 100 ? Award : (averageGrowth > 0 ? TrendingUp : TrendingDown),
      color: averageGrowth >= 100 ? colors.success : (averageGrowth > 0 ? colors.warning : colors.danger),
      gradient: averageGrowth >= 100
        ? `linear-gradient(135deg, ${colors.success} 0%, #10b981 100%)`
        : averageGrowth > 0 
          ? `linear-gradient(135deg, ${colors.warning} 0%, #fbbf24 100%)`
          : `linear-gradient(135deg, ${colors.danger} 0%, #f87171 100%)`
    },
    {
      title: 'Sisa Target',
      value: formatNumber(Math.max((salesData && salesData.length > 0 ? salesData[0].target : 0) - totalPencapaian, 0)),
      icon: DollarSign,
      color: colors.accent1,
      gradient: `linear-gradient(135deg, ${colors.accent1} 0%, ${colors.accent2} 100%)`
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#e7f3f5ff',
      padding: '60px 48px 10px 48px'
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
        maxWidth: '1800px',
        margin: '0 auto'
      }}>

        {/* Header Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: 'linear-gradient(135deg, #035b71 0%, #00a2b9 100%)',
                borderRadius: '24px',
                padding: '32px',
                color: 'white',
                boxShadow: '0 25px 50px rgba(3, 91, 113, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                animation: 'glow 3s ease-in-out infinite'
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={(e) => {
                e.currentTarget.style.boxShadow = '0 35px 60px rgba(3, 91, 113, 0.3)';
              }}
              onHoverEnd={(e) => {
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(3, 91, 113, 0.2)';
              }}
            >
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
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '14px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <stat.icon style={{ width: '24px', height: '24px' }} />
                    </div>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      opacity: '0.9'
                    }}>{stat.title}</span>
                  </div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {stat.value}
                  </div>
                </div>
                <div style={{
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: `${index * 0.5}s`
                }}>
                  <stat.icon style={{ width: '48px', height: '48px', opacity: '0.8' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter and Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 25px 50px rgba(3, 91, 113, 0.1)',
            border: '1px solid rgba(3, 91, 113, 0.1)',
            marginBottom: '40px',
            transition: 'all 0.3s ease'
          }}
          whileHover={{ y: -4 }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              {/* Chart Type Tabs */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: '12px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  Jenis Grafik
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {chartTabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveChart(tab.id)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '14px',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        background: activeChart === tab.id 
                          ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                          : 'rgba(3, 91, 113, 0.1)',
                        color: activeChart === tab.id ? colors.white : colors.primary,
                        boxShadow: activeChart === tab.id 
                          ? `0 8px 25px ${colors.primary}30`
                          : 'none'
                      }}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Chart Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '40px',
          marginBottom: '40px'
        }}>
          
          {/* Full Width Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              background: 'white',
              borderRadius: '28px',
              padding: '40px',
              boxShadow: '0 25px 50px rgba(3, 91, 113, 0.1)',
              border: '1px solid rgba(3, 91, 113, 0.1)',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ y: -6 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: colors.primary,
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  padding: '14px 14px 10px 14px',
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                  borderRadius: '16px',
                  color: 'white'
                }}>
                  <BarChart3 size={24} />
                </div>
                Performa Anda
              </h3>
              <div style={{
                padding: '12px 20px',
                background: 'rgba(3, 91, 113, 0.1)',
                borderRadius: '16px',
                border: `1px solid ${colors.primary}30`,
                fontSize: '14px',
                fontWeight: '600',
                color: colors.primary
              }}>
                Real-time
              </div>
            </div>
            
            <div style={{ height: '480px' }}>
              {isLoading ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    border: `5px solid ${colors.primary}20`,
                    borderTop: `5px solid ${colors.primary}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <p style={{
                    color: colors.primary,
                    fontWeight: '600',
                    fontSize: '18px'
                  }}>
                    Memuat data performa...
                  </p>
                </div>
              ) : filteredMonthlyData.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  gap: '20px'
                }}>
                  <TrendingUp size={80} color={colors.primary} opacity={0.3} />
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: colors.primary,
                    textAlign: 'center',
                    opacity: 0.7
                  }}>
                    Tidak Ada Data Performa
                  </div>
                  <div style={{
                    fontSize: '16px',
                    color: colors.primary,
                    textAlign: 'center',
                    maxWidth: '400px',
                    opacity: 0.5
                  }}>
                    Belum ada data performa untuk tahun 2025
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart 
                    data={monthlyPerformanceData}
                    margin={{ top: 25, right: 35, left: 45, bottom: 70 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="rgba(3, 91, 113, 0.1)" 
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 14, fill: colors.primary, fontWeight: '600' }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 14, fill: colors.primary, fontWeight: '600' }}
                      tickFormatter={formatNumber}
                      width={120}
                    />
                    <Tooltip content={renderCustomTooltip} />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: '25px', 
                        fontSize: '15px',
                        fontWeight: '600'
                      }}
                      iconType="rect"
                      iconSize={14}
                    />
                    <Bar 
                      dataKey="pencapaian" 
                      fill={colors.warning}
                      name="Pencapaian"
                      radius={[10, 10, 0, 0]}
                      barSize={28}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill={colors.primary}
                      name="Revenue"
                      radius={[10, 10, 0, 0]}
                      barSize={28}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke={colors.secondary}
                      strokeWidth={4}
                      dot={{ fill: colors.secondary, strokeWidth: 2, r: 6 }}
                      strokeDasharray="5 5"
                      name="Target"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>

        {/* Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(3, 91, 113, 0.1)',
            border: '1px solid rgba(3, 91, 113, 0.1)',
            transition: 'all 0.3s ease'
          }}
          whileHover={{ y: -4 }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: colors.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{
                padding: '14px 14px 10px 14px',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                borderRadius: '16px',
                color: 'white'
              }}>
                <Users size={24} />
              </div>
              Data Performa Sales
            </h3>
            
            <div style={{
              padding: '12px 20px',
              background: 'rgba(3, 91, 113, 0.1)',
              borderRadius: '16px',
              border: `1px solid ${colors.primary}30`,
              fontSize: '14px',
              fontWeight: '600',
              color: colors.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Users size={16} />
              {salesData.length} Sales
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {salesData.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '60px 20px',
                gap: '20px'
              }}>
                <Users size={80} color={colors.primary} opacity={0.3} />
                <div style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: colors.primary,
                  textAlign: 'center',
                  opacity: 0.7
                }}>
                  Tidak Ada Data Sales
                </div>
                <div style={{
                  fontSize: '16px',
                  color: colors.primary,
                  textAlign: 'center',
                  maxWidth: '400px',
                  opacity: 0.5
                }}>
                  Belum ada data performa sales untuk ditampilkan
                </div>
              </div>
            ) : (
              <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{
                    background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.tertiary}10 100%)`
                  }}>
                    {[
                      { label: 'Nama Sales', align: 'left' },
                      { label: 'Revenue', align: 'center' },
                      { label: 'Target', align: 'center' },
                      { label: 'Pencapaian', align: 'center' },
                      { label: 'Sisa Target', align: 'center' },
                      { label: 'Growth', align: 'center' },
                      { label: 'Status', align: 'center' }
                    ].map((header, index) => (
                      <th key={index} style={{
                        padding: '20px 16px',
                        textAlign: header.align,
                        fontSize: '15px',
                        fontWeight: '800',
                        color: colors.primary,
                        borderBottom: `3px solid ${colors.primary}`,
                        background: index === 0 ? `${colors.primary}08` : 'transparent'
                      }}>
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((sales, index) => (
                    <motion.tr 
                      key={sales.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      style={{
                        background: index % 2 === 0 
                          ? `linear-gradient(135deg, ${colors.white} 0%, ${colors.light}30 100%)`
                          : colors.white,
                        transition: 'all 0.3s ease'
                      }}
                      whileHover={{ 
                        background: `linear-gradient(135deg, ${colors.secondary}10 0%, ${colors.primary}05 100%)`,
                        scale: 1.01
                      }}
                    >
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '15px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `1px solid ${colors.light}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '700',
                            boxShadow: '0 8px 20px rgba(3, 91, 113, 0.2)'
                          }}>
                            {sales.nama.charAt(0)}
                          </div>
                          {sales.nama}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '15px',
                        fontWeight: '700',
                        color: colors.primary,
                        borderBottom: `1px solid ${colors.light}`,
                        textAlign: 'center'
                      }}>
                        {formatNumber(sales.penawaran)}
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: colors.primary,
                        borderBottom: `1px solid ${colors.light}`,
                        textAlign: 'center'
                      }}>
                        {formatNumber(sales.target)}
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '15px',
                        fontWeight: '700',
                        borderBottom: `1px solid ${colors.light}`,
                        textAlign: 'center'
                      }}>
                        <div style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: (sales.pencapaian >= sales.target) ? colors.success : colors.warning,
                          background: (sales.pencapaian >= sales.target) ? `${colors.success}20` : `${colors.warning}20`,
                          border: `2px solid ${(sales.pencapaian >= sales.target) ? colors.success : colors.warning}30`,
                          display: 'inline-block'
                        }}>
                          {formatNumber(sales.pencapaian || 0)}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '15px',
                        fontWeight: '700',
                        borderBottom: `1px solid ${colors.light}`,
                        textAlign: 'center'
                      }}>
                        <div style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: sales.sisaTarget <= 0 ? colors.success : colors.danger,
                          background: sales.sisaTarget <= 0 ? `${colors.success}20` : `${colors.danger}20`,
                          border: `2px solid ${sales.sisaTarget <= 0 ? colors.success : colors.danger}30`,
                          display: 'inline-block'
                        }}>
                          {formatNumber(sales.sisaTarget || 0)}
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '15px',
                        fontWeight: '700',
                        borderBottom: `1px solid ${colors.light}`,
                        textAlign: 'center'
                      }}>
                        <div style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: (sales.growth || 0) >= 100 ? colors.success : (sales.growth || 0) > 0 ? colors.warning : colors.danger,
                          background: (sales.growth || 0) >= 100 ? `${colors.success}20` : (sales.growth || 0) > 0 ? `${colors.warning}20` : `${colors.danger}20`,
                          border: `2px solid ${(sales.growth || 0) >= 100 ? colors.success : (sales.growth || 0) > 0 ? colors.warning : colors.danger}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}>
                          {(sales.growth || 0) >= 100 ? <Award size={14} /> : (sales.growth || 0) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {(sales.growth || 0).toFixed(1)}%
                        </div>
                      </td>
                      <td style={{
                        padding: '20px 16px',
                        fontSize: '15px',
                        fontWeight: '700',
                        borderBottom: `1px solid ${colors.light}`,
                        textAlign: 'center'
                      }}>
                        <span style={{
                          padding: '10px 20px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '800',
                          backgroundColor: sales.isAchieved 
                            ? `${colors.success}25` 
                            : `${colors.warning}25`,
                          color: sales.isAchieved 
                            ? colors.success 
                            : colors.warning,
                          border: `2px solid ${sales.isAchieved 
                            ? colors.success 
                            : colors.warning}40`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          {sales.isAchieved ? <Award size={16} /> : <Target size={16} />}
                          {sales.isAchieved ? 'Tercapai' : 'Belum Tercapai'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        color: colors.primary,
        fontSize: '14px',
        opacity: 0.7,
        marginTop: '40px'
      }}>
        © {new Date().getFullYear()} PLN Icon Plus • Financial Network Feasibility System 
      </div>
    </div>
  );
};

export default LaporanLaba;