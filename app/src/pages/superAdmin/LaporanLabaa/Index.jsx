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
import { adminAPI, penawaranAPI } from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const LaporanLaba = () => {
  const [selectedYearSales, setSelectedYearSales] = useState('2025');
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('performance');
  const [totalSalesCount, setTotalSalesCount] = useState(0);
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

  // Fetch sales data from API
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 [SUPER ADMIN LAPORAN LABA] Starting to fetch all sales data...');
        
        // Step 1: Fetch all sales users from database
        const salesUsersResponse = await adminAPI.getUsersByRole('sales');
        
        if (!salesUsersResponse.success || !salesUsersResponse.data || salesUsersResponse.data.length === 0) {
          console.warn('⚠️ [SUPER ADMIN LAPORAN LABA] No sales users found');
          setTotalSalesCount(0);
          setSalesData([]);
          setIsLoading(false);
          return;
        }

        const salesUsers = salesUsersResponse.data;
        const salesCount = salesUsers.length;
        setTotalSalesCount(salesCount);
        
        console.log('✅ [SUPER ADMIN LAPORAN LABA] Found', salesCount, 'sales users');
        console.log('📊 [SUPER ADMIN LAPORAN LABA] Sales users:', salesUsers);

        // Step 2: Get all penawaran
        const penawaranResponse = await penawaranAPI.getAll();
        
        if (!penawaranResponse.success || !penawaranResponse.data) {
          console.warn('⚠️ [SUPER ADMIN LAPORAN LABA] No penawaran data found');
          setSalesData([]);
          setIsLoading(false);
          return;
        }

        console.log(`📊 [SUPER ADMIN LAPORAN LABA] Processing ${penawaranResponse.data.length} penawaran`);

        // Step 3: Create a map to accumulate data per sales
        const salesDataMap = new Map();

        // Initialize map with all sales users
        salesUsers.forEach(user => {
          salesDataMap.set(user.id_user, {
            id: user.id_user,
            nama: user.nama_user,
            target: parseFloat(user.target_nr) || 0,
            totalRevenue: 0,
            totalPencapaian: 0,
            penawaranCount: 0
          });
        });

        // Step 4: Process each penawaran and accumulate data
        for (const penawaran of penawaranResponse.data) {
          try {
            const salesId = penawaran.id_user;
            
            if (!salesDataMap.has(salesId)) {
              console.log(`⚠️ [SUPER ADMIN LAPORAN LABA] Penawaran ${penawaran.id_penawaran} belongs to non-sales user ${salesId}, skipping`);
              continue;
            }

            // Get hasil for this penawaran
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const profit = parseFloat(hasilResponse.data.profit_dari_hjt_excl_ppn) || 0;
              const pencapaian = parseFloat(hasilResponse.data.total_per_bulan_harga_final_sebelum_ppn) || 0;
              const status = penawaran.status?.toLowerCase();

              console.log(`💰 [SUPER ADMIN LAPORAN LABA] Penawaran ${penawaran.id_penawaran} (Sales ID: ${salesId}):`);
              console.log(`   - Status: ${status}`);
              console.log(`   - Revenue (profit): Rp ${profit.toLocaleString('id-ID')}`);
              console.log(`   - Pencapaian: Rp ${pencapaian.toLocaleString('id-ID')}`);

              const salesData = salesDataMap.get(salesId);
              
              // Revenue dan Pencapaian hanya dihitung untuk status Menunggu dan Disetujui
              if (status !== 'ditolak') {
                salesData.totalRevenue += profit;
                salesData.penawaranCount += 1;
                
                if (pencapaian > 0) {
                  salesData.totalPencapaian += pencapaian;
                }
                console.log(`   ✅ Revenue dan Pencapaian dihitung (status: ${status})`);
              } else {
                console.log(`   ❌ Revenue dan Pencapaian tidak dihitung (status: ditolak)`);
              }

              salesDataMap.set(salesId, salesData);
            }
          } catch (error) {
            console.error(`❌ [SUPER ADMIN LAPORAN LABA] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        // Step 5: Convert map to array and calculate growth/status
        const salesDataArray = [];
        
        salesDataMap.forEach((data, salesId) => {
          const target = data.target;
          const pencapaian = data.totalPencapaian;
          const revenue = data.totalRevenue;

          // NEW LOGIC: Target tercapai jika Pencapaian >= Target (1x)
          const targetMultiplier = 1; // sekarang menggunakan 1x target
          const targetFull = target * targetMultiplier; // Target × 1 (sama dengan Target)

          // Growth calculation: percentage toward target (1x)
          // Growth 100% ketika pencapaian sama dengan target
          const growth = targetFull > 0 ? (pencapaian / targetFull) * 100 : 0;

          // Status: Tercapai jika Pencapaian >= Target
          // IMPORTANT: If no data at all (pencapaian = 0), status should be "Belum Tercapai"
          const isAchieved = pencapaian > 0 && pencapaian >= targetFull;

          const komisi = revenue * 0.1; // 10% commission

          console.log(`🎯 [SUPER ADMIN LAPORAN LABA] Sales: ${data.nama}`);
          console.log(`   - Target: Rp ${target.toLocaleString('id-ID')}`);
          console.log(`   - Target Full (1x): Rp ${targetFull.toLocaleString('id-ID')}`);
          console.log(`   - Revenue: Rp ${revenue.toLocaleString('id-ID')}`);
          console.log(`   - Pencapaian: Rp ${pencapaian.toLocaleString('id-ID')}`);
          console.log(`   - Growth (to target): ${growth.toFixed(1)}%`);
          console.log(`   - Status: ${isAchieved ? 'TERCAPAI' : 'BELUM TERCAPAI'}`);
          console.log(`   - Penawaran count: ${data.penawaranCount}`);

          salesDataArray.push({
            id: salesId,
            nama: data.nama,
            penawaran: Math.round(revenue), // Revenue from profit_dari_hjt_excl_ppn
            pencapaian: Math.round(pencapaian), // From total_per_bulan_harga_final_sebelum_ppn
            target: Math.round(target), // From data_user.target_nr
            targetFull: Math.round(targetFull), // Target × 1 (same as target)
            komisi: Math.round(komisi),
            growth: parseFloat(growth.toFixed(1)), // Progress to target
            lastMonth: 0, // Set to 0 as we don't have separate historical data for previous year
            achievement: parseFloat(growth.toFixed(1)),
            isAchieved: isAchieved, // Status tercapai atau belum
            penawaranCount: data.penawaranCount,
            sisaTarget: Math.max(targetFull - pencapaian, 0)
          });
        });

        console.log('✅ [SUPER ADMIN LAPORAN LABA] Final sales data:', salesDataArray);
        console.log('📊 [SUPER ADMIN LAPORAN LABA] Total sales with data:', salesDataArray.length);

        setSalesData(salesDataArray);
      } catch (error) {
        console.error("❌ [SUPER ADMIN LAPORAN LABA] Error fetching sales data:", error);
        setTotalSalesCount(0);
        setSalesData([]);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchSalesData();
  }, []);

  // Data untuk berbagai chart - UPDATED: Use real data from salesData
  const salesPerformanceByYear = {
    '2023': [], // Tidak ada data penawaran di tahun 2023
    '2024': [], // Tidak ada data penawaran di tahun 2024
    '2025': salesData.map(sales => ({
      name: sales.nama,
      penawaran: sales.penawaran,        // ✅ Real Revenue from profit_dari_hjt_excl_ppn
      pencapaian: sales.pencapaian || 0,  // ✅ Real Pencapaian from total_per_bulan_harga_final_sebelum_ppn
      target: sales.target,               // ✅ Real Target from data_user.target_nr
      komisi: sales.komisi,
      // Achievement now computed from pencapaian vs target (1x)
      achievement: sales.target > 0 ? (sales.pencapaian / sales.target) * 100 : 0,
      growth: sales.growth || 0,
      lastMonth: sales.lastMonth || 0
    }))
  };

  // Data untuk growth comparison chart - hanya untuk tahun 2025
  const growthData = selectedYearSales === '2025' ? salesData.map(sales => ({
    name: sales.nama,
    current: sales.penawaran,
    previous: sales.lastMonth,
    growth: sales.growth
  })) : [];

  // Data untuk donut chart distribusi penawaran - hanya untuk tahun 2025
  const distributionData = selectedYearSales === '2025' ? salesData.map((sales, index) => ({
    name: sales.nama,
    value: sales.penawaran,
    color: [colors.primary, colors.secondary, colors.success, colors.warning, colors.accent1, colors.tertiary][index % 6]
  })) : [];

  // Hitung statistik - hanya untuk tahun yang memiliki data (2025)
  const currentYearData = salesPerformanceByYear[selectedYearSales] || [];
  
  // totalSalesCount now comes from state (fetched from API)
  const totalRevenue = selectedYearSales === '2025' 
    ? salesData.reduce((sum, sales) => sum + sales.penawaran, 0)
    : 0;
    
  const totalKomisi = selectedYearSales === '2025'
    ? salesData.reduce((sum, sales) => sum + sales.komisi, 0)
    : 0;
  
  // NEW: Total Pencapaian from all sales (sum of total_per_bulan_harga_final_sebelum_ppn)
  const totalPencapaian = selectedYearSales === '2025'
    ? salesData.reduce((sum, sales) => sum + (sales.pencapaian || 0), 0)
    : 0;
  
  // NEW: Achievement rate based on target (1x)
  // Status tercapai jika Pencapaian >= Target
  const achievementRate = selectedYearSales === '2025' && salesData.length > 0 
    ? (salesData.filter(sales => sales.isAchieved).length / salesData.length) * 100 
    : 0;
  
  // NEW: Average Growth from all sales
  const averageGrowth = selectedYearSales === '2025' && salesData.length > 0
    ? salesData.reduce((sum, sales) => sum + (sales.growth || 0), 0) / salesData.length
    : 0;

  const formatNumber = (num) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
  };

  const formatCount = (num) => {
    return num.toString();
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
                {entry.name === 'penawaran' ? 'Revenue' : 
                 entry.name === 'pencapaian' ? 'Pencapaian' :
                 entry.name === 'target' ? 'Target' :
                 entry.name === 'komisi' ? 'Komisi' :
                 entry.name === 'achievement' ? 'Pencapaian' :
                 entry.name === 'growth' ? 'Growth' :
                 entry.name === 'current' ? 'Tahun Ini' :
                 entry.name === 'previous' ? 'Tahun Lalu' :
                 entry.name}:
              </span>
              <span style={{ color: entry.color, fontWeight: 'bold', marginLeft: '12px', fontSize: '14px' }}>
                {entry.name === 'achievement' || entry.name === 'growth' || entry.dataKey === 'growth' ? 
                  `${entry.value.toFixed(1)}%` : 
                  formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalRevenue) * 100).toFixed(1);
      return (
        <div style={{
          backgroundColor: colors.white,
          padding: '16px',
          border: `2px solid ${colors.primary}`,
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(3, 91, 113, 0.2)',
          fontSize: '14px',
          color: colors.primary,
          minWidth: '180px'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px', color: colors.primary }}>{data.name}</p>
          <p style={{ fontWeight: '600', margin: 0 }}>
            {formatNumber(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSelectedYearSales('2025');
    setActiveChart('performance');
  };

  const chartTabs = [
    { id: 'performance', label: 'Performa', icon: BarChart3 },
    { id: 'growth', label: 'Pertumbuhan', icon: TrendingUp },
    { id: 'distribution', label: 'Distribusi', icon: Activity }
  ];

  const stats = [
    {
      title: 'Total Sales',
      value: formatCount(totalSalesCount),
      icon: UserCheck,
      color: colors.primary,
      gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`
    },
    {
      title: 'Total Revenue',
      value: formatNumber(totalRevenue),
      icon: DollarSign,
      color: colors.secondary,
      gradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`
    },
    {
      title: 'Pencapaian Target',
      value: formatNumber(totalPencapaian),
      icon: Target,
      color: colors.success,
      gradient: `linear-gradient(135deg, ${colors.success} 0%, #10b981 100%)`
    },
    {
      title: 'Rata-rata Growth',
      value: `${averageGrowth > 0 ? '+' : ''}${averageGrowth.toFixed(1)}%`,
      icon: averageGrowth > 0 ? TrendingUp : TrendingDown,
      color: averageGrowth > 0 ? colors.success : colors.danger,
      gradient: averageGrowth > 0 
        ? `linear-gradient(135deg, ${colors.success} 0%, #10b981 100%)`
        : `linear-gradient(135deg, ${colors.danger} 0%, #f87171 100%)`
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

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                color: 'white',
                padding: '16px 20px',
                borderRadius: '14px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: `0 8px 25px ${colors.primary}30`,
                height: '56px',
                paddingTop: '20px',
                marginTop: '35px'
              }}
            >
              <RotateCcw size={18} />
            </motion.button>
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
                  {chartTabs.find(tab => tab.id === activeChart)?.icon && 
                    React.createElement(chartTabs.find(tab => tab.id === activeChart).icon, { size: 24 })}
                </div>
                {activeChart === 'performance' && 'Analisis Performa Sales'}
                {activeChart === 'growth' && 'Analisis Pertumbuhan'}
                {activeChart === 'distribution' && 'Distribusi Penawaran'}
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
              ) : currentYearData.length === 0 ? (
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
                    Tidak Ada Data Penawaran
                  </div>
                </div>
              ) : (
                <>
                  {activeChart === 'performance' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart 
                        data={salesPerformanceByYear[selectedYearSales]}
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
                          dataKey="penawaran" 
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

                  {activeChart === 'growth' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart 
                        data={growthData}
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
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 14, fill: colors.warning, fontWeight: '600' }}
                          tickFormatter={(value) => `${value.toFixed(0)}%`}
                          width={80}
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
                          dataKey="current" 
                          fill={colors.primary}
                          name="Tahun Ini"
                          radius={[10, 10, 0, 0]}
                          barSize={28}
                        />
                        <Bar 
                          dataKey="previous" 
                          fill={colors.tertiary}
                          name="Tahun Lalu"
                          radius={[10, 10, 0, 0]}
                          barSize={28}
                        />
                        <Line 
                          type="monotone"
                          dataKey="growth"
                          stroke={colors.warning}
                          strokeWidth={4}
                          name="Growth (%)"
                          yAxisId="right"
                          dot={{ fill: colors.success, strokeWidth: 2, r: 6 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}

                  {activeChart === 'distribution' && (
                    <div style={{ display: 'flex', height: '100%', gap: '40px', alignItems: 'center' }}>
                      <div style={{ 
                        flex: 1, 
                        height: '100%', 
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={distributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={100}
                              outerRadius={180}
                              paddingAngle={3}
                              dataKey="value"
                              stroke="#fff"
                              strokeWidth={2}
                            >
                              {distributionData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.color}
                                  style={{
                                    filter: `drop-shadow(0 4px 8px ${entry.color}40)`,
                                    transition: 'all 0.3s ease'
                                  }}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={renderPieTooltip} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                        {/* Center Label */}
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          textAlign: 'center',
                          pointerEvents: 'none'
                        }}>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: '800',
                            color: colors.primary,
                            marginBottom: '4px'
                          }}>
                            {formatNumber(totalRevenue)}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: colors.primary,
                            fontWeight: '600',
                            opacity: '0.7'
                          }}>
                            Total Penawaran
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        flex: 1, 
                        paddingLeft: '20px',
                        maxHeight: '100%',
                        overflowY: 'auto'
                      }}>
                        <h4 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: colors.primary,
                          marginBottom: '20px'
                        }}>
                          Detail Distribusi
                        </h4>
                        {distributionData.map((item, index) => (
                          <motion.div 
                            key={index}
                            whileHover={{ x: 8 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '16px 20px',
                              marginBottom: '12px',
                              background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)`,
                              borderRadius: '12px',
                              border: `2px solid ${item.color}30`,
                              transition: 'all 0.3s ease',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{
                                width: '16px',
                                height: '16px',
                                backgroundColor: item.color,
                                borderRadius: '50%',
                                boxShadow: `0 4px 12px ${item.color}40`
                              }} />
                              <span style={{
                                fontSize: '15px',
                                fontWeight: '700',
                                color: colors.primary
                              }}>
                                {item.name}
                              </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{
                                fontSize: '18px',
                                fontWeight: '800',
                                color: colors.primary
                              }}>
                                {formatNumber(item.value)}
                              </div>
                              <div style={{
                                fontSize: '13px',
                                color: colors.primary,
                                fontWeight: '600',
                                opacity: '0.7'
                              }}>
                                {((item.value / totalRevenue) * 100).toFixed(1)}% dari total
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
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
            {currentYearData.length === 0 ? (
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
                  Tidak Ada Data Performa Sales
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