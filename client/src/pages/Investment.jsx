import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import InvestmentChart from '../components/InvestmentChart';
import { PlusCircle } from 'lucide-react';

const Investment = () => {
  const { investments, addInvestment, updateInvestment } = useFinance();
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(null);
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [newInvestmentData, setNewInvestmentData] = useState({
    name: '',
    type: '',
    amount: 0,
    returnRate: 0,
    startDate: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const selectedInvestment = investments.find(investment => investment.id === selectedInvestmentId);

  const investmentTypes = [
    'Stocks',
    'Bonds',
    'Mutual Funds',
    'ETFs',
    'Real Estate',
    'Cryptocurrency',
    '401k',
    'IRA',
    'CD',
    'Other'
  ];

  const handleAddInvestment = (e) => {
    e.preventDefault();
    
    if (isEditing && selectedInvestmentId) {
      const updatedInvestment = {
        ...newInvestmentData,
        id: selectedInvestmentId
      };
      updateInvestment(updatedInvestment);
      setIsEditing(false);
      setSelectedInvestmentId(null);
    } else {
      const newInvestment = {
        ...newInvestmentData,
        id: Date.now().toString()
      };
      addInvestment(newInvestment);
    }
    
    setShowAddInvestment(false);
    setNewInvestmentData({
      name: '',
      type: '',
      amount: 0,
      returnRate: 0,
      startDate: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvestmentData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'returnRate' ? parseFloat(value) || null : value
    }));
  };

  const handleEditInvestment = (investment) => {
    setNewInvestmentData({
      name: investment.name,
      type: investment.type,
      amount: investment.amount,
      returnRate: investment.returnRate,
      startDate: investment.startDate
    });
    setSelectedInvestmentId(investment.id);
    setIsEditing(true);
    setShowAddInvestment(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedInvestmentId(null);
    setShowAddInvestment(!showAddInvestment);
    setNewInvestmentData({
      name: '',
      type: '',
      amount: 0,
      returnRate: 0,
      startDate: ''
    });
  };

  // Calculate total investment amount
  const totalInvestment = investments.reduce((sum, investment) => sum + investment.amount, 0);
  
  // Calculate projected annual return
  const projectedAnnualReturn = investments.reduce(
    (sum, investment) => sum + (investment.amount * (investment.returnRate / 100)), 
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Investments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Investment Summary</h2>
              <button
                onClick={resetForm}
                className="text-light-purple-600 hover:text-light-purple-800"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-light-purple-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Total Investments</p>
                <p className="text-2xl font-semibold text-gray-800">₹{totalInvestment.toFixed(2)}</p>
              </div>
              
              <div className="p-4 bg-light-purple-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Projected Annual Return</p>
                <p className="text-2xl font-semibold text-green-600">+₹{projectedAnnualReturn.toFixed(2)}</p>
              </div>
              
              <div className="p-4 bg-light-purple-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Number of Investments</p>
                <p className="text-2xl font-semibold text-gray-800">{investments.length}</p>
              </div>
            </div>
            
            {showAddInvestment && (
              <div className="mt-6">
                <h3 className="text-md font-medium mb-3">
                  {isEditing ? 'Edit Investment' : 'Add New Investment'}
                </h3>
                <form onSubmit={handleAddInvestment} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newInvestmentData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      placeholder="e.g., Stock Portfolio"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newInvestmentData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      required
                    >
                      <option value="" disabled>Select Investment</option>
                      {investmentTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={newInvestmentData.amount}
                        onChange={handleInputChange}
                        className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="returnRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Annual Return Rate (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="returnRate"
                        name="returnRate"
                        value={newInvestmentData.returnRate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                        placeholder="0.00"
                        step="0.1"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newInvestmentData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-light-purple-600 text-white py-2 px-4 rounded-md hover:bg-light-purple-700 focus:outline-none focus:ring-2 focus:ring-light-purple-500 focus:ring-offset-2"
                  >
                    {isEditing ? 'Update Investment' : 'Add Investment'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Investment Portfolio</h2>
            
            {investments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No investments yet. Add your first investment!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Return Rate</th>
                      <th className="pb-2 font-medium">Start Date</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment) => (
                      <tr 
                        key={investment.id} 
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          selectedInvestmentId === investment.id ? 'bg-light-purple-50' : ''
                        }`}
                        onClick={() => setSelectedInvestmentId(investment.id)}
                      >
                        <td className="py-3 text-sm font-medium">{investment.name}</td>
                        <td className="py-3 text-sm">{investment.type}</td>
                        <td className="py-3 text-sm">₹{investment.amount.toFixed(2)}</td>
                        <td className="py-3 text-sm">{investment.returnRate}%</td>
                        <td className="py-3 text-sm">{investment.startDate}</td>
                        <td className="py-3 text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditInvestment(investment);
                            }}
                            className="text-light-purple-600 hover:text-light-purple-800"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <InvestmentChart investments={investments} />
          
          {selectedInvestment && !showAddInvestment && (
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{selectedInvestment.name} Details</h2>
                <button
                  onClick={() => handleEditInvestment(selectedInvestment)}
                  className="px-3 py-1 bg-light-purple-100 text-light-purple-700 rounded-md hover:bg-light-purple-200"
                >
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Investment Type</p>
                  <p className="text-lg font-medium">{selectedInvestment.type}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Investment Amount</p>
                  <p className="text-lg font-medium">₹{selectedInvestment.amount.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Expected Annual Return Rate</p>
                  <p className="text-lg font-medium">{selectedInvestment.returnRate}%</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <p className="text-lg font-medium">{selectedInvestment.startDate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Projected Annual Return</p>
                  <p className="text-lg font-medium text-green-600">
                    +₹{(selectedInvestment.amount * (selectedInvestment.returnRate / 100)).toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Investment Age</p>
                  <p className="text-lg font-medium">
                    {Math.floor((new Date().getTime() - new Date(selectedInvestment.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investment;