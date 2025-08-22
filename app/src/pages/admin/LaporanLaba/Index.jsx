import React, { useState } from 'react';
import { CircleDollarSign } from "lucide-react";
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
} from 'recharts';
import { Users, TrendingUp } from 'lucide-react';

const LaporanLaba = () => {
  const [selectedYearProfit, setSelectedYearProfit] = useState('2023');
  const [selectedYearSales, setSelectedYearSales] = useState('2023');

  const profitDataByYear = {
    '2023': [
      { month: 'JAN', value: 500 },
      { month: 'FEB', value: 300 },
      { month: 'MAR', value: 200 },
      { month: 'APR', value: 300 },
      { month: 'MAY', value: 400 },
      { month: 'JUN', value: 450 },
      { month: 'JUL', value: 550 },
      { month: 'AUG', value: 600 },
      { month: 'SEP', value: 700 },
      { month: 'OCT', value: 800 },
      { month: 'NOV', value: 900 },
      { month: 'DEC', value: 1000 }
    ],
    '2024': [
      { month: 'JAN', value: 600 },
      { month: 'FEB', value: 400 },
      { month: 'MAR', value: 350 },
      { month: 'APR', value: 450 },
      { month: 'MAY', value: 550 },
      { month: 'JUN', value: 650 },
      { month: 'JUL', value: 750 },
      { month: 'AUG', value: 850 },
      { month: 'SEP', value: 800 },
      { month: 'OCT', value: 900 },
      { month: 'NOV', value: 950 },
      { month: 'DEC', value: 1100 }
    ]
  };

  const salesPerformanceByYear = {
    '2023': [
      { name: 'Avgui', value: 25000 },
      { name: 'Pay', value: 1001 },
      { name: 'Yapen', value: 2502 },
      { name: 'Dinos', value: 1003 },
      { name: 'Adis', value: 2504 },
      { name: 'Nvid', value: 1005 },
      { name: 'Russia', value: 2506 }
    ],
    '2024': [
      { name: 'Avgui', value: 28000 },
      { name: 'Pay', value: 1500 },
      { name: 'Yapen', value: 3000 },
      { name: 'Dinos', value: 1800 },
      { name: 'Adis', value: 3200 },
      { name: 'Nvid', value: 2000 },
      { name: 'Russia', value: 3500 }
    ]
  };

  const formatNumber = (num) => {
    if (Math.abs(num) >= 1000) {
      return (Math.abs(num) / 1000).toFixed(1) + 'K';
    }
    return Math.abs(num);
  };

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
          <p style={{ color: '#6b7280', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontWeight: '600' }}>
              {`${entry.name || 'Value'}: Rp. ${entry.value.toLocaleString('id-ID')},-`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalProfit = profitDataByYear[selectedYearProfit].reduce(
    (sum, item) => sum + item.value, 0
  );

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: '#E6F2FB',
        borderRadius: '100px',
        padding: '8px 40px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          backgroundColor: '#0066CC',
          borderRadius: '40%',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircleDollarSign style={{ width: '18px', height: '18px', color: 'white' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Label */}
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
            Total Revenue
          </div>
          {/* Nominal */}
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#2D396B' }}>
            Rp. {formatNumber(totalProfit)},-
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: '#E6F2FB',
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
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <TrendingUp size={20} />
              Total Revenue
            </h3>
            <select 
              value={selectedYearProfit}
              onChange={(e) => setSelectedYearProfit(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div style={{ height: '300px', backgroundColor: 'white', borderRadius: '12px', padding: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitDataByYear[selectedYearProfit]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6F2FB" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#333' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#333' }}
                />
                <Tooltip content={renderCustomTooltip} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0066CC" 
                  strokeWidth={3}
                  dot={{ fill: '#0066CC', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#2D396B' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{
          backgroundColor: '#E6F2FB',
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
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Users size={20} />
              Performa Sales
            </h3>
            <select 
              value={selectedYearSales}
              onChange={(e) => setSelectedYearSales(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div style={{ height: '300px', backgroundColor: 'white', borderRadius: '12px', padding: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesPerformanceByYear[selectedYearSales]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cce0f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#333' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#333' }}
                />
                <Tooltip content={renderCustomTooltip} />
                <Bar 
                  dataKey="value" 
                  fill="#0066CC" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanLaba;
