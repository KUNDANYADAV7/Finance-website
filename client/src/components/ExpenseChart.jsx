


import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#7c3aed', '#6d28d9', '#5b21b6'];

const ExpenseChart = ({ expenses }) => {
  // Group expenses by category and calculate totals
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.name === expense.category);
    
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else {
      acc.push({
        name: expense.category,
        value: expense.amount
      });
    }
    
    return acc;
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
      
      {expensesByCategory.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No expense data to display</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Amount']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;