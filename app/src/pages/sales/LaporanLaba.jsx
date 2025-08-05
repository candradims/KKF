import React from 'react';
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

const LaporanLaba = () => {
  // Data untuk line chart Total Profit
  const totalProfitData = [
    { month: 'JAN', value: 15000 },
    { month: 'FEB', value: 18000 },
    { month: 'MAR', value: 22000 },
    { month: 'APR', value: 25200 },
    { month: 'MAY', value: 28000 },
    { month: 'JUN', value: 24000 },
    { month: 'JUL', value: 26000 },
    { month: 'AUG', value: 30000 },
    { month: 'SEP', value: 32000 },
    { month: 'OCT', value: 29000 },
    { month: 'NOV', value: 35000 },
    { month: 'DEC', value: 38000 }
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
              <p key={index} style={{ color: '#00AEEF', fontWeight: '600' }}>
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
            Rp. 52.000.000,-
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
              Tren Total Profit
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
                />
                <Tooltip content={renderCustomTooltip} />
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
              25200
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
