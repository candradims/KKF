import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getUserData, getAuthHeaders, penawaranAPI } from '../../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showDetailModal, setShowDetailModal] = useState(null); // null, 'ditolak', 'menunggu', 'disetujui'
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

  const colors = {
    primary: '#035b71',
    secondary: '#00bfca',
    tertiary: '#00a2b9',
    accent1: '#008bb0',
    accent2: '#0090a8',
    success: '#3fba8c',
  };

  // Navigate to data penawaran with status filter
  const navigateToDataPenawaran = (status) => {
    setShowDetailModal(null); // Close modal first
    
    // Convert status format to match DataPenawaran options
    let filterStatus = '';
    if (status === 'ditolak') filterStatus = 'Ditolak';
    else if (status === 'menunggu') filterStatus = 'Menunggu';
    else if (status === 'disetujui') filterStatus = 'Disetujui';
    
    navigate('/superAdmin/data-penawaran', { 
      state: { filterStatus: filterStatus } 
    });
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
        // Debug: Log data untuk melihat struktur
        console.log('Dashboard Stats:', data.data);
        console.log('Recent Penawaran:', data.data.recentPenawaran);
        if (data.data.recentPenawaran && data.data.recentPenawaran.length > 0) {
          console.log('Sample status:', data.data.recentPenawaran[0].status);
        }
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

  // Function to load total revenue data for all sales (superadmin view)
  const loadTotalRevenueData = async () => {
    console.log('🎯 [SUPERADMIN DASHBOARD] loadTotalRevenueData function called');
    try {
      setLoadingRevenue(true);
      console.log('🚀 [SUPERADMIN DASHBOARD] Loading total revenue data...');
      
      // Get all penawaran data
      const response = await penawaranAPI.getAll();
      console.log('📊 [SUPERADMIN DASHBOARD] API Response:', response);
      console.log('📊 [SUPERADMIN DASHBOARD] Response success:', response?.success);
      console.log('📊 [SUPERADMIN DASHBOARD] Response data length:', response?.data?.length);
      console.log('📊 [SUPERADMIN DASHBOARD] Response data type:', Array.isArray(response?.data));
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`📊 [SUPERADMIN DASHBOARD] Processing ${response.data.length} penawaran from all sales`);
        
        // Group data by month and calculate total revenue from profit_dari_hjt_excl_ppn for all approved proposals
        const monthlyRevenue = {};
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        // Initialize all months with 0
        monthNames.forEach(month => {
          monthlyRevenue[month] = 0;
        });
        
        let totalProfit = 0;
        let processedCount = 0;
        
        // Process each penawaran from all sales (superadmin - all sales combined)
        for (const penawaran of response.data) {
          try {
            console.log(`🔍 [SUPERADMIN DASHBOARD] Processing penawaran ${penawaran.id_penawaran} from sales: ${penawaran.user_id}...`);
            console.log(`📋 [SUPERADMIN DASHBOARD] Full penawaran data:`, penawaran);
            
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            console.log(`📊 [SUPERADMIN DASHBOARD] Hasil response for ${penawaran.id_penawaran}:`, hasilResponse);
            
            if (hasilResponse.success && hasilResponse.data) {
              const profit = parseFloat(hasilResponse.data.profit_dari_hjt_excl_ppn) || 0;
              console.log(`💰 [SUPERADMIN DASHBOARD] Parsed profit: ${profit} from raw: ${hasilResponse.data.profit_dari_hjt_excl_ppn}`);
              
              if (profit > 0) {
                console.log(`💰 [SUPERADMIN DASHBOARD] Found profit: ${profit.toLocaleString('id-ID')} for penawaran ${penawaran.id_penawaran} (Sales: ${penawaran.user_id})`);
                
                // Get month from penawaran date
                let monthName = null;
                console.log(`📅 [SUPERADMIN DASHBOARD] Raw date: ${penawaran.tanggal_penawaran} for penawaran ${penawaran.id_penawaran}`);
                
                if (penawaran.tanggal_penawaran) {
                  try {
                    // Try different date formats
                    let date;
                    if (penawaran.tanggal_penawaran.includes('T')) {
                      // ISO format: 2024-10-15T07:00:00.000Z
                      date = new Date(penawaran.tanggal_penawaran);
                    } else if (penawaran.tanggal_penawaran.includes('-')) {
                      // Format: 2024-10-15 or similar
                      date = new Date(penawaran.tanggal_penawaran);
                    } else {
                      // Try as is
                      date = new Date(penawaran.tanggal_penawaran);
                    }
                    
                    if (!isNaN(date.getTime())) {
                      const monthIndex = date.getMonth(); // 0-11
                      monthName = monthNames[monthIndex];
                      
                      console.log(`📅 [SUPERADMIN DASHBOARD] Date: ${penawaran.tanggal_penawaran} -> Month: ${monthName} (Index: ${monthIndex})`);
                      
                      monthlyRevenue[monthName] += profit;
                      totalProfit += profit;
                      processedCount++;
                      console.log(`📈 [SUPERADMIN DASHBOARD] Added ${profit.toLocaleString('id-ID')} to ${monthName}. Total: ${monthlyRevenue[monthName].toLocaleString('id-ID')}`);
                    } else {
                      console.warn(`⚠️  [SUPERADMIN DASHBOARD] Invalid date format: ${penawaran.tanggal_penawaran}`);
                    }
                  } catch (dateError) {
                    console.error(`❌ [SUPERADMIN DASHBOARD] Error parsing date: ${penawaran.tanggal_penawaran}`, dateError);
                  }
                } else {
                  // If no tanggal_penawaran, use current month as fallback
                  const currentDate = new Date();
                  const monthIndex = currentDate.getMonth();
                  monthName = monthNames[monthIndex];
                  
                  console.warn(`⚠️ [SUPERADMIN DASHBOARD] No tanggal_penawaran for penawaran ${penawaran.id_penawaran}, using current month: ${monthName}`);
                  
                  monthlyRevenue[monthName] += profit;
                  totalProfit += profit;
                  processedCount++;
                  console.log(`📈 [SUPERADMIN DASHBOARD] Added ${profit.toLocaleString('id-ID')} to ${monthName} (fallback). Total: ${monthlyRevenue[monthName].toLocaleString('id-ID')}`);
                }
              } else {
                console.log(`❌ [SUPERADMIN DASHBOARD] No valid profit found for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`❌ [SUPERADMIN DASHBOARD] Failed to fetch hasil for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (hasilError) {
            console.error(`❌ [SUPERADMIN DASHBOARD] Error getting hasil for penawaran ${penawaran.id_penawaran}:`, hasilError);
          }
        }
        
        console.log(`📊 [SUPERADMIN DASHBOARD] Processing completed: ${processedCount} penawaran processed`);
        console.log(`💰 [SUPERADMIN DASHBOARD] Total Profit from all sales: Rp ${totalProfit.toLocaleString('id-ID')}`);
        console.log('📊 [SUPERADMIN DASHBOARD] Final Monthly Revenue Data:', monthlyRevenue);
        
        // Convert to chart format
        const chartData = monthNames.map(month => ({
          month: month,
          value: Math.round(monthlyRevenue[month])
        }));
        
        console.log('📈 [SUPERADMIN DASHBOARD] Final Chart Data:', chartData);
        setTotalRevenueData(chartData);
      } else {
        console.error('❌ [SUPERADMIN DASHBOARD] No data received from API or API call failed');
        // Set empty data
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const emptyData = monthNames.map(month => ({ month: month, value: 0 }));
        setTotalRevenueData(emptyData);
      }
    } catch (error) {
      console.error('❌ [SUPERADMIN DASHBOARD] Error loading total revenue data:', error);
      // Set empty data on error
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const emptyData = monthNames.map(month => ({ month: month, value: 0 }));
      setTotalRevenueData(emptyData);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // Function to load margin trend data from margin_dari_hjt (SuperAdmin - All Sales)
  const loadMarginTrendData = async () => {
    try {
      setLoadingMarginData(true);
      console.log('🔍 [SUPERADMIN MARGIN] Loading margin trend data for all sales...');

      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`📊 [SUPERADMIN MARGIN] Processing ${response.data.length} penawaran from all sales`);

        // Initialize monthly margin accumulator
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyMargin = {};
        monthNames.forEach(month => {
          monthlyMargin[month] = 0;
        });

        let totalAllMargin = 0;
        let processedCount = 0;

        // Process all penawaran from all sales (superadmin aggregation)
        for (const penawaran of response.data) {
          try {
            console.log(`🔍 [SUPERADMIN MARGIN] Processing penawaran ${penawaran.id_penawaran}...`);
            
            // Use the same API method as admin dashboard
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const margin = parseFloat(hasilResponse.data.margin_dari_hjt) || 0;
              
              if (margin > 0) {
                console.log(`💰 [SUPERADMIN MARGIN] Found margin: ${margin.toFixed(2)}% for penawaran ${penawaran.id_penawaran}`);
                
                // Get month from penawaran date
                let monthName = null;
                
                if (penawaran.tanggal_penawaran) {
                  try {
                    // Try different date formats (same as admin dashboard)
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
                      console.log(`📅 [SUPERADMIN MARGIN] Date: ${penawaran.tanggal_penawaran} -> Parsed: ${date.toDateString()} -> Month: ${monthName}`);
                    } else {
                      console.log(`⚠️ [SUPERADMIN MARGIN] Invalid date: ${penawaran.tanggal_penawaran}`);
                    }
                  } catch (dateError) {
                    console.log(`⚠️ [SUPERADMIN MARGIN] Date parsing error for ${penawaran.tanggal_penawaran}:`, dateError);
                  }
                }
                
                // If we couldn't parse the date, use current month
                if (!monthName || !monthNames.includes(monthName)) {
                  const currentDate = new Date();
                  monthName = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  console.log(`⚠️ [SUPERADMIN MARGIN] Using current month: ${monthName}`);
                }
                
                // Add margin to the correct month (sum all margins for that month - superadmin view)
                monthlyMargin[monthName] += margin;
                console.log(`✅ [SUPERADMIN MARGIN] Added ${margin.toFixed(2)}% to ${monthName}, total now: ${monthlyMargin[monthName].toFixed(2)}%`);
                
                totalAllMargin += margin;
                processedCount++;
              } else {
                console.log(`❌ [SUPERADMIN MARGIN] No valid margin found for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`❌ [SUPERADMIN MARGIN] Failed to fetch hasil for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (error) {
            console.error(`❌ [SUPERADMIN MARGIN] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        // Convert to chart data format - show total margin per month (superadmin aggregated view)
        const chartData = monthNames.map(month => ({
          month,
          marginRate: Math.round(monthlyMargin[month] * 100) / 100 // Round to 2 decimal places
        }));

        console.log('📊 [SUPERADMIN MARGIN] Final margin summary (All Sales):');
        console.log('  - Total margin across all penawaran:', totalAllMargin.toFixed(2));
        console.log('  - Penawaran processed:', processedCount);
        console.log('  - Monthly totals:', monthlyMargin);
        console.log('  - Chart data:', chartData);

        // Calculate current margin rate as total accumulated margin from all sales
        const currentRate = totalAllMargin;
        
        console.log(`📊 [SUPERADMIN MARGIN] Current Rate Calculation:`);
        console.log(`  - Total accumulated margin from all sales: ${totalAllMargin.toFixed(2)}%`);
        console.log(`  - Using total accumulation as current rate: ${currentRate.toFixed(2)}%`);
        
        setMarginTrendData(chartData);
        setCurrentMarginRate(Math.round(currentRate * 100) / 100); // Round to 2 decimal places
      } else {
        console.log('❌ [SUPERADMIN MARGIN] No valid penawaran data received');
        setMarginTrendData([]);
        setCurrentMarginRate(0);
      }
    } catch (error) {
      console.error('❌ [SUPERADMIN MARGIN] Error loading margin trend data:', error);
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

  // Function to load regional revenue data for all sales based on HJT wilayah (superadmin view)
  const loadRegionalRevenueData = async () => {
    try {
      setLoadingRegionalRevenue(true);
      console.log('🔍 [SUPERADMIN REGIONAL] === STARTING REGIONAL REVENUE DATA LOAD ===');
      console.log('🔍 [SUPERADMIN REGIONAL] Loading regional revenue data for all sales...');

      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`📊 [SUPERADMIN REGIONAL] Processing ${response.data.length} penawaran from all sales for regional breakdown`);

        // Initialize regional profit accumulator with 5 HJT regions (same as admin)
        const regionalProfit = {
          'HJT JAWA-BALI': 0,
          'HJT SUMATRA': 0,
          'HJT JABODETABEK': 0,
          'HJT INTIM': 0,
          'HJT KALIMANTAN': 0
        };

        let totalProfit = 0;
        let processedCount = 0;

        // Process each penawaran from all sales (copy exact logic from admin)
        for (const penawaran of response.data) {
          try {
            console.log(`🔍 [SUPERADMIN REGIONAL] Processing penawaran ${penawaran.id_penawaran} from sales: ${penawaran.user_id}...`);
            console.log(`📋 [PENAWARAN DATA]`, {
              id: penawaran.id_penawaran,
              user_id: penawaran.user_id,
              wilayah_hjt: penawaran.wilayah_hjt,
              tanggal: penawaran.tanggal_penawaran
            });
            
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const profit = parseFloat(hasilResponse.data.profit_dari_hjt_excl_ppn) || 0;
              
              // Try multiple sources for wilayah data (same as admin)
              let wilayahHjt = hasilResponse.data.hjt_wilayah || 
                              hasilResponse.data.wilayah_hjt || 
                              hasilResponse.data.referensi_hjt || 
                              hasilResponse.data.wilayah || '';
              
              // If still empty, try to get from penawaran data
              if (!wilayahHjt && penawaran.wilayah_hjt) {
                wilayahHjt = penawaran.wilayah_hjt;
                console.log(`📍 [FALLBACK] Using wilayah from penawaran data: "${wilayahHjt}"`);
              }
              
              console.log(`📋 [SUPERADMIN REGIONAL RAW DATA] Penawaran ${penawaran.id_penawaran}:`);
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
                console.log(`💰 [SUPERADMIN REGIONAL] Profit found: ${profit.toLocaleString('id-ID')} for raw wilayah: "${wilayahHjt}" (Sales: ${penawaran.user_id})`);
                
                // Map HJT wilayah to standardized regions with detailed logging (exact same as admin)
                let mappedWilayah = null;
                const wilayahLower = wilayahHjt.toLowerCase().trim();
                
                console.log(`🔍 [SUPERADMIN REGIONAL MAPPING] Raw wilayah: "${wilayahHjt}" -> Lowercase: "${wilayahLower}"`);
                
                // Enhanced matching with more variations and exact values from database (same as admin)
                if (wilayahLower === 'jawa-bali' || wilayahLower === 'jawa bali' || 
                    wilayahLower === 'jawabali' || wilayahLower === 'hjt jawa-bali' ||
                    wilayahLower.includes('jawa') || wilayahLower.includes('bali')) {
                  mappedWilayah = 'HJT JAWA-BALI';
                  console.log(`✅ [SUPERADMIN REGIONAL MAPPING] Matched to HJT JAWA-BALI`);
                } else if (wilayahLower === 'sumatera' || wilayahLower === 'sumatra' || 
                          wilayahLower === 'hjt sumatera' || wilayahLower === 'hjt sumatra' ||
                          wilayahLower.includes('sumatra') || wilayahLower.includes('sumatera')) {
                  mappedWilayah = 'HJT SUMATRA';
                  console.log(`✅ [SUPERADMIN REGIONAL MAPPING] Matched to HJT SUMATRA`);
                } else if (wilayahLower === 'jabodetabek' || wilayahLower === 'hjt jabodetabek' ||
                          wilayahLower.includes('jabodetabek') || 
                          wilayahLower.includes('jakarta') || wilayahLower.includes('bogor') || 
                          wilayahLower.includes('depok') || wilayahLower.includes('tangerang') || 
                          wilayahLower.includes('bekasi')) {
                  mappedWilayah = 'HJT JABODETABEK';
                  console.log(`✅ [SUPERADMIN REGIONAL MAPPING] Matched to HJT JABODETABEK`);
                } else if (wilayahLower === 'kalimantan' || wilayahLower === 'hjt kalimantan' ||
                          wilayahLower.includes('kalimantan') || wilayahLower.includes('borneo')) {
                  mappedWilayah = 'HJT KALIMANTAN';
                  console.log(`✅ [SUPERADMIN REGIONAL MAPPING] Matched to HJT KALIMANTAN`);
                } else if (wilayahLower === 'intim' || wilayahLower === 'hjt intim' ||
                          wilayahLower.includes('intim') || wilayahLower.includes('timur') || 
                          wilayahLower.includes('indonesia timur')) {
                  mappedWilayah = 'HJT INTIM';
                  console.log(`✅ [SUPERADMIN REGIONAL MAPPING] Matched to HJT INTIM`);
                } else {
                  // For debugging - show all possible values to help identify the actual data format
                  console.log(`⚠️ [SUPERADMIN REGIONAL MAPPING] UNRECOGNIZED wilayah: "${wilayahHjt}" (length: ${wilayahHjt.length})`);
                  console.log(`🔍 [DEBUG] Character codes:`, Array.from(wilayahHjt).map(char => `${char}(${char.charCodeAt(0)})`));
                  console.log(`❌ [SUPERADMIN REGIONAL MAPPING] Profit ${profit.toLocaleString('id-ID')} will be IGNORED due to unrecognized wilayah`);
                  
                  // TEMPORARY: Let's try to assign based on first few characters to help debug
                  if (wilayahHjt.trim()) {
                    console.log(`� [TEMP DEBUG] Assigning to HJT INTIM for debugging purposes`);
                    mappedWilayah = 'HJT INTIM';
                  } else {
                    continue; // Skip empty wilayah
                  }
                }
                
                if (mappedWilayah && regionalProfit.hasOwnProperty(mappedWilayah)) {
                  regionalProfit[mappedWilayah] += profit;
                  console.log(`✅ [SUPERADMIN REGIONAL] Added ${profit.toLocaleString('id-ID')} to ${mappedWilayah} (mapped from "${wilayahHjt}") - Sales: ${penawaran.user_id}`);
                } else {
                  regionalProfit['HJT INTIM'] += profit;
                  console.log(`✅ [SUPERADMIN REGIONAL] Added ${profit.toLocaleString('id-ID')} to HJT INTIM (fallback) - Sales: ${penawaran.user_id}`);
                }
                
                totalProfit += profit;
                processedCount++;
              } else {
                console.log(`❌ [SUPERADMIN REGIONAL] No valid profit found for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`❌ [SUPERADMIN REGIONAL] Failed to fetch hasil for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (error) {
            console.error(`❌ [SUPERADMIN REGIONAL] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }
        
        console.log(`📊 [SUPERADMIN REGIONAL] Processing completed: ${processedCount} penawaran processed from all sales`);
        console.log(`💰 [SUPERADMIN REGIONAL] Total Profit from all regions: Rp ${totalProfit.toLocaleString('id-ID')}`);
        console.log('🌍 [SUPERADMIN REGIONAL] Regional breakdown:', regionalProfit);
        
        // Convert to chart format with percentages (same format as admin)
        const regionalChartData = [];
        const colors = {
          'HJT JAWA-BALI': '#035b71',
          'HJT SUMATRA': '#00bfca', 
          'HJT JABODETABEK': '#008bb0',
          'HJT INTIM': '#00a2b9',
          'HJT KALIMANTAN': '#0090a8'
        };
        
        Object.keys(regionalProfit).forEach(region => {
          const value = regionalProfit[region];
          const percentage = totalProfit > 0 ? (value / totalProfit) * 100 : 0;
          
          regionalChartData.push({
            name: region,
            value: Math.round(value),
            percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
            color: colors[region]
          });
          
          console.log(`📊 [SUPERADMIN REGIONAL CHART DATA] ${region}: Rp ${value.toLocaleString('id-ID')} (${percentage.toFixed(1)}%)`);
        });
        
        console.log('📈 [SUPERADMIN REGIONAL] Final Regional Chart Data for SuperAdmin:', regionalChartData);
        setRegionalRevenueData(regionalChartData);
      } else {
        console.error('❌ [SUPERADMIN REGIONAL] No data received from API or API call failed');
        // Set empty data
        const emptyData = [
          { name: 'HJT JAWA-BALI', value: 0, percentage: 0, color: '#035b71' },
          { name: 'HJT SUMATRA', value: 0, percentage: 0, color: '#00bfca' },
          { name: 'HJT JABODETABEK', value: 0, percentage: 0, color: '#008bb0' },
          { name: 'HJT INTIM', value: 0, percentage: 0, color: '#00a2b9' },
          { name: 'HJT KALIMANTAN', value: 0, percentage: 0, color: '#0090a8' }
        ];
        setRegionalRevenueData(emptyData);
      }
    } catch (error) {
      console.error('❌ [SUPERADMIN REGIONAL] Error loading regional revenue data:', error);
      // Set empty data on error
      const emptyData = [
        { name: 'HJT JAWA-BALI', value: 0, percentage: 0, color: '#035b71' },
        { name: 'HJT SUMATRA', value: 0, percentage: 0, color: '#00bfca' },
        { name: 'HJT JABODETABEK', value: 0, percentage: 0, color: '#008bb0' },
        { name: 'HJT INTIM', value: 0, percentage: 0, color: '#00a2b9' },
        { name: 'HJT KALIMANTAN', value: 0, percentage: 0, color: '#0090a8' }
      ];
      setRegionalRevenueData(emptyData);
    } finally {
      setLoadingRegionalRevenue(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
    loadTotalRevenueData();
    loadRegionalRevenueData();
    loadMarginTrendData();
  }, []);

  // Data from table image: Sales names and Target NR 2025
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
  
  // Data untuk line chart Total Revenue - using real data from profit_dari_hjt_excl_ppn (All Sales)
  const totalRevenueChartData = totalRevenueData.length > 0 ? totalRevenueData : [
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
  ];

  // Data untuk line chart Margin Trend - using real data from margin_dari_hjt (All Sales)
  const marginTrendChartData = marginTrendData.length > 0 ? marginTrendData : [
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
  ];

  // Data untuk pie chart regional - now using real data from profit calculations (All Sales)
  // Filter out regions with no data (value = 0) like admin dashboard
  const regionalData = regionalRevenueData.length > 0 
    ? regionalRevenueData.filter(item => item.value > 0) 
    : [];

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
            // Format different data types appropriately
            const isMarginData = entry.dataKey.includes('margin');
            const isRevenueData = entry.dataKey === 'value' && !isMarginData;
            
            let displayValue;
            if (isMarginData) {
              displayValue = `${entry.value}%`;
            } else if (isRevenueData) {
              displayValue = `Rp ${entry.value.toLocaleString('id-ID')}`;
            } else {
              displayValue = entry.value;
            }
            
            return (
              <p key={index} style={{ color: colors.primary, fontWeight: '600' }}>
                {`Revenue: ${displayValue}`}
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
        {/* Header Cards - Status Detail */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Card 1 - Ditolak */}
           <div style={{
            background: `linear-gradient(135deg, #EF4444 0%, #f87171 100%)`,
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                   <XCircle style={{ width: '20px', height: '20px' }} />
                   <span style={{ fontSize: '14px', fontWeight: '500', opacity: '0.9' }}>Ditolak</span>
                   <span style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.8 }} onClick={() => setShowDetailModal('ditolak')}>
                     <ChevronDown style={{ width: '18px', height: '18px' }} />
                   </span>
                </div>
                <div style={{ fontSize: '30px', fontWeight: 'bold' }}>
                  {loading ? '...' : (dashboardStats?.statusStats?.ditolak || 0)}
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                <XCircle style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
          </div>

          {/* Card 2 - Menunggu */}
          <div style={{
            background: `linear-gradient(135deg, #fce40bff 0%, #fde68a 100%)`,
            borderRadius: '12px',
            padding: '24px',
            color: 'black',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Clock style={{ width: '20px', height: '20px', color: '#f59e42' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500', opacity: '0.9' }}>Menunggu</span>
                  <span style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.8 }} onClick={() => setShowDetailModal('menunggu')}>
                    <ChevronDown style={{ width: '18px', height: '18px' }} />
                  </span>
                </div>
                <div style={{ fontSize: '30px', fontWeight: 'bold' }}>
                  {loading ? '...' : (dashboardStats?.statusStats?.menunggu || 0)}
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                <Clock style={{ width: '24px', height: '24px', color: '#f59e42' }} />
              </div>
            </div>

          </div>

          {/* Card 3 - Disetujui */}
          <div style={{
            background: `linear-gradient(135deg, #3fba8c 0%, #6ee7b7 100%)`,
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircle style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500', opacity: '0.9' }}>Disetujui</span>
                  <span style={{ marginLeft: '6px', cursor: 'pointer', opacity: 0.8 }} onClick={() => setShowDetailModal('disetujui')}>
                    <ChevronDown style={{ width: '18px', height: '18px' }} />
                  </span>
                </div>
                <div style={{ fontSize: '30px', fontWeight: 'bold' }}>
                  {loading ? '...' : (dashboardStats?.statusStats?.disetujui || 0)}
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                <CheckCircle style={{ width: '24px', height: '24px' }} />
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
              {loadingRevenue ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: colors.primary
                }}>
                  Loading chart data...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={totalRevenueChartData}>
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
                {loadingRevenue ? 'Loading...' : 
                  `Rp ${(totalRevenueChartData.reduce((sum, item) => sum + (item.value || 0), 0)).toLocaleString('id-ID')}`
                }
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
            }}>Total Revenue</h3>
            <div style={{ height: '192px', marginBottom: '16px' }}>
              {loadingRegionalRevenue ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: colors.primary
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
                  color: colors.primary
                }}>
                  Loading margin data...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marginTrendChartData}>
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
                      formatter={(value, name) => [`${value}%`, 'Total Margin']}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="marginRate" 
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
              }}>{currentMarginRate.toFixed(2)}%</div>
              <div style={{
                fontSize: '12px',
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

      {/* Detail Penawaran Modal */}
      {showDetailModal && (
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
        }} onClick={() => setShowDetailModal(null)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '600px',
            maxHeight: '80vh',
            width: '90%',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {showDetailModal === 'ditolak' && (
                  <>
                    <XCircle style={{ width: '24px', height: '24px', color: '#ef4444' }} />
                    Detail Penawaran Ditolak
                  </>
                )}
                {showDetailModal === 'menunggu' && (
                  <>
                    <Clock style={{ width: '24px', height: '24px', color: '#f59e42' }} />
                    Detail Penawaran Menunggu
                  </>
                )}
                {showDetailModal === 'disetujui' && (
                  <>
                    <CheckCircle style={{ width: '24px', height: '24px', color: '#10b981' }} />
                    Detail Penawaran Disetujui
                  </>
                )}
              </h3>
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  hover: 'backgroundColor: #f3f4f6'
                }}
                onClick={() => setShowDetailModal(null)}
              >
                <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {dashboardStats?.recentPenawaran && dashboardStats.recentPenawaran.length > 0 ? (
                <div>
                  {dashboardStats.recentPenawaran
                    .filter(p => {
                      const status = p.status?.toLowerCase();
                      if (showDetailModal === 'ditolak') {
                        return status === 'ditolak' || status === 'rejected' || status === 'decline';
                      } else if (showDetailModal === 'menunggu') {
                        return status === 'pending' || status === 'menunggu' || status === 'waiting' || status === 'in_review';
                      } else if (showDetailModal === 'disetujui') {
                        return status === 'approved' || status === 'disetujui' || status === 'accept' || status === 'completed';
                      }
                      return false;
                    })
                    .map((p, idx) => (
                      <div key={idx} style={{
                        marginBottom: '16px',
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontWeight: '600', color: '#374151' }}>Pelanggan:</span>
                          <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                            {p.nama_pelanggan || p.pelanggan || '-'}
                          </span>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontWeight: '600', color: '#374151' }}>Kontrak:</span>
                          <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                            {p.nomor_kontrak || '-'}
                          </span>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontWeight: '600', color: '#374151' }}>Sales:</span>
                          <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                            {p.data_user?.nama_user || p.sales || '-'}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontWeight: '600', color: '#374151' }}>Tanggal:</span>
                          <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                            {p.tanggal_dibuat ? new Date(p.tanggal_dibuat).toLocaleDateString('id-ID') : '-'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>
                    Tidak ada penawaran {showDetailModal === 'ditolak' ? 'yang ditolak' : 
                                         showDetailModal === 'menunggu' ? 'yang menunggu' : 
                                         'yang disetujui'}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Total: {dashboardStats?.recentPenawaran ? 
                  dashboardStats.recentPenawaran.filter(p => {
                    const status = p.status?.toLowerCase();
                    if (showDetailModal === 'ditolak') {
                      return status === 'ditolak' || status === 'rejected' || status === 'decline';
                    } else if (showDetailModal === 'menunggu') {
                      return status === 'pending' || status === 'menunggu' || status === 'waiting' || status === 'in_review';
                    } else if (showDetailModal === 'disetujui') {
                      return status === 'approved' || status === 'disetujui' || status === 'accept' || status === 'completed';
                    }
                    return false;
                  }).length : 0} penawaran
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onClick={() => navigateToDataPenawaran(showDetailModal)}
                >
                  📊 Selengkapnya
                </button>
                <button
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onClick={() => setShowDetailModal(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;