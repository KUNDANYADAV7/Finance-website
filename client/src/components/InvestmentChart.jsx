


import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#7c3aed', '#6d28d9', '#5b21b6'];

const InvestmentChart = ({ investments }) => {
  // Group investments by type and calculate totals
  const investmentsByType = investments.reduce((acc, investment) => {
    const existingType = acc.find(item => item.name === investment.type);
    
    if (existingType) {
      existingType.value += investment.amount;
    } else {
      acc.push({
        name: investment.type,
        value: investment.amount
      });
    }
    
    return acc;
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Investment Allocation</h3>
      
      {investmentsByType.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No investment data to display</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={investmentsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {investmentsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default InvestmentChart;