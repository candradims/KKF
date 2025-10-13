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
import { getUserData, getAuthHeaders, penawaranAPI, adminAPI } from '../../utils/api';

const Dashboard = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRevenueData, setTotalRevenueData] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [regionalRevenueData, setRegionalRevenueData] = useState([]);
  const [loadingRegionalRevenue, setLoadingRegionalRevenue] = useState(true);
  const [marginTrendData, setMarginTrendData] = useState([]);
  const [loadingMarginData, setLoadingMarginData] = useState(true);
  const [currentMarginRate, setCurrentMarginRate] = useState(0);
  const [selectedYearPerformance, setSelectedYearPerformance] = useState('2025');
  const [salesPerformanceData, setSalesPerformanceData] = useState([]);
  const [loadingSalesPerformance, setLoadingSalesPerformance] = useState(true);

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
    warning: '#f59e0b',
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

  // Function to load total revenue data for all sales (admin view)
  const loadTotalRevenueData = async () => {
    try {
      setLoadingRevenue(true);
      console.log('🔍 [ADMIN DASHBOARD] Loading total revenue data for all sales...');

      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`📊 [ADMIN DASHBOARD] Processing ${response.data.length} penawaran from all sales`);

        // Initialize monthly revenue accumulator
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyRevenue = {};
        monthNames.forEach(month => {
          monthlyRevenue[month] = 0;
        });

        let totalProfit = 0;
        let processedCount = 0;

        // Process each penawaran from all sales
        for (const penawaran of response.data) {
          try {
            console.log(`🔍 [ADMIN DASHBOARD] Processing penawaran ${penawaran.id_penawaran} from sales: ${penawaran.user_id}...`);
            
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const profit = parseFloat(hasilResponse.data.profit_dari_hjt_excl_ppn) || 0;
              
              if (profit > 0) {
                console.log(`💰 [ADMIN DASHBOARD] Found profit: ${profit.toLocaleString('id-ID')} for penawaran ${penawaran.id_penawaran} (Sales: ${penawaran.user_id})`);
                
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
                      console.log(`📅 [ADMIN DASHBOARD] Date: ${penawaran.tanggal_penawaran} -> Parsed: ${date.toDateString()} -> Month: ${monthName}`);
                    } else {
                      console.log(`⚠️ [ADMIN DASHBOARD] Invalid date: ${penawaran.tanggal_penawaran}`);
                    }
                  } catch (dateError) {
                    console.log(`⚠️ [ADMIN DASHBOARD] Date parsing error for ${penawaran.tanggal_penawaran}:`, dateError);
                  }
                }
                
                // If we couldn't parse the date, use current month
                if (!monthName || !monthNames.includes(monthName)) {
                  const currentDate = new Date();
                  monthName = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  console.log(`⚠️ [ADMIN DASHBOARD] Using current month: ${monthName}`);
                }
                
                // Add profit to the correct month (accumulate all sales)
                monthlyRevenue[monthName] += profit;
                console.log(`✅ [ADMIN DASHBOARD] Added ${profit.toLocaleString('id-ID')} to ${monthName}, total now: ${monthlyRevenue[monthName].toLocaleString('id-ID')}`);
                
                totalProfit += profit;
                processedCount++;
              } else {
                console.log(`❌ [ADMIN DASHBOARD] No valid profit found for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`❌ [ADMIN DASHBOARD] Failed to fetch hasil for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (error) {
            console.error(`❌ [ADMIN DASHBOARD] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        // Convert to chart data format
        const chartData = monthNames.map(month => ({
          month,
          value: Math.round(monthlyRevenue[month])
        }));

        console.log('📊 [ADMIN DASHBOARD] Final total revenue summary (All Sales):');
        console.log('  - Total profit across all sales:', totalProfit.toLocaleString('id-ID'));
        console.log('  - Penawaran processed:', processedCount);
        console.log('  - Monthly breakdown:', monthlyRevenue);
        console.log('  - Chart data:', chartData);
        
        setTotalRevenueData(chartData);
      } else {
        console.log('❌ [ADMIN DASHBOARD] No valid penawaran data received');
        setTotalRevenueData([]);
      }
    } catch (error) {
      console.error('❌ [ADMIN DASHBOARD] Error loading total revenue data:', error);
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

  // Function to load regional revenue data for all sales based on HJT wilayah (admin view)
  const loadRegionalRevenueData = async () => {
    try {
      setLoadingRegionalRevenue(true);
      console.log('🔍 [ADMIN REGIONAL] === STARTING REGIONAL REVENUE DATA LOAD ===');
      console.log('🔍 [ADMIN REGIONAL] Loading regional revenue data for all sales...');

      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`📊 [ADMIN REGIONAL] Processing ${response.data.length} penawaran from all sales for regional breakdown`);

        // Initialize regional profit accumulator with 5 HJT regions
        const regionalProfit = {
          'HJT JAWA-BALI': 0,
          'HJT SUMATRA': 0,
          'HJT JABODETABEK': 0,
          'HJT INTIM': 0,
          'HJT KALIMANTAN': 0
        };

        let totalProfit = 0;
        let processedCount = 0;

        // Process each penawaran from all sales
        for (const penawaran of response.data) {
          try {
            console.log(`🔍 [ADMIN REGIONAL] Processing penawaran ${penawaran.id_penawaran} from sales: ${penawaran.user_id}...`);
            console.log(`📋 [PENAWARAN DATA]`, {
              id: penawaran.id_penawaran,
              user_id: penawaran.user_id,
              wilayah_hjt: penawaran.wilayah_hjt,
              tanggal: penawaran.tanggal_penawaran
            });
            
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const profit = parseFloat(hasilResponse.data.profit_dari_hjt_excl_ppn) || 0;
              
              // Try multiple sources for wilayah data
              let wilayahHjt = hasilResponse.data.hjt_wilayah || 
                              hasilResponse.data.wilayah_hjt || 
                              hasilResponse.data.referensi_hjt || 
                              hasilResponse.data.wilayah || '';
              
              // If still empty, try to get from penawaran data
              if (!wilayahHjt && penawaran.wilayah_hjt) {
                wilayahHjt = penawaran.wilayah_hjt;
                console.log(`📍 [FALLBACK] Using wilayah from penawaran data: "${wilayahHjt}"`);
              }
              
              console.log(`📋 [ADMIN REGIONAL RAW DATA] Penawaran ${penawaran.id_penawaran}:`);
              console.log(`  - Profit: ${profit.toLocaleString('id-ID')}`);
              console.log(`  - Raw HJT Wilayah: "${wilayahHjt}"`);
              console.log(`  - Sales: ${penawaran.user_id}`);
              console.log(`  - Available wilayah fields:`, {
                hjt_wilayah: hasilResponse.data.hjt_wilayah,
                wilayah_hjt: hasilResponse.data.wilayah_hjt,
                referensi_hjt: hasilResponse.data.referensi_hjt,
                wilayah: hasilResponse.data.wilayah,
                penawaran_wilayah: penawaran.wilayah_hjt
              });
              
              if (profit > 0) {
                console.log(`💰 [ADMIN REGIONAL] Profit found: ${profit.toLocaleString('id-ID')} for raw wilayah: "${wilayahHjt}" (Sales: ${penawaran.user_id})`);
                
                // Map HJT wilayah to standardized regions with detailed logging
                let mappedWilayah = null;
                const wilayahLower = wilayahHjt.toLowerCase().trim();
                
                console.log(`🔍 [ADMIN REGIONAL MAPPING] Raw wilayah: "${wilayahHjt}" -> Lowercase: "${wilayahLower}"`);
                
                // Enhanced matching with more variations and exact values from database
                if (wilayahLower === 'jawa-bali' || wilayahLower === 'jawa bali' || 
                    wilayahLower === 'jawabali' || wilayahLower === 'hjt jawa-bali' ||
                    wilayahLower.includes('jawa') || wilayahLower.includes('bali')) {
                  mappedWilayah = 'HJT JAWA-BALI';
                  console.log(`✅ [ADMIN REGIONAL MAPPING] Matched to HJT JAWA-BALI`);
                } else if (wilayahLower === 'sumatera' || wilayahLower === 'sumatra' || 
                          wilayahLower === 'hjt sumatera' || wilayahLower === 'hjt sumatra' ||
                          wilayahLower.includes('sumatra') || wilayahLower.includes('sumatera')) {
                  mappedWilayah = 'HJT SUMATRA';
                  console.log(`✅ [ADMIN REGIONAL MAPPING] Matched to HJT SUMATRA`);
                } else if (wilayahLower === 'jabodetabek' || wilayahLower === 'hjt jabodetabek' ||
                          wilayahLower.includes('jabodetabek') || 
                          wilayahLower.includes('jakarta') || wilayahLower.includes('bogor') || 
                          wilayahLower.includes('depok') || wilayahLower.includes('tangerang') || 
                          wilayahLower.includes('bekasi')) {
                  mappedWilayah = 'HJT JABODETABEK';
                  console.log(`✅ [ADMIN REGIONAL MAPPING] Matched to HJT JABODETABEK`);
                } else if (wilayahLower === 'kalimantan' || wilayahLower === 'hjt kalimantan' ||
                          wilayahLower.includes('kalimantan') || wilayahLower.includes('borneo')) {
                  mappedWilayah = 'HJT KALIMANTAN';
                  console.log(`✅ [ADMIN REGIONAL MAPPING] Matched to HJT KALIMANTAN`);
                } else if (wilayahLower === 'intim' || wilayahLower === 'hjt intim' ||
                          wilayahLower.includes('intim') || wilayahLower.includes('timur') || 
                          wilayahLower.includes('indonesia timur')) {
                  mappedWilayah = 'HJT INTIM';
                  console.log(`✅ [ADMIN REGIONAL MAPPING] Matched to HJT INTIM`);
                } else {
                  // For debugging - show all possible values to help identify the actual data format
                  console.log(`⚠️ [ADMIN REGIONAL MAPPING] UNRECOGNIZED wilayah: "${wilayahHjt}" (length: ${wilayahHjt.length})`);
                  console.log(`🔍 [DEBUG] Character codes:`, Array.from(wilayahHjt).map(char => `${char}(${char.charCodeAt(0)})`));
                  console.log(`❌ [ADMIN REGIONAL MAPPING] Profit ${profit.toLocaleString('id-ID')} will be IGNORED due to unrecognized wilayah`);
                  
                  // TEMPORARY: Let's try to assign based on first few characters to help debug
                  if (wilayahHjt.trim()) {
                    console.log(`🔧 [TEMP DEBUG] Assigning to HJT INTIM for debugging purposes`);
                    mappedWilayah = 'HJT INTIM';
                  } else {
                    continue; // Skip empty wilayah
                  }
                }
                
                if (mappedWilayah && regionalProfit.hasOwnProperty(mappedWilayah)) {
                  regionalProfit[mappedWilayah] += profit;
                  console.log(`✅ [ADMIN REGIONAL] Added ${profit.toLocaleString('id-ID')} to ${mappedWilayah} (mapped from "${wilayahHjt}") - Sales: ${penawaran.user_id}`);
                } else {
                  regionalProfit['HJT INTIM'] += profit;
                  console.log(`✅ [ADMIN REGIONAL] Added ${profit.toLocaleString('id-ID')} to HJT INTIM (fallback) - Sales: ${penawaran.user_id}`);
                }
                
                totalProfit += profit;
                processedCount++;
              } else {
                console.log(`❌ [ADMIN REGIONAL] No valid profit found for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`❌ [ADMIN REGIONAL] Failed to fetch hasil for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (error) {
            console.error(`❌ [ADMIN REGIONAL] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        // Calculate percentages and prepare chart data
        const chartData = [];
        const regionColors = {
          'HJT JAWA-BALI': colors.primary,
          'HJT SUMATRA': colors.secondary,
          'HJT JABODETABEK': colors.accent1,
          'HJT INTIM': colors.tertiary,
          'HJT KALIMANTAN': colors.accent2
        };

        console.log('📊 [ADMIN REGIONAL] Regional profit breakdown (All Sales):');
        console.log(`💰 Total Profit: Rp ${totalProfit.toLocaleString('id-ID')}`);
        console.log(`📊 Penawaran processed: ${processedCount}`);
        
        // Log raw regional profit data
        console.log('🏗️ [ADMIN REGIONAL] Raw regional profit data:');
        Object.keys(regionalProfit).forEach(wilayah => {
          console.log(`  - ${wilayah}: Rp ${regionalProfit[wilayah].toLocaleString('id-ID')}`);
        });
        
        Object.keys(regionalProfit).forEach(wilayah => {
          const profit = regionalProfit[wilayah];
          const percentage = totalProfit > 0 ? (profit / totalProfit) * 100 : 0;
          
          // Only add to chart if there's actual profit
          if (profit > 0) {
            chartData.push({
              name: wilayah,
              value: Math.round(profit),
              percentage: Math.round(percentage * 10) / 10,
              color: regionColors[wilayah]
            });
            
            console.log(`✅ [CHART DATA] ${wilayah}: Rp ${profit.toLocaleString('id-ID')} (${percentage.toFixed(1)}%)`);
          } else {
            console.log(`❌ [CHART DATA] ${wilayah}: No profit data - excluded from chart`);
          }
        });

        // Sort by profit value (descending)
        chartData.sort((a, b) => b.value - a.value);
        
        console.log('📈 [ADMIN REGIONAL] Final regional chart data:', chartData);
        
        setRegionalRevenueData(chartData);
      } else {
        console.log('❌ [ADMIN REGIONAL] No valid penawaran data received');
        setRegionalRevenueData([]);
      }
    } catch (error) {
      console.error('❌ [ADMIN REGIONAL] Error loading regional revenue data:', error);
      setRegionalRevenueData([
        { name: 'HJT JAWA-BALI', value: 0, percentage: 0, color: colors.primary },
        { name: 'HJT SUMATRA', value: 0, percentage: 0, color: colors.secondary },
        { name: 'HJT JABODETABEK', value: 0, percentage: 0, color: colors.accent1 },
        { name: 'HJT INTIM', value: 0, percentage: 0, color: colors.tertiary },
        { name: 'HJT KALIMANTAN', value: 0, percentage: 0, color: colors.accent2 }
      ]);
    } finally {
      setLoadingRegionalRevenue(false);
    }
  };

  // Function to load margin trend data from margin_dari_hjt (Admin - All Sales)
  const loadMarginTrendData = async () => {
    try {
      setLoadingMarginData(true);
      console.log('🔍 [ADMIN MARGIN] Loading margin trend data for all sales...');

      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`📊 [ADMIN MARGIN] Processing ${response.data.length} penawaran from all sales`);

        // Initialize monthly margin accumulator
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyMargin = {};
        monthNames.forEach(month => {
          monthlyMargin[month] = 0;
        });

        let totalAllMargin = 0;
        let processedCount = 0;

        // Process all penawaran from all sales (admin aggregation)
        for (const penawaran of response.data) {
          try {
            console.log(`🔍 [ADMIN MARGIN] Processing penawaran ${penawaran.id_penawaran}...`);
            
            // Use the same API method as sales dashboard
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const margin = parseFloat(hasilResponse.data.margin_dari_hjt) || 0;
              
              if (margin > 0) {
                console.log(`💰 [ADMIN MARGIN] Found margin: ${margin.toFixed(2)}% for penawaran ${penawaran.id_penawaran}`);
                
                // Get month from penawaran date
                let monthName = null;
                
                if (penawaran.tanggal_penawaran) {
                  try {
                    // Try different date formats (same as sales dashboard)
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
                      console.log(`📅 [ADMIN MARGIN] Date: ${penawaran.tanggal_penawaran} -> Parsed: ${date.toDateString()} -> Month: ${monthName}`);
                    } else {
                      console.log(`⚠️ [ADMIN MARGIN] Invalid date: ${penawaran.tanggal_penawaran}`);
                    }
                  } catch (dateError) {
                    console.log(`⚠️ [ADMIN MARGIN] Date parsing error for ${penawaran.tanggal_penawaran}:`, dateError);
                  }
                }
                
                // If we couldn't parse the date, use current month
                if (!monthName || !monthNames.includes(monthName)) {
                  const currentDate = new Date();
                  monthName = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  console.log(`⚠️ [ADMIN MARGIN] Using current month: ${monthName}`);
                }
                
                // Add margin to the correct month (sum all margins for that month - admin view)
                monthlyMargin[monthName] += margin;
                console.log(`✅ [ADMIN MARGIN] Added ${margin.toFixed(2)}% to ${monthName}, total now: ${monthlyMargin[monthName].toFixed(2)}%`);
                
                totalAllMargin += margin;
                processedCount++;
              } else {
                console.log(`❌ [ADMIN MARGIN] No valid margin found for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`❌ [ADMIN MARGIN] Failed to fetch hasil for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (error) {
            console.error(`❌ [ADMIN MARGIN] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        // Convert to chart data format - show total margin per month (admin aggregated view)
        const chartData = monthNames.map(month => ({
          month,
          marginRate: Math.round(monthlyMargin[month] * 100) / 100 // Round to 2 decimal places
        }));

        console.log('📊 [ADMIN MARGIN] Final margin summary (All Sales):');
        console.log('  - Total margin across all penawaran:', totalAllMargin.toFixed(2));
        console.log('  - Penawaran processed:', processedCount);
        console.log('  - Monthly totals:', monthlyMargin);
        console.log('  - Chart data:', chartData);

        // Calculate current margin rate as total accumulated margin from all sales
        const currentRate = totalAllMargin;
        
        console.log(`📊 [ADMIN MARGIN] Current Rate Calculation:`);
        console.log(`  - Total accumulated margin from all sales: ${totalAllMargin.toFixed(2)}%`);
        console.log(`  - Using total accumulation as current rate: ${currentRate.toFixed(2)}%`);
        
        setMarginTrendData(chartData);
        setCurrentMarginRate(Math.round(currentRate * 100) / 100); // Round to 2 decimal places
      } else {
        console.log('❌ [ADMIN MARGIN] No valid penawaran data received');
        setMarginTrendData([]);
        setCurrentMarginRate(0);
      }
    } catch (error) {
      console.error('❌ [ADMIN MARGIN] Error loading margin trend data:', error);
      // Initialize with empty data if error
      setMarginTrendData([
        { month: 'JAN', marginRate: 0 },
        { month: 'FEB', marginRate: 0 },
        { month: 'MAR', marginRate: 0 },
        { month: 'APR', marginRate: 0 },
        { month: 'MAY', marginRate: 0 },
        { month: 'JUN', marginRate: 0 },
        { month: 'JUL', marginRate: 0 },
        { month: 'AUG', marginRate: 0 },
        { month: 'SEP', marginRate: 0 },
        { month: 'OCT', marginRate: 0 },
        { month: 'NOV', marginRate: 0 },
        { month: 'DEC', marginRate: 0 }
      ]);
      setCurrentMarginRate(0);
    } finally {
      setLoadingMarginData(false);
    }
  };

  // Function to load sales performance data for Analisis Performa chart
  const loadSalesPerformanceData = async () => {
    try {
      setLoadingSalesPerformance(true);
      console.log('🔍 [ADMIN DASHBOARD] Starting to fetch sales performance data...');
      
      // Step 1: Fetch all sales users from database
      const salesUsersResponse = await adminAPI.getUsersByRole('sales');
      
      if (!salesUsersResponse.success || !salesUsersResponse.data || salesUsersResponse.data.length === 0) {
        console.warn('⚠️ [ADMIN DASHBOARD] No sales users found');
        setSalesPerformanceData([]);
        setLoadingSalesPerformance(false);
        return;
      }

      const salesUsers = salesUsersResponse.data;
      console.log('✅ [ADMIN DASHBOARD] Found', salesUsers.length, 'sales users');

      // Step 2: Get all penawaran
      const penawaranResponse = await penawaranAPI.getAll();
      
      if (!penawaranResponse.success || !penawaranResponse.data) {
        console.warn('⚠️ [ADMIN DASHBOARD] No penawaran data found');
        setSalesPerformanceData([]);
        setLoadingSalesPerformance(false);
        return;
      }

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
            continue;
          }

          // Get hasil for this penawaran
          const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
          
          if (hasilResponse.success && hasilResponse.data) {
            const profit = parseFloat(hasilResponse.data.profit_dari_hjt_excl_ppn) || 0;
            const pencapaian = parseFloat(hasilResponse.data.total_per_bulan_harga_final_sebelum_ppn) || 0;

            const salesData = salesDataMap.get(salesId);
            salesData.totalRevenue += profit;
            salesData.totalPencapaian += pencapaian;
            salesData.penawaranCount += 1;

            salesDataMap.set(salesId, salesData);
          }
        } catch (error) {
          console.error(`❌ [ADMIN DASHBOARD] Error processing penawaran ${penawaran.id_penawaran}:`, error);
        }
      }

      // Step 5: Convert map to array
      const salesDataArray = [];
      
      salesDataMap.forEach((data) => {
        const target = data.target;
        const pencapaian = data.totalPencapaian;
        const revenue = data.totalRevenue;

        salesDataArray.push({
          name: data.nama,
          penawaran: Math.round(revenue),
          pencapaian: Math.round(pencapaian),
          target: Math.round(target)
        });
      });

      console.log('✅ [ADMIN DASHBOARD] Sales performance data loaded:', salesDataArray);
      setSalesPerformanceData(salesDataArray);
    } catch (error) {
      console.error("❌ [ADMIN DASHBOARD] Error fetching sales performance data:", error);
      setSalesPerformanceData([]);
    } finally {
      setLoadingSalesPerformance(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
    loadTotalRevenueData();
    loadRegionalRevenueData();
    loadMarginTrendData();
    loadSalesPerformanceData();
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
  
  // Data untuk Analisis Performa by year - similar to Laporan Laba
  const salesPerformanceByYear = {
    '2023': salesPerformanceData.map(sales => ({
      name: sales.name,
      penawaran: sales.penawaran * 0.8,
      pencapaian: sales.pencapaian * 0.8,
      target: sales.target * 0.8
    })),
    '2024': salesPerformanceData.map(sales => ({
      name: sales.name,
      penawaran: sales.penawaran * 0.9,
      pencapaian: sales.pencapaian * 0.9,
      target: sales.target
    })),
    '2025': salesPerformanceData.map(sales => ({
      name: sales.name,
      penawaran: sales.penawaran,
      pencapaian: sales.pencapaian,
      target: sales.target
    }))
  };

  // Get data for selected year
  const currentPerformanceData = salesPerformanceByYear[selectedYearPerformance] || [];





  // Data untuk pie chart regional - now using real data from profit calculations (All Sales)
  const regionalData = regionalRevenueData.length > 0 ? regionalRevenueData : [
    { name: 'HJT JAWA-BALI', value: 0, percentage: 0, color: colors.primary },
    { name: 'HJT SUMATRA', value: 0, percentage: 0, color: colors.secondary },
    { name: 'HJT JABODETABEK', value: 0, percentage: 0, color: colors.accent1 },
    { name: 'HJT INTIM', value: 0, percentage: 0, color: colors.tertiary },
    { name: 'HJT KALIMANTAN', value: 0, percentage: 0, color: colors.accent2 }
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

  const COLORS = [colors.primary, colors.secondary, colors.accent1, colors.tertiary, colors.accent2];
  const STATUS_COLORS = ['#fce40bff', '#3fba8c' , '#EF4444'];

  const formatNumber = (num) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID') + ',-';
  };

  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          fontSize: '14px',
          color: '#334155',
          minWidth: '180px'
        }}>
          <p style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
            {payload.some(p => p.dataKey === 'name' || p.name === 'Nama Sales') ? 'Nama Sales: ' : 'Month: '}{label}
          </p>
          {payload.map((entry, index) => {
            // Handle different data types
            const isMarginData = entry.dataKey && entry.dataKey.includes('margin');
            const displayName = entry.name === 'penawaran' ? 'Revenue' : 
                               entry.name === 'pencapaian' ? 'Pencapaian' :
                               entry.name === 'target' ? 'Target' :
                               entry.name === 'Trend Revenue' ? 'Trend Revenue' :
                               entry.name;
            
            let displayValue;
            if (isMarginData) {
              displayValue = `${entry.value}%`;
            } else if (typeof entry.value === 'number') {
              displayValue = formatNumber(entry.value);
            } else {
              displayValue = entry.value;
            }
            
            return (
              <div key={index} style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: entry.color, fontWeight: '600', fontSize: '13px' }}>
                  {displayName}:
                </span>
                <span style={{ color: entry.color, fontWeight: 'bold', marginLeft: '8px' }}>
                  {displayValue}
                </span>
              </div>
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
                  {loadingRevenue ? 'Loading...' : (() => {
                    const totalRevenue = totalRevenueData.reduce((sum, item) => sum + (item.value || 0), 0);
                    return `Rp ${totalRevenue.toLocaleString('id-ID')}`;
                  })()}
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

        {/* Analisis Performa Sales Chart */}
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
                padding: '8px',
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                borderRadius: '10px',
                color: 'white'
              }}>
                <BarChart3 size={20} />
              </div>
              Analisis Performa Sales
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
              Tahun 2025
            </div>
          </div>
          <div style={{ height: '400px' }}>
            {loadingSalesPerformance ? (
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
                  Memuat data performa sales...
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={currentPerformanceData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#f0f0f0" 
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666', fontWeight: '600' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666', fontWeight: '600' }}
                    tickFormatter={(value) => {
                      return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
                    }}
                    width={120}
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
              {loadingRevenue ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: '#6b7280'
                }}>
                  Loading revenue data...
                </div>
              ) : (
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
                        return value;
                      }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total Profit']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
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
              )}
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
                      .filter(item => item.value > 0)
                      .reverse();
                    currentPeriodData = monthsWithData[0];
                  }
                  
                  const value = currentPeriodData ? currentPeriodData.value : 0;
                  return `Rp ${value.toLocaleString('id-ID')}`;
                })()}
              </div>
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
            }}>Total Revenue by HJT</h3>
            <div style={{ height: '192px', marginBottom: '16px' }}>
              {loadingRegionalRevenue ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
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
                      formatter={(value, name) => {
                        const total = regionalData.reduce((sum, item) => sum + (item.value || 0), 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                        return [`Rp ${value.toLocaleString('id-ID')} (${percentage}%)`, 'Revenue'];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
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
                        backgroundColor: item.color || COLORS[index]
                      }}
                    ></div>
                    <span style={{ color: '#6b7280' }}>{item.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      fontSize: '12px'
                    }}>{item.percentage || 0}%</span>
                    <div style={{
                      fontSize: '11px',
                      color: '#9ca3af'
                    }}>Rp {(item.value || 0).toLocaleString('id-ID')}</div>
                  </div>
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
              {loadingMarginData ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: '#666',
                  fontSize: '14px'
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
                      domain={[0, 'dataMax']}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div style={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: `2px solid ${colors.primary}`,
                              borderRadius: '8px',
                              padding: '12px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}>
                              <p style={{ margin: 0, fontWeight: 'bold', color: colors.primary }}>
                                {label}
                              </p>
                              <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
                                Total Margin: <span style={{ fontWeight: 'bold', color: colors.primary }}>
                                  {data.marginRate}%
                                </span>
                              </p>
                              <p style={{ margin: '2px 0 0 0', color: '#666', fontSize: '12px' }}>
                                (Semua Sales Tergabung)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="marginRate" 
                      stroke={colors.primary} 
                      strokeWidth={3}
                      dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: colors.secondary }}
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
                {loadingMarginData ? 'Loading...' : `${currentMarginRate}%`}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>Total Akumulasi Margin (All Sales)</div>
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