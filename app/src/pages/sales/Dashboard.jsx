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
import { penawaranAPI, getUserData, getAuthHeaders } from '../../utils/api';

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

  // Function to load penawaran data
  const loadPenawaranData = async () => {
    try {
      setLoadingData(true);
      
      // Get user data for filtering (if needed for sales person specific data)
      const userData = getUserData();
      if (!userData) {
        console.error('User data not found');
        return;
      }

      // Fetch all penawaran data
      const response = await penawaranAPI.getAll();
      
      console.log('API Response received:', response);
      
      if (response && response.success && response.data) {
        const penawaranList = response.data;
        console.log('Penawaran list:', penawaranList);
        
        // Filter data for current sales person if role is sales
        let filteredData = penawaranList;
        if (userData.role_user === 'sales') {
          // Filter penawaran created by current sales person
          // Assuming there's a field like created_by or sales_id in the data
          const filtered = penawaranList.filter(item => 
            item.sales === userData.nama_user || 
            item.created_by === userData.id_user ||
            item.sales === userData.email_user
          );
          
          // For now, if no filtered data found, show all data for sales
          // Later you can modify this logic based on your business requirements
          filteredData = filtered.length > 0 ? filtered : penawaranList;
          console.log('Filtered data for sales:', filteredData);
        }
        
        // Set total count
        setTotalPenawaran(filteredData.length);
        
        // Count by status
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
        
        console.log('Dashboard data loaded:', {
          total: filteredData.length,
          statusCounts: counts,
          userData: userData.role_user
        });
        
      } else {
        console.error('Failed to load penawaran data:', response);
      }
    } catch (error) {
      console.error('Error loading penawaran data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Function to load revenue data from profit_dari_hjt_excl_ppn
  const loadRevenueData = async () => {
    try {
      setLoadingRevenue(true);
      console.log('🔄 Starting revenue data calculation...');

      // Get user data for filtering (sales only see their own data)
      const userData = getUserData();
      console.log('👤 User data:', userData);
      
      if (!userData) {
        console.error('❌ User data not found for revenue calculation');
        setTotalRevenueData([]);
        return;
      }

      // Fetch all penawaran data for this sales person
      console.log('📡 Fetching penawaran data...');
      const response = await penawaranAPI.getAll();
      console.log('📊 Penawaran API response:', response);
      
      if (response && response.success && response.data) {
        const penawaranList = response.data;
        console.log('� Found', penawaranList.length, 'penawaran records');

        // Group revenue by month and calculate from profit_dari_hjt_excl_ppn
        const monthlyRevenue = {};
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        // Initialize all months with 0
        monthNames.forEach(month => {
          monthlyRevenue[month] = 0;
        });

        let totalProfit = 0;
        let processedCount = 0;

        // Process each penawaran to get profit data
        for (const penawaran of penawaranList) {
          console.log(`🔍 Processing penawaran ID: ${penawaran.id_penawaran}`);
          
          try {
            // Try to calculate result first to ensure profit is calculated and stored
            console.log(`🧮 Calculating result for penawaran ${penawaran.id_penawaran}`);
            const calculateResponse = await fetch(`http://localhost:3000/api/penawaran/${penawaran.id_penawaran}/calculate-result`, {
              method: 'POST',
              headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
              }
            });

            if (calculateResponse.ok) {
              console.log(`✅ Result calculated for penawaran ${penawaran.id_penawaran}`);
            }

            // Now get hasil penawaran data which contains profit_dari_hjt_excl_ppn
            console.log(`📊 Fetching hasil for penawaran ${penawaran.id_penawaran}`);
            const hasilResponse = await fetch(`http://localhost:3000/api/penawaran/${penawaran.id_penawaran}/hasil`, {
              headers: getAuthHeaders()
            });
            
            console.log(`📈 Hasil response status for ${penawaran.id_penawaran}:`, hasilResponse.status);
            
            if (hasilResponse.ok) {
              const hasilData = await hasilResponse.json();
              console.log(`💾 Hasil data for ${penawaran.id_penawaran}:`, hasilData);
              
              if (hasilData.success && hasilData.data) {
                const profit = parseFloat(hasilData.data.profit_dari_hjt_excl_ppn) || 0;
                console.log(`💰 Extracted profit for ${penawaran.id_penawaran}: ${profit}`);
                
                if (profit > 0) {
                  totalProfit += profit;
                  processedCount++;
                  
                  // Extract month from tanggal_dibuat
                  if (penawaran.tanggal_dibuat) {
                    const date = new Date(penawaran.tanggal_dibuat);
                    const monthIndex = date.getMonth();
                    const monthName = monthNames[monthIndex];
                    
                    monthlyRevenue[monthName] += profit;
                    
                    console.log(`� Added profit ${profit.toLocaleString('id-ID')} to ${monthName} (${date.toDateString()}) for penawaran ${penawaran.id_penawaran}`);
                  } else {
                    console.log(`⚠️ No tanggal_dibuat for penawaran ${penawaran.id_penawaran}`);
                  }
                } else {
                  console.log(`ℹ️ Zero profit for penawaran ${penawaran.id_penawaran}`);
                }
              } else {
                console.log(`⚠️ No valid hasil data for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`❌ Failed to fetch hasil for penawaran ${penawaran.id_penawaran}: ${hasilResponse.status}`);
            }
          } catch (error) {
            console.error(`❌ Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        // Convert to chart data format
        const chartData = monthNames.map(month => ({
          month,
          value: Math.round(monthlyRevenue[month])
        }));

        console.log('📈 Final revenue summary:');
        console.log('  - Total profit across all penawaran:', totalProfit);
        console.log('  - Penawaran processed:', processedCount);
        console.log('  - Monthly breakdown:', monthlyRevenue);
        console.log('  - Chart data:', chartData);
        
        setTotalRevenueData(chartData);
      } else {
        console.log('❌ No valid penawaran data received');
        setTotalRevenueData([]);
      }
    } catch (error) {
      console.error('❌ Error loading revenue data:', error);
      // Initialize with empty data if error
      setTotalRevenueData([
        { month: 'JAN', value: 0 },
        { month: 'FEB', value: 0 },
        { month: 'MAR', value: 0 },
        { month: 'APR', value: 0 },
        { month: 'MAY', value: 0 },
        { month: 'JUN', value: 0 },
        { month: 'JUL', value: 0 },
        { month: 'AUG', value: 0 },
        { month: 'SEP', value: 0 },
        { month: 'OCT', value: 0 },
        { month: 'NOV', value: 0 },
        { month: 'DEC', value: 0 }
      ]);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // NEW: Real revenue data function based on actual profit values
  const loadRealRevenueData = async () => {
    try {
      setLoadingRevenue(true);
      console.log('🔄 [REAL] Loading revenue from actual profit data...');

      const response = await penawaranAPI.getAll();
      
      if (response && response.success && response.data) {
        const penawaranList = response.data;
        console.log('📋 [REAL] Processing', penawaranList.length, 'penawaran');

        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyRevenue = {};
        
        monthNames.forEach(month => {
          monthlyRevenue[month] = 0;
        });

        let totalActualProfit = 0;

        // Get real profit data from each penawaran
        for (const penawaran of penawaranList) {
          try {
            console.log(`💰 [REAL] Fetching profit for penawaran ${penawaran.id_penawaran}`);
            
            const hasilResponse = await fetch(`http://localhost:3000/api/penawaran/${penawaran.id_penawaran}/hasil`, {
              headers: getAuthHeaders()
            });
            
            if (hasilResponse.ok) {
              const hasilData = await hasilResponse.json();
              
              if (hasilData.success && hasilData.data) {
                const profit = parseFloat(hasilData.data.profit_dari_hjt_excl_ppn) || 0;
                
                if (profit > 0) {
                  console.log(`✅ [REAL] Found profit: ${profit.toLocaleString('id-ID')} for penawaran ${penawaran.id_penawaran}`);
                  totalActualProfit += profit;
                  
                  // Add to appropriate month
                  if (penawaran.tanggal_dibuat) {
                    const date = new Date(penawaran.tanggal_dibuat);
                    const monthIndex = date.getMonth();
                    const monthName = monthNames[monthIndex];
                    monthlyRevenue[monthName] += profit;
                  } else {
                    // Current month if no date
                    const currentMonth = monthNames[new Date().getMonth()];
                    monthlyRevenue[currentMonth] += profit;
                  }
                } else {
                  console.log(`⚠️ [REAL] Zero profit for penawaran ${penawaran.id_penawaran}`);
                }
              }
            }
          } catch (error) {
            console.error(`❌ [REAL] Error processing ${penawaran.id_penawaran}:`, error);
          }
        }

        const chartData = monthNames.map(month => ({
          month,
          value: Math.round(monthlyRevenue[month])
        }));

        console.log('📊 [REAL] FINAL RESULTS:');
        console.log(`💰 Total Actual Profit: ${totalActualProfit.toLocaleString('id-ID')}`);
        console.log('📅 Monthly distribution:', monthlyRevenue);
        console.log('📈 Chart data:', chartData);

        setTotalRevenueData(chartData);
      }
    } catch (error) {
      console.error('❌ [REAL] Error loading real revenue data:', error);
      setTotalRevenueData([]);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // Alternative simpler function to load revenue data
  const loadRevenueDataSimple = async () => {
    try {
      setLoadingRevenue(true);
      console.log('🔄 [Simple] Loading revenue data...');

      const response = await penawaranAPI.getAll();
      
      if (response && response.success && response.data) {
        const penawaranList = response.data;
        console.log('📊 [Simple] Processing', penawaranList.length, 'penawaran');
        console.log('📋 [Simple] Penawaran list:', penawaranList);

        let totalRevenue = 0;
        const monthlyData = {};
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        monthNames.forEach(month => {
          monthlyData[month] = 0;
        });

        // For now, let's use a simple calculation based on sample data
        // This will be replaced with real profit data once we confirm the API works
        for (const penawaran of penawaranList) {
          if (penawaran.tanggal_dibuat) {
            const date = new Date(penawaran.tanggal_dibuat);
            const monthIndex = date.getMonth();
            const monthName = monthNames[monthIndex];
            
            // Temporary: Add 5000000 per penawaran for testing
            // In production, this should be the actual profit value
            const tempProfit = 5000000;
            monthlyData[monthName] += tempProfit;
            totalRevenue += tempProfit;
            
            console.log(`📅 [Simple] Added temp profit ${tempProfit} to ${monthName} for penawaran ${penawaran.id_penawaran}`);
          }
        }

        const chartData = monthNames.map(month => ({
          month,
          value: monthlyData[month]
        }));

        console.log('📈 [Simple] Total revenue:', totalRevenue);
        console.log('📊 [Simple] Chart data:', chartData);
        
        setTotalRevenueData(chartData);
      }
    } catch (error) {
      console.error('❌ [Simple] Error loading revenue data:', error);
      setTotalRevenueData([]);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // FINAL: Simple revenue data using proper API
  const loadFinalRevenueData = async () => {
    try {
      setLoadingRevenue(true);
      console.log('🔄 [FINAL] Loading revenue using proper API...');

      const response = await penawaranAPI.getAll();
      
      if (response && response.success && response.data) {
        const penawaranList = response.data;
        console.log('📋 [FINAL] Found', penawaranList.length, 'penawaran');

        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyRevenue = {};
        
        monthNames.forEach(month => {
          monthlyRevenue[month] = 0;
        });

        let totalRevenue = 0;

        // Process each penawaran to get profit
        for (const penawaran of penawaranList) {
          try {
            console.log(`💰 [FINAL] Processing penawaran ${penawaran.id_penawaran}`);
            
            // Use the proper API function
            const hasilData = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilData && hasilData.success && hasilData.data) {
              const profit = parseFloat(hasilData.data.profit_dari_hjt_excl_ppn) || 0;
              
              if (profit > 0) {
                console.log(`✅ [FINAL] Profit found: ${profit.toLocaleString('id-ID')} for penawaran ${penawaran.id_penawaran}`);
                totalRevenue += profit;
                
                // Add to appropriate month
                if (penawaran.tanggal_dibuat) {
                  const date = new Date(penawaran.tanggal_dibuat);
                  const monthIndex = date.getMonth();
                  const monthName = monthNames[monthIndex];
                  monthlyRevenue[monthName] += profit;
                  console.log(`📅 [FINAL] Added ${profit.toLocaleString('id-ID')} to ${monthName}`);
                } else {
                  // Add to current month if no date
                  const currentMonth = monthNames[new Date().getMonth()];
                  monthlyRevenue[currentMonth] += profit;
                  console.log(`📅 [FINAL] Added ${profit.toLocaleString('id-ID')} to current month (${currentMonth})`);
                }
              } else {
                console.log(`⚠️ [FINAL] Zero profit for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`⚠️ [FINAL] No hasil data for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (error) {
            console.error(`❌ [FINAL] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        const chartData = monthNames.map(month => ({
          month,
          value: Math.round(monthlyRevenue[month])
        }));

        console.log('📊 [FINAL] === REVENUE CALCULATION COMPLETE ===');
        console.log(`💰 Total Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}`);
        console.log('📅 Monthly breakdown:', monthlyRevenue);
        console.log('📈 Chart data:', chartData);

        setTotalRevenueData(chartData);
      } else {
        console.log('❌ [FINAL] Failed to get penawaran data');
        setTotalRevenueData([]);
      }
    } catch (error) {
      console.error('❌ [FINAL] Error loading revenue data:', error);
      setTotalRevenueData([]);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadPenawaranData();
    // Delay revenue loading to ensure penawaran data is loaded first
    setTimeout(() => {
      loadFinalRevenueData(); // Use FINAL version with proper API
    }, 1000);
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadPenawaranData();
      setTimeout(() => {
        loadFinalRevenueData(); // Use FINAL version with proper API
      }, 1000);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  // Data untuk status penawaran - now using dynamic data
  const statusData = [
    { status: 'Menunggu', count: statusCounts.menunggu, icon: Clock, color: '#fce40bff' },
    { status: 'Setuju', count: statusCounts.disetujui, icon: CheckCircle, color: '#3fba8c' },
    { status: 'Tidak Setuju', count: statusCounts.ditolak, icon: XCircle, color: '#EF4444' }
  ];
  
  // Data for individual sales person's target and achievement
  // In real application, this would be dynamic based on logged-in user
  // Using Ganjar's data as example
  const mySalesData = [
    { name: 'Target Saya', TargetNR: 4752631670, Achievement: Math.round(4752631670 * 0.1) }
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

  // Data untuk pie chart status penawaran - now using dynamic data
  const statusPenawaranData = [
    { name: 'Menunggu', value: statusCounts.menunggu, color: '#fce40bff' },
    { name: 'Disetujui', value: statusCounts.disetujui, color: '#3fba8c' },
    { name: 'Ditolak', value: statusCounts.ditolak, color: '#EF4444' }
  ];

  const COLORS = [colors.primary, colors.secondary, colors.accent1, colors.tertiary];
  const STATUS_COLORS = ['#fce40bff', '#3fba8c', '#EF4444'];

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
      <style>
        {`
          @keyframes loading {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(200%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
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
          <div 
            onClick={() => !loadingData && loadPenawaranData()}
            title={loadingData ? "Loading..." : "Klik untuk refresh data"}
            style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: loadingData ? 'wait' : 'pointer'
          }} onMouseEnter={(e) => {
            if (!loadingData) {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }
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
                  fontWeight: 'bold',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {loadingData ? (
                    <div style={{
                      width: '40px',
                      height: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '3px',
                        animation: 'loading 1.5s ease-in-out infinite',
                        position: 'absolute'
                      }} />
                    </div>
                  ) : totalPenawaran}
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
          <div 
            onClick={() => !loadingData && loadPenawaranData()}
            title={loadingData ? "Loading..." : "Klik untuk refresh data"}
            style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: loadingData ? 'wait' : 'pointer'
          }} onMouseEnter={(e) => {
            if (!loadingData) {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }
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
                  fontWeight: 'bold',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {loadingData ? (
                    <div style={{
                      width: '40px',
                      height: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '3px',
                        animation: 'loading 1.5s ease-in-out infinite',
                        position: 'absolute'
                      }} />
                    </div>
                  ) : totalPenawaran}
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
                  {loadingRevenue ? 'Loading...' : 
                    (() => {
                      const total = totalRevenueData.reduce((sum, item) => sum + (item.value || 0), 0);
                      console.log('💰 Total Revenue Display Calculation:', {
                        revenueData: totalRevenueData,
                        total: total
                      });
                      return `Rp ${total.toLocaleString('id-ID')},-`;
                    })()
                  }
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

        {/* Sales Target Chart */}
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
            Target NR & Pencapaian Sales Saya
          </h3>
          <div style={{ height: '340px', paddingLeft: '32px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mySalesData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
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

          {/* Total Revenue Pie Chart */}
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
            }}>Total Revenue</h3>
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
                  {loadingData ? '...' : statusData.reduce((total, item) => total + item.count, 0)}
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