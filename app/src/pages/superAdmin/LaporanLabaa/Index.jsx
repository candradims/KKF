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
import { adminAPI, penawaranAPI } from '../../../utils/api';

const LaporanLaba = () => {
  const [selectedYearSales, setSelectedYearSales] = useState('2025');
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('performance');
  const [totalSalesCount, setTotalSalesCount] = useState(0); // NEW: State for real sales count

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

              console.log(`💰 [SUPER ADMIN LAPORAN LABA] Penawaran ${penawaran.id_penawaran} (Sales ID: ${salesId}):`);
              console.log(`   - Revenue (profit): Rp ${profit.toLocaleString('id-ID')}`);
              console.log(`   - Pencapaian: Rp ${pencapaian.toLocaleString('id-ID')}`);

              const salesData = salesDataMap.get(salesId);
              salesData.totalRevenue += profit;
              salesData.totalPencapaian += pencapaian;
              salesData.penawaranCount += 1;

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

          // NEW LOGIC: Target tercapai jika Pencapaian >= Target × 10
          const targetMultiplier = 10;
          const targetFull = target * targetMultiplier; // Target × 10
          
          // Growth calculation: percentage toward 10x target
          const growth = targetFull > 0 ? (pencapaian / targetFull) * 100 : 0;
          
          // Status: Tercapai jika Pencapaian >= Target × 10
          // IMPORTANT: If no data at all (pencapaian = 0), status should be "Belum Tercapai"
          const isAchieved = pencapaian > 0 && pencapaian >= targetFull;

          const komisi = revenue * 0.1; // 10% commission

          console.log(`🎯 [SUPER ADMIN LAPORAN LABA] Sales: ${data.nama}`);
          console.log(`   - Target: Rp ${target.toLocaleString('id-ID')}`);
          console.log(`   - Target Full (10x): Rp ${targetFull.toLocaleString('id-ID')}`);
          console.log(`   - Revenue: Rp ${revenue.toLocaleString('id-ID')}`);
          console.log(`   - Pencapaian: Rp ${pencapaian.toLocaleString('id-ID')}`);
          console.log(`   - Growth (to 10x): ${growth.toFixed(1)}%`);
          console.log(`   - Status: ${isAchieved ? 'TERCAPAI' : 'BELUM TERCAPAI'}`);
          console.log(`   - Penawaran count: ${data.penawaranCount}`);

          salesDataArray.push({
            id: salesId,
            nama: data.nama,
            penawaran: Math.round(revenue), // Revenue from profit_dari_hjt_excl_ppn
            pencapaian: Math.round(pencapaian), // From total_per_bulan_harga_final_sebelum_ppn
            target: Math.round(target), // From data_user.target_nr
            targetFull: Math.round(targetFull), // Target × 10
            komisi: Math.round(komisi),
            growth: parseFloat(growth.toFixed(1)), // Progress to 10x target
            lastMonth: 0, // Set to 0 as we don't have separate historical data for previous year
            achievement: parseFloat(growth.toFixed(1)),
            isAchieved: isAchieved, // Status tercapai atau belum
            penawaranCount: data.penawaranCount
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
      }
    };

    fetchSalesData();
  }, []);

  // Generate fallback data dengan data yang lebih kompleks
  const generateFallbackData = () => {
    return [
      { id: 1, nama: 'Avgui', penawaran: 28000, target: 25000, komisi: 2800, growth: 15, lastMonth: 24350 },
      { id: 2, nama: 'Pay', penawaran: 1500, target: 2000, komisi: 150, growth: -25, lastMonth: 2000 },
      { id: 3, nama: 'Yapen', penawaran: 3000, target: 3500, komisi: 300, growth: 8, lastMonth: 2778 },
      { id: 4, nama: 'Dinos', penawaran: 1800, target: 2500, komisi: 180, growth: -10, lastMonth: 2000 },
      { id: 5, nama: 'Adis', penawaran: 3200, target: 3000, komisi: 320, growth: 20, lastMonth: 2667 },
      { id: 6, nama: 'Nvid', penawaran: 2000, target: 2200, komisi: 200, growth: 5, lastMonth: 1905 },
      { id: 7, nama: 'Russia', penawaran: 3500, target: 4000, komisi: 350, growth: 12, lastMonth: 3125 }
    ];
  };

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
      achievement: sales.target > 0 ? (sales.penawaran / sales.target) * 100 : 0,
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
    color: [colors.primary, colors.secondary, colors.success, colors.warning, colors.accent1, colors.tertiary, colors.gradient1][index % 7]
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
  
  // NEW: Achievement rate based on 10x target logic (same as admin page)
  // Status tercapai jika Pencapaian >= Target × 10
  const achievementRate = selectedYearSales === '2025' && salesData.length > 0 
    ? (salesData.filter(sales => sales.isAchieved).length / salesData.length) * 100 
    : 0;
  
  // Average Growth from all sales
  const averageGrowth = selectedYearSales === '2025' && salesData.length > 0
    ? salesData.reduce((sum, sales) => sum + (sales.growth || 0), 0) / salesData.length
    : 0;

  console.log('📊 [SUPER ADMIN LAPORAN LABA] Display Statistics:');
  console.log('  - Selected Year:', selectedYearSales);
  console.log('  - Total Sales Count (from API):', totalSalesCount);
  console.log('  - Total Revenue:', totalRevenue.toLocaleString('id-ID'));
  console.log('  - Total Pencapaian:', totalPencapaian.toLocaleString('id-ID'));
  console.log('  - Total Komisi:', totalKomisi.toLocaleString('id-ID'));
  console.log('  - Achievement Rate (10x logic):', achievementRate.toFixed(2) + '%');
  console.log('  - Average Growth (to 10x target):', averageGrowth.toFixed(2) + '%');

  const formatNumber = (num) => {
    return 'Rp ' + Math.abs(num).toLocaleString('id-ID') + ',-';
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
          border: `1px solid ${colors.gray200}`,
          borderRadius: '12px',
          boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
          fontSize: '14px',
          color: colors.gray700,
          minWidth: '180px'
        }}>
          <p style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
            {payload.some(p => p.dataKey === 'current') ? 'Sales: ' : 'Nama Sales: '}{label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: entry.color, fontWeight: '600', fontSize: '13px' }}>
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
              <span style={{ color: entry.color, fontWeight: 'bold', marginLeft: '8px' }}>
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
          padding: '12px 16px',
          border: `1px solid ${colors.gray200}`,
          borderRadius: '8px',
          boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`,
          fontSize: '14px'
        }}>
          <p style={{ color: colors.primary, fontWeight: 'bold', margin: '0 0 4px 0' }}>{data.name}</p>
          <p style={{ color: colors.gray700, fontWeight: '600', margin: 0 }}>
            {formatNumber(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const handleRefresh = () => {
    setSelectedYearSales('2024');
    setActiveChart('performance');
  };

  const chartTabs = [
    { id: 'performance', label: 'Performa Sales', icon: BarChart3 },
    { id: 'growth', label: 'Pertumbuhan', icon: TrendingUp },
    { id: 'distribution', label: 'Distribusi', icon: Activity }
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
          }
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
              title: 'Total Sales',
              value: formatCount(totalSalesCount),
              icon: UserCheck,
              gradient: `linear-gradient(135deg, ${colors.success} 0%, ${colors.tertiary} 100%)`,
              bgGradient: `linear-gradient(135deg, ${colors.success}15 0%, ${colors.tertiary}10 100%)`
            },
            {
              title: 'Total Revenue',
              value: formatNumber(totalRevenue),
              icon: DollarSign,
              gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent1} 100%)`,
              bgGradient: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.accent1}10 100%)`
            },
            {
              title: 'Pencapaian Target',
              value: formatNumber(totalPencapaian),
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

        {/* Enhanced Filter Section */}
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
                    <option value="2025">2025</option>
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

        {/* Enhanced Charts Section */}
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
                {chartTabs.find(tab => tab.id === activeChart)?.icon && 
                  React.createElement(chartTabs.find(tab => tab.id === activeChart).icon, { size: 20 })}
              </div>
              {activeChart === 'performance' && 'Analisis Performa Sales'}
              {activeChart === 'growth' && 'Analisis Pertumbuhan'}
              {activeChart === 'distribution' && 'Distribusi Penawaran'}
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
            {currentYearData.length === 0 ? (
              // Tampilkan pesan jika tidak ada data
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                gap: '16px'
              }}>
                <TrendingUp size={64} color={colors.gray300} />
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.gray500,
                  textAlign: 'center'
                }}>
                  Tidak Ada Data Penawaran
                </div>
                <div style={{
                  fontSize: '14px',
                  color: colors.gray400,
                  textAlign: 'center',
                  maxWidth: '400px'
                }}>
                  Belum ada data penawaran untuk tahun {selectedYearSales}. Data penawaran hanya tersedia untuk tahun 2025.
                </div>
              </div>
            ) : (
              <>
                {activeChart === 'performance' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart 
                      data={salesPerformanceByYear[selectedYearSales]}
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
                        dataKey="pencapaian" 
                        fill={colors.warning}
                        name="Pencapaian"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="penawaran" 
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
                        dataKey="penawaran"
                        stroke={colors.primary}
                        strokeWidth={3}
                        name="Trend Revenue"
                        dot={{ fill: colors.primary, strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}

                {activeChart === 'growth' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart 
                      data={growthData}
                      margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
                    >
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={colors.gray200}
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
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: colors.warning, fontWeight: '600' }}
                        tickFormatter={(value) => `${value.toFixed(0)}%`}
                        width={60}
                      />
                      <Tooltip content={renderCustomTooltip} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar 
                        dataKey="current" 
                        fill={colors.primary}
                        name="Tahun Ini"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="previous" 
                        fill={colors.tertiary}
                        name="Tahun Lalu"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line 
                        type="monotone"
                        dataKey="growth"
                        stroke={colors.warning}
                        strokeWidth={3}
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
                        <PieChart>
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
                    </PieChart>
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
                      color: colors.gray600,
                      fontWeight: '600'
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
                    <div key={index} style={{
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
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.boxShadow = `0 8px 25px ${item.color}25`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
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
                          color: colors.gray700
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
                          color: colors.gray600,
                          fontWeight: '600'
                        }}>
                          {((item.value / totalRevenue) * 100).toFixed(1)}% dari total
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                )}
              </>
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
            Data Performa Sales
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            {currentYearData.length === 0 ? (
              // Tampilkan pesan jika tidak ada data
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '60px 20px',
                gap: '16px'
              }}>
                <Users size={64} color={colors.gray300} />
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: colors.gray500,
                  textAlign: 'center'
                }}>
                  Tidak Ada Data Performa Sales
                </div>
                <div style={{
                  fontSize: '14px',
                  color: colors.gray400,
                  textAlign: 'center',
                  maxWidth: '400px'
                }}>
                  Belum ada data performa sales untuk tahun {selectedYearSales}. Data hanya tersedia untuk tahun 2025.
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
                        color: colors.tertiary
                      }}>
                        {formatNumber(sales.pencapaian || 0)}
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
                        color: sales.growth >= 100 ? colors.success : sales.growth > 0 ? colors.warning : colors.danger,
                        background: sales.growth >= 100 ? `${colors.success}20` : sales.growth > 0 ? `${colors.warning}20` : `${colors.danger}20`,
                        border: `1px solid ${sales.growth >= 100 ? colors.success : sales.growth > 0 ? colors.warning : colors.danger}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}>
                        {sales.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {sales.growth > 0 ? '+' : ''}{sales.growth.toFixed(1)}%
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
                        gap: '6px'
                      }}>
                        {sales.isAchieved ? <Award size={14} /> : <Target size={14} />}
                        {sales.isAchieved ? 'Tercapai' : 'Belum Tercapai'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanLaba;