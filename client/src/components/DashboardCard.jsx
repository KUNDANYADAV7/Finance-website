




import React from 'react';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-full bg-light-purple-100">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;