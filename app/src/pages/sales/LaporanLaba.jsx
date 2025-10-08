import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { DollarSign } from 'lucide-react';
import { penawaranAPI } from '../../utils/api';

const LaporanLaba = () => {
  const [totalProfitData, setTotalProfitData] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  // Function to load real revenue data from profit_dari_hjt_excl_ppn
  const loadRevenueData = async () => {
    try {
      setLoadingRevenue(true);
      console.log('🔍 [LAPORAN LABA] Loading revenue data...');

      const response = await penawaranAPI.getAll();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`📊 [LAPORAN LABA] Processing ${response.data.length} penawaran for revenue data`);

        // Initialize monthly revenue accumulator
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const monthlyRevenue = {};
        monthNames.forEach(month => {
          monthlyRevenue[month] = 0;
        });

        let totalProfit = 0;
        let processedCount = 0;

        // Process each penawaran
        for (const penawaran of response.data) {
          try {
            console.log(`🔍 [LAPORAN LABA] Processing penawaran ${penawaran.id_penawaran}...`);
            
            const hasilResponse = await penawaranAPI.getHasil(penawaran.id_penawaran);
            
            if (hasilResponse.success && hasilResponse.data) {
              const profit = parseFloat(hasilResponse.data.profit_dari_hjt_excl_ppn) || 0;
              
              if (profit > 0) {
                console.log(`💰 [LAPORAN LABA] Found profit: ${profit.toLocaleString('id-ID')} for penawaran ${penawaran.id_penawaran}`);
                
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
                      console.log(`📅 [LAPORAN LABA] Date: ${penawaran.tanggal_penawaran} -> Parsed: ${date.toDateString()} -> Month: ${monthName}`);
                    } else {
                      console.log(`⚠️ [LAPORAN LABA] Invalid date: ${penawaran.tanggal_penawaran}`);
                    }
                  } catch (dateError) {
                    console.log(`⚠️ [LAPORAN LABA] Date parsing error for ${penawaran.tanggal_penawaran}:`, dateError);
                  }
                }
                
                // If we couldn't parse the date, use current month
                if (!monthName || !monthNames.includes(monthName)) {
                  const currentDate = new Date();
                  monthName = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  console.log(`⚠️ [LAPORAN LABA] Using current month: ${monthName}`);
                }
                
                // Add profit to the correct month
                monthlyRevenue[monthName] += profit;
                console.log(`✅ [LAPORAN LABA] Added ${profit.toLocaleString('id-ID')} to ${monthName}, total now: ${monthlyRevenue[monthName].toLocaleString('id-ID')}`);
                
                totalProfit += profit;
                processedCount++;
              } else {
                console.log(`❌ [LAPORAN LABA] No valid profit found for penawaran ${penawaran.id_penawaran}`);
              }
            } else {
              console.log(`❌ [LAPORAN LABA] Failed to fetch hasil for penawaran ${penawaran.id_penawaran}`);
            }
          } catch (error) {
            console.error(`❌ [LAPORAN LABA] Error processing penawaran ${penawaran.id_penawaran}:`, error);
          }
        }

        // Convert to chart data format
        const chartData = monthNames.map(month => ({
          month,
          value: Math.round(monthlyRevenue[month])
        }));

        console.log('📊 [LAPORAN LABA] Final revenue summary:');
        console.log('  - Total profit across all penawaran:', totalProfit.toLocaleString('id-ID'));
        console.log('  - Penawaran processed:', processedCount);
        console.log('  - Monthly breakdown:', monthlyRevenue);
        console.log('  - Chart data:', chartData);
        
        setTotalProfitData(chartData);
      } else {
        console.log('❌ [LAPORAN LABA] No valid penawaran data received');
        setTotalProfitData([]);
      }
    } catch (error) {
      console.error('❌ [LAPORAN LABA] Error loading revenue data:', error);
      // Initialize with empty data if error
      setTotalProfitData([
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

  // Load data on component mount
  useEffect(() => {
    loadRevenueData();
  }, []);

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
            // Add percentage symbol for margin data or Rupiah for revenue data
            const isMarginData = entry.dataKey.includes('margin');
            const isRevenueData = entry.dataKey === 'value';
            let displayValue;
            
            if (isMarginData) {
              displayValue = `${entry.value}%`;
            } else if (isRevenueData) {
              displayValue = `Rp ${entry.value.toLocaleString('id-ID')}`;
            } else {
              displayValue = entry.value;
            }
            
            return (
              <p key={index} style={{ color: '#00AEEF', fontWeight: '600' }}>
                {`Total Profit: ${displayValue}`}
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
      padding: '24px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      {/* Top Section with Amount Display */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
        <div style={{
          backgroundColor: '#00AEEF',
          borderRadius: '20px',
          padding: '8px 16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <DollarSign style={{
            width: '16px',
            height: '16px',
            color: 'white'
          }} />
          <span style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {(() => {
              const totalRevenue = totalProfitData.reduce((sum, item) => sum + (item.value || 0), 0);
              return `Rp ${totalRevenue.toLocaleString('id-ID')},-`;
            })()}
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
        gap: '24px'
      }}>
        {/* Tren Total Profit Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
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
            }}>
              Total Revenue
            </h3>
            <select style={{
              padding: '4px 12px',
              border: '1px solid #d1d5db',
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
                <LineChart data={totalProfitData}>
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
                  content={renderCustomTooltip}
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
                  stroke="#00AEEF" 
                  strokeWidth={3}
                  dot={{ fill: '#00AEEF', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#2D396B' }}
                />
              </LineChart>
            </ResponsiveContainer>
            )}
          </div>
          <div style={{
            marginTop: '16px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            padding: '12px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#00AEEF'
            }}>
              {(() => {
                // Get current month value or latest month with data
                const currentDate = new Date();
                const currentMonthShort = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                
                // First try to get current month's data
                let currentPeriodData = totalProfitData.find(item => item.month === currentMonthShort);
                
                // If current month has no data, get the latest month with data
                if (!currentPeriodData || currentPeriodData.value === 0) {
                  // Get all months with data in reverse order (latest first)
                  const monthsWithData = totalProfitData
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
            }}>
              Current Period Value
            </div>
          </div>
        </div>

        {/* Tren Margin Rata-Rata Chart */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
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
            }}>
              Tren Margin Rata-Rata
            </h3>
            <select style={{
              padding: '4px 12px',
              border: '1px solid #d1d5db',
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
                  stroke="#00AEEF" 
                  strokeWidth={3}
                  dot={{ fill: '#00AEEF', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="margin2" 
                  stroke="#2D396B" 
                  strokeWidth={3}
                  dot={{ fill: '#2D396B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            marginTop: '16px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px',
            padding: '12px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#00AEEF'
            }}>
              57%
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Current Margin Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanLaba;
