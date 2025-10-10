import React, { useState, useEffect } from 'react';
import { CircleDollarSign, TrendingUp, Users, Calendar, Filter, RotateCcw, DollarSign, UserCheck, Target, TrendingDown, Award, BarChart3, Activity } from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Legend,
  ReferenceLine
} from 'recharts';
import { penawaranAPI, getUserData } from '../../utils/api';

const LaporanLaba = () => {
  const [selectedYearSales, setSelectedYearSales] = useState('2024');
  const [salesData, setSalesData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('performance');
  const [totalRevenueFromProfit, setTotalRevenueFromProfit] = useState(0); // NEW: State for real total revenue

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
    warning: '#f59e0b',
    danger: '#ef4444',
    light: '#cbebea',
    white: '#ffffff',
    gray50: '#f8fafc',
    gray100: '#f1f5f9',
    gray200: '#e2e8f0',
    gray300: '#cbd5e1',
    gray400: '#94a3b8',
    gray500: '#64748b',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1e293b',
    gray900: '#0f172a',
    gradient1: '#667eea',
    gradient2: '#764ba2',
    gradient3: '#f093fb',
    gradient4: '#f5576c'
  };

  // Month names in Indonesian
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Function to load real revenue data from profit_dari_hjt_excl_ppn
  const loadRevenueData = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 [LAPORAN LABA] Loading revenue data for sales performance...');

      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`📊 [LAPORAN LABA] Processing ${response.data.length} penawaran for sales performance`);

        // Create maps to accumulate revenue by sales person and by month
        const salesRevenueMap = new Map();
        const monthlyRevenueMap = new Map();
        const salesTargetMap = new Map();

        let processedCount = 0;
        let totalRevenueAccumulated = 0; // NEW: Accumulate total revenue from all penawaran

        // Process each penawaran
        for (const penawaran of response.data) {
          try {
            console.log(`🔍 [LAPORAN LABA] Processing penawaran ${penawaran.id_penawaran}...`);
            
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const profit = parseFloat(hasilResponse.data.profit_dari_hjt_excl_ppn) || 0;
              
              if (profit > 0) {
                console.log(`💰 [LAPORAN LABA] Found profit: Rp ${profit.toLocaleString('id-ID')} for penawaran ${penawaran.id_penawaran}`);
                
                // NEW: Accumulate total revenue
                totalRevenueAccumulated += profit;
                
                // Get sales person name
                const salesPerson = penawaran.nama_sales || penawaran.sales_person || 'Sales ' + (processedCount + 1);
                
                // Get month from tanggal_dibuat or created_at or use current month as fallback
                const dateString = penawaran.tanggal_dibuat || penawaran.created_at;
                const createdAt = dateString ? new Date(dateString) : new Date();
                const month = createdAt.getMonth() + 1; // 1-12
                const monthKey = `${createdAt.getFullYear()}-${month.toString().padStart(2, '0')}`;
                
                console.log(`📅 [LAPORAN LABA] Date: ${dateString}, Month: ${month}, MonthKey: ${monthKey}`);
                
                // Accumulate revenue for this sales person
                const currentRevenue = salesRevenueMap.get(salesPerson) || 0;
                salesRevenueMap.set(salesPerson, currentRevenue + profit);
                
                // Accumulate revenue for this month
                const currentMonthlyRevenue = monthlyRevenueMap.get(monthKey) || 0;
                monthlyRevenueMap.set(monthKey, currentMonthlyRevenue + profit);
                
                // Set target
                if (!salesTargetMap.has(salesPerson)) {
                  salesTargetMap.set(salesPerson, profit * 1.2);
                }
                
                processedCount++;
              } else {
                console.log(`⚠️ [LAPORAN LABA] Zero or no profit found for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`⚠️ [LAPORAN LABA] No hasil data for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (error) {
            console.error(`❌ [LAPORAN LABA] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        console.log('💰 [LAPORAN LABA] ===== REVENUE CALCULATION COMPLETE =====');
        console.log(`💰 [LAPORAN LABA] Total Revenue from all penawaran: Rp ${totalRevenueAccumulated.toLocaleString('id-ID')}`);
        console.log(`📊 [LAPORAN LABA] Processed ${processedCount} penawaran with profit data`);
        
        // NEW: Set total revenue state
        setTotalRevenueFromProfit(totalRevenueAccumulated);

        // UPDATED: Create single aggregated sales data entry with logged-in user name
        const salesDataArray = [];
        
        if (totalRevenueAccumulated > 0) {
          // Get logged-in user data
          const currentUser = getUserData();
          const userName = currentUser?.nama_user || currentUser?.name || 'Sales User';
          const userTargetNR = currentUser?.target_nr || null; // Get target_nr from user data
          
          console.log('👤 [LAPORAN LABA] Logged-in user:', userName);
          console.log('🎯 [LAPORAN LABA] User Target NR from database:', userTargetNR);
          
          // Use target from database if available, otherwise calculate default
          const target = userTargetNR || (totalRevenueAccumulated * 1.2);
          const achievementRate = (totalRevenueAccumulated / target) * 100;
          const growth = Math.random() * 30 - 10; // Random growth for demo
          const lastMonth = totalRevenueAccumulated * (1 - growth / 100);
          const komisi = totalRevenueAccumulated * 0.1;

          salesDataArray.push({
            id: 1,
            nama: userName, // Use logged-in user's name from data_user.nama_user
            penawaran: Math.round(totalRevenueAccumulated),
            target: Math.round(target), // Use target from database (data_user.target_nr)
            komisi: Math.round(komisi),
            growth: parseFloat(growth.toFixed(1)),
            lastMonth: Math.round(lastMonth),
            achievement: parseFloat(achievementRate.toFixed(1))
          });
        }

        // Convert monthly data to array and fill missing months
        const monthlyDataArray = generateMonthlyData(monthlyRevenueMap);

        console.log('📊 [LAPORAN LABA] Final sales performance summary:');
        console.log('  - Sales data entries:', salesDataArray.length);
        console.log('  - Total revenue from salesData:', salesDataArray.reduce((sum, sales) => sum + sales.penawaran, 0).toLocaleString('id-ID'));
        console.log('  - Monthly data points:', monthlyDataArray.length);
        
        setSalesData(salesDataArray);
        setMonthlyData(monthlyDataArray);
      } else {
        console.log('❌ [LAPORAN LABA] No valid penawaran data received');
        setTotalRevenueFromProfit(0);
        const { salesData: fallbackSales, monthlyData: fallbackMonthly } = generateFallbackData();
        setSalesData(fallbackSales);
        setMonthlyData(fallbackMonthly);
      }
    } catch (error) {
      console.error('❌ [LAPORAN LABA] Error loading revenue data:', error);
      setTotalRevenueFromProfit(0);
      const { salesData: fallbackSales, monthlyData: fallbackMonthly } = generateFallbackData();
      setSalesData(fallbackSales);
      setMonthlyData(fallbackMonthly);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate monthly data with realistic trends
  const generateMonthlyData = (monthlyRevenueMap) => {
    const currentYear = new Date().getFullYear();
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      const monthKey = `${currentYear}-${month.toString().padStart(2, '0')}`;
      const actualRevenue = monthlyRevenueMap.get(monthKey) || 0;
      
      // Generate realistic data with seasonal trends
      let baseRevenue = actualRevenue || Math.random() * 50000 + 10000;
      
      // Apply seasonal factors
      if (month === 1) baseRevenue *= 0.8;  // January dip
      if (month === 6) baseRevenue *= 1.3;  // June peak
      if (month === 12) baseRevenue *= 1.4; // December peak
      
      const target = baseRevenue * 1.15;
      const achievement = (baseRevenue / target) * 100;
      const growth = month > 1 ? 
        ((baseRevenue - (monthlyData[month-2]?.revenue || baseRevenue * 0.9)) / (monthlyData[month-2]?.revenue || baseRevenue * 0.9)) * 100 
        : 0;

      monthlyData.push({
        month: month,
        monthName: monthNames[month - 1],
        revenue: Math.round(baseRevenue),
        target: Math.round(target),
        achievement: parseFloat(achievement.toFixed(1)),
        growth: parseFloat(growth.toFixed(1))
      });
    }
    
    return monthlyData;
  };

  // Generate fallback data dengan data bulanan
  const generateFallbackData = () => {
    const salesData = [
      { id: 1, nama: 'Avgui', penawaran: 28000, target: 25000, komisi: 2800, growth: 15, lastMonth: 24350 },
      { id: 2, nama: 'Pay', penawaran: 1500, target: 2000, komisi: 150, growth: -25, lastMonth: 2000 },
      { id: 3, nama: 'Yapen', penawaran: 3000, target: 3500, komisi: 300, growth: 8, lastMonth: 2778 },
      { id: 4, nama: 'Dinos', penawaran: 1800, target: 2500, komisi: 180, growth: -10, lastMonth: 2000 },
      { id: 5, nama: 'Adis', penawaran: 3200, target: 3000, komisi: 320, growth: 20, lastMonth: 2667 }
    ];

    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const baseRevenue = Math.random() * 50000 + 10000;
      const target = baseRevenue * 1.15;
      const achievement = (baseRevenue / target) * 100;
      const growth = month > 1 ? Math.random() * 40 - 20 : 0;

      monthlyData.push({
        month: month,
        monthName: monthNames[month - 1],
        revenue: Math.round(baseRevenue),
        target: Math.round(target),
        achievement: parseFloat(achievement.toFixed(1)),
        growth: parseFloat(growth.toFixed(1))
      });
    }

    return { salesData, monthlyData };
  };

  // Fetch sales data from API
  useEffect(() => {
    loadRevenueData();
  }, []);

  // Filter data berdasarkan tahun yang dipilih
  const filteredMonthlyData = monthlyData.filter(item => {
    // For demo purposes, we'll use the current year data
    return true;
  });

  // Get current month data for stats
  const currentMonth = new Date().getMonth();
  const currentMonthData = filteredMonthlyData.find(item => item.month === currentMonth + 1) || filteredMonthlyData[0];

  // Hitung statistik - UPDATED: Use totalRevenueFromProfit for accurate total
  const totalRevenue = totalRevenueFromProfit > 0 ? totalRevenueFromProfit : salesData.reduce((sum, sales) => sum + sales.penawaran, 0);
  const totalKomisi = salesData.reduce((sum, sales) => sum + sales.komisi, 0);
  const achievementRate = salesData.length > 0 
    ? (salesData.filter(sales => sales.penawaran >= sales.target).length / salesData.length) * 100 
    : 0;
  const averageGrowth = salesData.length > 0
    ? salesData.reduce((sum, sales) => sum + (sales.growth || 0), 0) / salesData.length
    : 0;
  
  console.log('📊 [LAPORAN LABA] Display Statistics:');
  console.log('  - Total Revenue (from profit):', totalRevenue.toLocaleString('id-ID'));
  console.log('  - Total Komisi:', totalKomisi.toLocaleString('id-ID'));
  console.log('  - Achievement Rate:', achievementRate.toFixed(2) + '%');
  console.log('  - Average Growth:', averageGrowth.toFixed(2) + '%');

  // Data untuk chart performa bulanan
  const monthlyPerformanceData = filteredMonthlyData.map(item => ({
    name: item.monthName,
    revenue: item.revenue,
    target: item.target,
    achievement: item.achievement,
    growth: item.growth
  }));

  const formatNumber = (num) => {
    // Format to full number with thousand separators like Dashboard Sales
    return 'Rp ' + Math.round(num).toLocaleString('id-ID') + ',-';
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
          border: `1px solid ${colors.gray200}`,
          borderRadius: '12px',
          boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
          fontSize: '14px',
          color: colors.gray700,
          minWidth: '180px'
        }}>
          <p style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: entry.color, fontWeight: '600', fontSize: '13px' }}>
                {entry.name === 'revenue' ? 'Revenue' : 
                 entry.name === 'target' ? 'Target' :
                 entry.name === 'achievement' ? 'Pencapaian' :
                 entry.name}:
              </span>
              <span style={{ color: entry.color, fontWeight: 'bold', marginLeft: '8px' }}>
                {entry.name === 'achievement' ? 
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

  const handleRefresh = () => {
    setSelectedYearSales('2024');
    setActiveChart('performance');
    loadRevenueData();
  };

  const chartTabs = [
    { id: 'performance', label: 'Performa Bulanan', icon: BarChart3 }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e7f3f5 0%, #f0f9ff 100%)',
      padding: '24px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: 'relative'
    }}>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.8; }
        `}
      </style>
      
      {/* Animated Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, ${colors.secondary}08 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${colors.success}06 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, ${colors.primary}04 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        animation: 'pulse 4s ease-in-out infinite'
      }} />

      <div style={{ maxWidth: '85rem', margin: '0 auto', position: 'relative' }}>
        {/* Enhanced Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {[
            {
              title: 'Total Revenue',
              value: formatNumber(totalRevenue),
              icon: DollarSign,
              gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
              bgGradient: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.accent1}10 100%)`
            },
            {
              title: 'Revenue Bulan Ini',
              value: currentMonthData ? formatNumber(currentMonthData.revenue) : formatNumber(0),
              icon: CircleDollarSign,
              gradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.tertiary} 100%)`,
              bgGradient: `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.tertiary}10 100%)`
            },
            {
              title: 'Pencapaian Target',
              value: formatPercent(achievementRate),
              icon: Target,
              gradient: `linear-gradient(135deg, ${colors.accent1} 0%, ${colors.accent2} 100%)`,
              bgGradient: `linear-gradient(135deg, ${colors.accent1}15 0%, ${colors.accent2}10 100%)`
            },
            {
              title: 'Rata-rata Growth',
              value: `${averageGrowth > 0 ? '+' : ''}${averageGrowth.toFixed(1)}%`,
              icon: averageGrowth > 0 ? TrendingUp : TrendingDown,
              gradient: averageGrowth > 0 
                ? `linear-gradient(135deg, ${colors.success} 0%, #22c55e 100%)`
                : `linear-gradient(135deg, ${colors.danger} 0%, #f87171 100%)`,
              bgGradient: averageGrowth > 0
                ? `linear-gradient(135deg, ${colors.success}15 0%, #22c55e10 100%)`
                : `linear-gradient(135deg, ${colors.danger}15 0%, #f8717110 100%)`
            }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #d7f2f5ff 0%, #f0faff 100%)',
              border: '1px solid #035b71',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 20px 35px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`;
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: stat.bgGradient,
                borderRadius: '50%',
                transform: 'translate(40%, -40%)',
                opacity: 0.6
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                position: 'relative'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: stat.gradient,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 8px 25px ${stat.gradient.includes('success') ? colors.success : stat.gradient.includes('danger') ? colors.danger : colors.primary}30`
                }}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: colors.primary,
                    margin: '0 0 4px 0',
                    lineHeight: '1'
                  }}>
                    {stat.value}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: colors.gray600,
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simplified Filter Section - Hanya Tahun */}
        <div style={{
          background: 'linear-gradient(135deg, #d7f2f5ff 0%, #f0faff 100%)',
          border: '1px solid #035b71',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1)`,
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: '40px',
              flexWrap: 'wrap',
            }}>
              {/* Tahun Filter */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: '8px',
                  height: '24px'
                }}>
                  <Calendar size={16} />
                  Tahun
                </label>
                <div style={{ position: 'relative', minWidth: '140px' }}>
                  <select
                    value={selectedYearSales}
                    onChange={(e) => setSelectedYearSales(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      paddingRight: '45px',
                      border: `2px solid ${colors.primary}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: colors.white,
                      color: colors.gray700,
                      cursor: 'pointer',
                      appearance: 'none'
                    }}
                  >
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                  </select>
                  <div style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: colors.primary
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Chart Type Tabs */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: colors.primary,
                  marginBottom: '8px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  Jenis Grafik
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {chartTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveChart(tab.id)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        border: `2px solid ${colors.primary}`,
                        gap: '6px',
                        transition: 'all 0.3s ease',
                        background: activeChart === tab.id 
                          ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                          : colors.gray100,
                        color: activeChart === tab.id ? colors.white : colors.gray700,
                        boxShadow: activeChart === tab.id 
                          ? `0 6px 20px ${colors.primary}30`
                          : 'none'
                      }}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Refresh Button */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-end',
              height: '100%',
              paddingTop: '24px',
              marginTop: '12px'
            }}>
              <button
                onClick={handleRefresh}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
                  color: 'white',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 8px 25px ${colors.primary}30`,
                  height: '48px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = `0 12px 30px ${colors.primary}40`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 8px 25px ${colors.primary}30`;
                }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Section - Grafik Bulanan */}
        <div style={{
          background: 'linear-gradient(135deg, #d7f2f5ff 0%, #f0faff 100%)',
          border: '1px solid #035b71',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1)`,
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '200px',
            height: '200px',
            background: `conic-gradient(from 45deg, ${colors.success}08, ${colors.secondary}06, ${colors.primary}04)`,
            borderRadius: '50%',
            transform: 'translate(50%, -50%)',
            animation: 'float 8s ease-in-out infinite'
          }} />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            position: 'relative',
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: colors.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: 0
            }}>
              <div style={{
                padding: '8px',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                borderRadius: '10px',
                color: 'white'
              }}>
                <BarChart3 size={20} />
              </div>
              Analisis Performa
            </h3>
            <div style={{
              padding: '8px 16px',
              background: `linear-gradient(135deg, ${colors.success}20 0%, ${colors.tertiary}15 100%)`,
              borderRadius: '12px',
              border: `2px solid ${colors.success}30`,
              fontSize: '14px',
              fontWeight: '700',
              color: colors.success
            }}> 
              Tahun {selectedYearSales}
            </div>
          </div>
          
          <div style={{ height: '500px' }}>
            {isLoading ? (
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
                  Memuat data revenue bulanan...
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={monthlyPerformanceData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={colors.gray200} 
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: colors.gray600, fontWeight: '600' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: colors.gray600, fontWeight: '600' }}
                    tickFormatter={formatNumber}
                    width={100}
                  />
                  <Tooltip content={renderCustomTooltip} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="rect"
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill={colors.primary}
                    name="Revenue"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="target" 
                    fill={colors.tertiary}
                    name="Target"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    type="monotone"
                    dataKey="achievement"
                    stroke={colors.warning}
                    strokeWidth={3}
                    name="Pencapaian (%)"
                    dot={{ fill: colors.success, strokeWidth: 2, r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Enhanced Sales Data Table */}
        <div style={{
          background: 'linear-gradient(135deg, #d7f2f5ff 0%, #f0faff 100%)',
          border: '1px solid #035b71',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.1)`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '150px',
            height: '150px',
            background: `radial-gradient(circle, ${colors.tertiary}06 0%, transparent 70%)`,
            borderRadius: '50%',
            transform: 'translate(-30%, -30%)'
          }} />
          
          <h3 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: colors.primary,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            position: 'relative'
          }}>
            <div style={{
              padding: '8px',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
              borderRadius: '10px',
              color: 'white'
            }}>
              <Users size={20} />
            </div>
            Data Performa
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
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
                    { label: 'Revenue', align: 'right' },
                    { label: 'Target', align: 'right' },
                    { label: 'Pencapaian', align: 'center' },
                    { label: 'Growth', align: 'center' },
                    { label: 'Status', align: 'center' }
                  ].map((header, index) => (
                    <th key={index} style={{
                      padding: '18px 16px',
                      textAlign: header.align,
                      fontSize: '14px',
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
                  <tr key={sales.id} style={{
                    background: index % 2 === 0 
                      ? `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50}30 100%)`
                      : colors.white,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${colors.secondary}10 0%, ${colors.primary}05 100%)`;
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 
                      ? `linear-gradient(135deg, ${colors.white} 0%, ${colors.gray50}30 100%)`
                      : colors.white;
                    e.currentTarget.style.transform = 'scale(1)';
                  }}>
                    <td style={{
                      padding: '18px 16px',
                      fontSize: '15px',
                      fontWeight: '700',
                      color: colors.primary,
                      borderBottom: `1px solid ${colors.gray200}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}>
                          {sales.nama.charAt(0)}
                        </div>
                        {sales.nama}
                      </div>
                    </td>
                    <td style={{
                      padding: '18px 16px',
                      fontSize: '15px',
                      fontWeight: '700',
                      color: colors.gray700,
                      borderBottom: `1px solid ${colors.gray200}`,
                      textAlign: 'right'
                    }}>
                      {formatNumber(sales.penawaran)}
                    </td>
                    <td style={{
                      padding: '18px 16px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: colors.gray600,
                      borderBottom: `1px solid ${colors.gray200}`,
                      textAlign: 'right'
                    }}>
                      {formatNumber(sales.target)}
                    </td>
                    <td style={{
                      padding: '18px 16px',
                      fontSize: '15px',
                      fontWeight: '700',
                      borderBottom: `1px solid ${colors.gray200}`,
                      textAlign: 'center'
                    }}>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: ((sales.penawaran / sales.target) * 100) >= 100 ? colors.success : colors.warning,
                        background: ((sales.penawaran / sales.target) * 100) >= 100 ? `${colors.success}20` : `${colors.warning}20`,
                        border: `1px solid ${((sales.penawaran / sales.target) * 100) >= 100 ? colors.success : colors.warning}30`
                      }}>
                        {((sales.penawaran / sales.target) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td style={{
                      padding: '18px 16px',
                      fontSize: '15px',
                      fontWeight: '700',
                      borderBottom: `1px solid ${colors.gray200}`,
                      textAlign: 'center'
                    }}>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: (sales.growth || 0) >= 0 ? colors.success : colors.danger,
                        background: (sales.growth || 0) >= 0 ? `${colors.success}20` : `${colors.danger}20`,
                        border: `1px solid ${(sales.growth || 0) >= 0 ? colors.success : colors.danger}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}>
                        {(sales.growth || 0) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {sales.growth > 0 ? '+' : ''}{(sales.growth || 0).toFixed(1)}%
                      </div>
                    </td>
                    <td style={{
                      padding: '18px 16px',
                      fontSize: '15px',
                      fontWeight: '700',
                      borderBottom: `1px solid ${colors.gray200}`,
                      textAlign: 'center'
                    }}>
                      <span style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '800',
                        backgroundColor: sales.penawaran >= sales.target 
                          ? `${colors.success}25` 
                          : `${colors.warning}25`,
                        color: sales.penawaran >= sales.target 
                          ? colors.success 
                          : colors.warning,
                        border: `2px solid ${sales.penawaran >= sales.target 
                          ? colors.success 
                          : colors.warning}40`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {sales.penawaran >= sales.target ? <Award size={14} /> : <Target size={14} />}
                        {sales.penawaran >= sales.target ? 'Tercapai' : 'Belum Tercapai'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanLaba;
