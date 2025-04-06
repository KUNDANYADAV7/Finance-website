

import React from 'react';

const BudgetProgress = ({ categories }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
      
      <div className="space-y-4">
        {categories.map((category) => {
          const percentage = Math.min(Math.round((category.spent / category.allocated) * 100), 100);
          const isOverBudget = category.spent > category.allocated;
          
          return (
            <div key={category.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-gray-500">
                ₹{category.spent.toFixed(2)} / ₹{category.allocated.toFixed(2)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-light-purple-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              {isOverBudget && (
                <p className="text-xs text-red-500 mt-1">
                  Over budget by ₹{(category.spent - category.allocated).toFixed(2)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgress;