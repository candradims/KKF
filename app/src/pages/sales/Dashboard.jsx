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
  const [regionalRevenueData, setRegionalRevenueData] = useState([]);
  const [loadingRegionalRevenue, setLoadingRegionalRevenue] = useState(true);
  const [marginTrendData, setMarginTrendData] = useState([]);
  const [loadingMarginData, setLoadingMarginData] = useState(true);

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

      // Get current user data
      const currentUser = getUserData();
      if (!currentUser) {
        console.error('❌ No user data found');
        setLoadingRevenue(false);
        return;
      }

      const response = await penawaranAPI.getAll();
      
      if (response && response.success && response.data) {
        const penawaranList = response.data;
        console.log('📋 [FINAL] Found', penawaranList.length, 'penawaran');

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

        // Process each penawaran to get profit and pencapaian
        for (const penawaran of penawaranList) {
          try {
            console.log(`💰 [FINAL] Processing penawaran ${penawaran.id_penawaran}`);
            
            // Use the proper API function
            const hasilData = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilData && hasilData.success && hasilData.data) {
              const profit = parseFloat(hasilData.data.profit_dari_hjt_excl_ppn) || 0;
              const pencapaian = parseFloat(hasilData.data.total_per_bulan_harga_final_sebelum_ppn) || 0;
              
              if (profit > 0 || pencapaian > 0) {
                console.log(`✅ [FINAL] Profit: ${profit.toLocaleString('id-ID')}, Pencapaian: ${pencapaian.toLocaleString('id-ID')} for penawaran ${penawaran.id_penawaran}`);
                totalRevenue += profit;
                
                // Add to appropriate month
                if (penawaran.tanggal_dibuat) {
                  const date = new Date(penawaran.tanggal_dibuat);
                  const monthIndex = date.getMonth();
                  const monthName = monthNames[monthIndex];
                  monthlyData[monthName].totalProfit += profit;
                  monthlyData[monthName].pencapaian += pencapaian;
                  console.log(`📅 [FINAL] Added to ${monthName}`);
                } else {
                  // Add to current month if no date
                  const currentMonth = monthNames[new Date().getMonth()];
                  monthlyData[currentMonth].totalProfit += profit;
                  monthlyData[currentMonth].pencapaian += pencapaian;
                  console.log(`📅 [FINAL] Added to current month (${currentMonth})`);
                }
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
          totalProfit: Math.round(monthlyData[month].totalProfit),
          pencapaian: Math.round(monthlyData[month].pencapaian),
          target: Math.round(monthlyData[month].target)
        }));

        console.log('📊 [FINAL] === REVENUE CALCULATION COMPLETE ===');
        console.log(`💰 Total Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}`);
        console.log('📅 Monthly breakdown:', monthlyData);
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

  // Function to load regional revenue data based on HJT wilayah
  const loadRegionalRevenueData = async () => {
    try {
      setLoadingRegionalRevenue(true);
      console.log('🗺️ [REGIONAL] Loading regional revenue data by HJT wilayah...');

      const response = await penawaranAPI.getAll();
      
      if (response && response.success && response.data) {
        const penawaranList = response.data;
        console.log('📋 [REGIONAL] Processing', penawaranList.length, 'penawaran for regional analysis');
        console.log('📋 [REGIONAL] Full penawaran list:', penawaranList);

        // Initialize HJT wilayah profit counters (including new KALIMANTAN)
        const hjtProfits = {
          'HJT JAWA-BALI': 0,
          'HJT SUMATRA': 0,
          'HJT JABODETABEK': 0,
          'HJT INTIM': 0,
          'HJT KALIMANTAN': 0
        };

        let totalProfit = 0;

        // Process each penawaran to get profit by HJT wilayah
        for (const penawaran of penawaranList) {
          try {
            console.log(`🌍 [REGIONAL] Processing penawaran ${penawaran.id_penawaran}`);
            console.log('📊 [REGIONAL] Penawaran data structure:', penawaran);
            console.log('📍 [REGIONAL] Available fields:', Object.keys(penawaran));
            console.log('📍 [REGIONAL] Checking wilayah fields:');
            console.log('  - wilayah_hjt:', penawaran.wilayah_hjt);
            console.log('  - referensiHJT:', penawaran.referensiHJT);
            console.log('  - hjtWilayah:', penawaran.hjtWilayah);
            console.log('  - wilayah:', penawaran.wilayah);
            
            // Get profit data
            const hasilData = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilData && hasilData.success && hasilData.data) {
              const profit = parseFloat(hasilData.data.profit_dari_hjt_excl_ppn) || 0;
              
              if (profit > 0) {
                // Determine the correct HJT wilayah field
                let wilayahHjt = penawaran.wilayah_hjt || penawaran.referensiHJT || penawaran.hjtWilayah || penawaran.wilayah;
                
                console.log(`💰 [REGIONAL] Profit found: ${profit.toLocaleString('id-ID')} for raw wilayah: "${wilayahHjt}"`);
                
                // Map and normalize wilayah names
                let mappedWilayah = null;
                if (wilayahHjt) {
                  const wilayahLower = wilayahHjt.toString().toLowerCase();
                  
                  if (wilayahLower.includes('sumatra') || wilayahLower.includes('sumatera')) {
                    mappedWilayah = 'HJT SUMATRA';
                  } else if (wilayahLower.includes('jawa') && wilayahLower.includes('bali')) {
                    mappedWilayah = 'HJT JAWA-BALI';
                  } else if (wilayahLower.includes('jabodetabek') || wilayahLower.includes('jakarta')) {
                    mappedWilayah = 'HJT JABODETABEK';
                  } else if (wilayahLower.includes('kalimantan') || wilayahLower.includes('borneo')) {
                    mappedWilayah = 'HJT KALIMANTAN';
                  } else if (wilayahLower.includes('intim') || wilayahLower.includes('timur')) {
                    mappedWilayah = 'HJT INTIM';
                  } else {
                    console.log(`🔍 [REGIONAL] Trying exact match for: "${wilayahHjt}"`);
                    // Try exact match
                    if (hjtProfits.hasOwnProperty(wilayahHjt)) {
                      mappedWilayah = wilayahHjt;
                    }
                  }
                }
                
                if (mappedWilayah && hjtProfits.hasOwnProperty(mappedWilayah)) {
                  hjtProfits[mappedWilayah] += profit;
                  totalProfit += profit;
                  console.log(`✅ [REGIONAL] Added ${profit.toLocaleString('id-ID')} to ${mappedWilayah} (mapped from "${wilayahHjt}")`);
                } else {
                  console.log(`⚠️ [REGIONAL] Could not map wilayah "${wilayahHjt}" to any HJT region, adding to HJT INTIM as default`);
                  hjtProfits['HJT INTIM'] += profit;
                  totalProfit += profit;
                }
              } else {
                console.log(`ℹ️ [REGIONAL] Zero profit for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`⚠️ [REGIONAL] No profit data for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (error) {
            console.error(`❌ [REGIONAL] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        // Calculate percentages and prepare chart data
        const colors = {
          'HJT JAWA-BALI': '#035b71',      // primary
          'HJT SUMATRA': '#00bfca',        // secondary  
          'HJT JABODETABEK': '#008bb0',    // accent1
          'HJT INTIM': '#00a2b9',          // tertiary
          'HJT KALIMANTAN': '#0090a8'      // accent2
        };

        const chartData = Object.entries(hjtProfits).map(([wilayah, profit]) => {
          const percentage = totalProfit > 0 ? ((profit / totalProfit) * 100) : 0;
          return {
            name: wilayah,
            value: Math.round(percentage * 10) / 10, // Round to 1 decimal place
            profit: profit,
            color: colors[wilayah]
          };
        }).filter(item => item.profit > 0); // Only include regions with profit

        console.log('🗺️ [REGIONAL] === REGIONAL REVENUE ANALYSIS COMPLETE ===');
        console.log(`💰 Total Profit: Rp ${totalProfit.toLocaleString('id-ID')}`);
        console.log('📊 Profit by HJT:');
        Object.entries(hjtProfits).forEach(([wilayah, profit]) => {
          const percentage = totalProfit > 0 ? ((profit / totalProfit) * 100) : 0;
          console.log(`  ${wilayah}: Rp ${profit.toLocaleString('id-ID')} (${percentage.toFixed(1)}%)`);
        });
        console.log('📈 Chart data:', chartData);

        setRegionalRevenueData(chartData);
      } else {
        console.log('❌ [REGIONAL] Failed to get penawaran data');
        setRegionalRevenueData([]);
      }
    } catch (error) {
      console.error('❌ [REGIONAL] Error loading regional revenue data:', error);
      setRegionalRevenueData([]);
    } finally {
      setLoadingRegionalRevenue(false);
    }
  };

  // Function to load margin trend data from margin_dari_hjt
  const loadMarginTrendData = async () => {
    try {
      setLoadingMarginData(true);
      console.log('🔍 [MARGIN] Loading margin trend data...');

      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`📊 [MARGIN] Processing ${response.data.length} penawaran for margin data`);

        // Initialize monthly margin accumulator
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyMargin = {};
        monthNames.forEach(month => {
          monthlyMargin[month] = 0;
        });

        let totalAllMargin = 0;
        let processedCount = 0;

        // Process each penawaran
        for (const penawaran of response.data) {
          try {
            console.log(`🔍 [MARGIN] Processing penawaran ${penawaran.id_penawaran}...`);
            
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const margin = parseFloat(hasilResponse.data.margin_dari_hjt) || 0;
              
              if (margin > 0) {
                console.log(`💰 [MARGIN] Found margin: ${margin.toFixed(2)}% for penawaran ${penawaran.id_penawaran}`);
                
                // Get month from penawaran date
                let monthName = null;
                
                if (penawaran.tanggal_penawaran) {
                  try {
                    // Try different date formats
                    let date;
                    if (penawaran.tanggal_penawaran.includes('T')) {
                      // ISO format: 2025-10-08T00:00:00.000Z
                      date = new Date(penawaran.tanggal_penawaran);
                    } else if (penawaran.tanggal_penawaran.includes('-')) {
                      // Format: 2025-10-08 or 08-10-2025
                      const parts = penawaran.tanggal_penawaran.split('-');
                      if (parts[0].length === 4) {
                        // YYYY-MM-DD
                        date = new Date(penawaran.tanggal_penawaran);
                      } else {
                        // DD-MM-YYYY
                        date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                      }
                    } else if (penawaran.tanggal_penawaran.includes('/')) {
                      // Format: DD/MM/YYYY or MM/DD/YYYY
                      const parts = penawaran.tanggal_penawaran.split('/');
                      // Assume DD/MM/YYYY format
                      date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    } else {
                      date = new Date(penawaran.tanggal_penawaran);
                    }
                    
                    if (!isNaN(date.getTime())) {
                      monthName = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                      console.log(`📅 [MARGIN] Date: ${penawaran.tanggal_penawaran} -> Parsed: ${date.toDateString()} -> Month: ${monthName}`);
                    } else {
                      console.log(`⚠️ [MARGIN] Invalid date: ${penawaran.tanggal_penawaran}`);
                    }
                  } catch (dateError) {
                    console.log(`⚠️ [MARGIN] Date parsing error for ${penawaran.tanggal_penawaran}:`, dateError);
                  }
                }
                
                // If we couldn't parse the date, use current month
                if (!monthName || !monthNames.includes(monthName)) {
                  const currentDate = new Date();
                  monthName = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  console.log(`⚠️ [MARGIN] Using current month: ${monthName}`);
                }
                
                // Add margin to the correct month (sum all margins for that month)
                monthlyMargin[monthName] += margin;
                console.log(`✅ [MARGIN] Added ${margin.toFixed(2)}% to ${monthName}, total now: ${monthlyMargin[monthName].toFixed(2)}%`);
                
                totalAllMargin += margin;
                processedCount++;
              } else {
                console.log(`❌ [MARGIN] No valid margin found for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`❌ [MARGIN] Failed to fetch hasil for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (error) {
            console.error(`❌ [MARGIN] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        // Convert to chart data format - show total margin per month, not average
        const chartData = monthNames.map(month => ({
          month,
          margin: Math.round(monthlyMargin[month] * 100) / 100 // Round to 2 decimal places
        }));

        console.log('📊 [MARGIN] Final margin summary:');
        console.log('  - Total margin across all penawaran:', totalAllMargin.toFixed(2));
        console.log('  - Penawaran processed:', processedCount);
        console.log('  - Monthly totals:', monthlyMargin);
        console.log('  - Chart data:', chartData);
        
        setMarginTrendData(chartData);
      } else {
        console.log('❌ [MARGIN] No valid penawaran data received');
        setMarginTrendData([]);
      }
    } catch (error) {
      console.error('❌ [MARGIN] Error loading margin data:', error);
      // Initialize with empty data if error
      setMarginTrendData([
        { month: 'JAN', margin: 0 },
        { month: 'FEB', margin: 0 },
        { month: 'MAR', margin: 0 },
        { month: 'APR', margin: 0 },
        { month: 'MAY', margin: 0 },
        { month: 'JUN', margin: 0 },
        { month: 'JUL', margin: 0 },
        { month: 'AUG', margin: 0 },
        { month: 'SEP', margin: 0 },
        { month: 'OCT', margin: 0 },
        { month: 'NOV', margin: 0 },
        { month: 'DEC', margin: 0 }
      ]);
    } finally {
      setLoadingMarginData(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadPenawaranData();
    // Delay revenue loading to ensure penawaran data is loaded first
    setTimeout(() => {
      loadFinalRevenueData(); // Use FINAL version with proper API
      loadRegionalRevenueData(); // Load regional revenue data
      loadMarginTrendData(); // Load margin trend data
    }, 1000);
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadPenawaranData();
      setTimeout(() => {
        loadFinalRevenueData(); // Use FINAL version with proper API
        loadRegionalRevenueData(); // Load regional revenue data
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
    warning: '#f59e0b',
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



  // Data untuk pie chart regional - now using real data from profit calculations
  const regionalData = regionalRevenueData.length > 0 ? regionalRevenueData : [
    { name: 'HJT JAWA-BALI', value: 0, color: colors.primary },
    { name: 'HJT SUMATRA', value: 0, color: colors.secondary },
    { name: 'HJT JABODETABEK', value: 0, color: colors.accent1 },
    { name: 'HJT INTIM', value: 0, color: colors.tertiary },
    { name: 'HJT KALIMANTAN', value: 0, color: colors.accent2 }
  ];

  // Data untuk pie chart status penawaran - now using dynamic data
  const statusPenawaranData = [
    { name: 'Menunggu', value: statusCounts.menunggu, color: '#fce40bff' },
    { name: 'Disetujui', value: statusCounts.disetujui, color: '#3fba8c' },
    { name: 'Ditolak', value: statusCounts.ditolak, color: '#EF4444' }
  ];

  const COLORS = [colors.primary, colors.secondary, colors.accent1, colors.tertiary, colors.accent2];
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

  const formatNumber = (value) => {
    return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
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
                      const total = totalRevenueData.reduce((sum, item) => sum + (item.totalProfit || 0), 0);
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                padding: '6px',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                borderRadius: '8px',
                color: 'white'
              }}>
                <BarChart3 size={18} />
              </div>
              Analisis Performa
            </h3>
            <div style={{
              padding: '6px 12px',
              background: `linear-gradient(135deg, ${colors.success}20 0%, ${colors.tertiary}15 100%)`,
              borderRadius: '8px',
              border: `2px solid ${colors.success}30`,
              fontSize: '13px',
              fontWeight: '600',
              color: colors.success
            }}>
              Tahun 2025
            </div>
          </div>
          <div style={{ height: '340px', paddingLeft: '16px' }}>
            {loadingRevenue ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: `3px solid ${colors.primary}20`,
                  borderTop: `3px solid ${colors.primary}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{
                  color: colors.primary,
                  fontWeight: '600',
                  fontSize: '14px'
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
                    stroke="#f0f0f0" 
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#666', fontWeight: '600' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#666', fontWeight: '600' }}
                    tickFormatter={formatNumber}
                    width={100}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            padding: '12px',
                            border: '1px solid #035b71',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}>
                            <p style={{ 
                              color: colors.primary, 
                              fontWeight: 'bold', 
                              marginBottom: '8px',
                              fontSize: '14px'
                            }}>{label}</p>
                            {payload.map((entry, index) => (
                              <div key={index} style={{ 
                                marginBottom: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '12px'
                              }}>
                                <span style={{ 
                                  color: entry.color, 
                                  fontWeight: '600',
                                  fontSize: '12px'
                                }}>
                                  {entry.name}:
                                </span>
                                <span style={{ 
                                  color: entry.color, 
                                  fontWeight: 'bold',
                                  fontSize: '12px'
                                }}>
                                  Rp {entry.value.toLocaleString('id-ID')}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                    iconType="rect"
                    iconSize={10}
                  />
                  <Bar 
                    dataKey="pencapaian" 
                    fill={colors.warning}
                    name="Pencapaian"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar 
                    dataKey="totalProfit" 
                    fill={colors.primary}
                    name="Revenue"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar 
                    dataKey="target" 
                    fill={colors.tertiary}
                    name="Target"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
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
                    tickFormatter={(value) => {
                      if (value >= 1000000000) {
                        return `${(value / 1000000000).toFixed(1)}B`;
                      } else if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`;
                      } else if (value >= 1000) {
                        return `${(value / 1000).toFixed(1)}K`;
                      }
                      return value.toString();
                    }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total Profit']}
                    labelFormatter={(label) => `Bulan: ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #035b71',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalProfit" 
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
              }}>
                {(() => {
                  // Get current month value or latest month with data
                  const currentDate = new Date();
                  const currentMonthShort = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  
                  // First try to get current month's data
                  let currentPeriodData = totalRevenueData.find(item => item.month === currentMonthShort);
                  
                  // If current month has no data, get the latest month with data
                  if (!currentPeriodData || currentPeriodData.value === 0) {
                    // Get all months with data in reverse order (latest first)
                    const monthsWithData = totalRevenueData
                      .filter(item => item.totalProfit > 0)
                      .reverse();
                    currentPeriodData = monthsWithData[0];
                  }
                  
                  const value = currentPeriodData ? currentPeriodData.totalProfit : 0;
                  return `Rp ${value.toLocaleString('id-ID')}`;
                })()}
              </div>
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
            }}>Total Revenue by HJT</h3>
            <div style={{ height: '192px', marginBottom: '16px' }}>
              {loadingRegionalRevenue ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  Loading regional data...
                </div>
              ) : (
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
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                      labelFormatter={(label) => `${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loadingRegionalRevenue ? (
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  textAlign: 'center',
                  padding: '16px'
                }}>
                  Loading HJT revenue breakdown...
                </div>
              ) : (
                regionalData.map((item, index) => (
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
                          backgroundColor: item.color || COLORS[index % COLORS.length]
                        }}
                      ></div>
                      <span style={{ color: '#6b7280' }}>{item.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>{item.value}%</div>
                      {item.profit && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          Rp {item.profit.toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
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
            </div>
            <div style={{ height: '320px' }}>
              {loadingMarginData ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  fontSize: '16px',
                  color: '#6b7280'
                }}>
                  Loading margin data...
                </div>
              ) : (
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
                    domain={[0, 'dataMax + 10']}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, 'Margin Rate']}
                    labelFormatter={(label) => `Bulan: ${label}`}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="margin" 
                    stroke={colors.primary} 
                    strokeWidth={3}
                    dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              )}
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
              }}>
                {(() => {
                  // Get current month margin or latest month with data
                  const currentDate = new Date();
                  const currentMonthShort = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  
                  // First try to get current month's data
                  let currentMarginData = marginTrendData.find(item => item.month === currentMonthShort);
                  
                  // If current month has no data, get the latest month with data
                  if (!currentMarginData || currentMarginData.margin === 0) {
                    // Get all months with data in reverse order (latest first)
                    const monthsWithData = marginTrendData
                      .filter(item => item.margin > 0)
                      .reverse();
                    currentMarginData = monthsWithData[0];
                  }
                  
                  const margin = currentMarginData ? currentMarginData.margin : 0;
                  return `${margin.toFixed(1)}%`;
                })()}
              </div>
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
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
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