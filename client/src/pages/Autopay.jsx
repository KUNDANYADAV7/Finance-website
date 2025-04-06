



import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import EMIList from '../components/EMIList';
import { PlusCircle } from 'lucide-react';

const Autopay = () => {
  const { emis, addEMI, updateEMI, toggleEMIAutopay } = useFinance();
  const [showAddEMI, setShowAddEMI] = useState(false);
  const [newEMIData, setNewEMIData] = useState({
    name: '',
    amount: 0,
    startDate: '',
    endDate: '',
    totalPayments: 0,
    autopay: true
  });
  const [selectedEMIId, setSelectedEMIId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const selectedEMI = emis.find(emi => emi.id === selectedEMIId);

  const calculateRemainingPayments = (startDate, endDate, totalPayments) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (today > end) return 0;
    
    const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const elapsedMonths = (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth());
    
    const remainingPayments = totalPayments - Math.floor(elapsedMonths * (totalPayments / totalMonths));
    return Math.max(0, remainingPayments);
  };

  const calculateNextPaymentDate = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    
    // Set to the same day of the month as the start date
    const nextPayment = new Date(today.getFullYear(), today.getMonth(), start.getDate());
    
    // If today is past the payment date for this month, move to next month
    if (today.getDate() > start.getDate()) {
      nextPayment.setMonth(nextPayment.getMonth() + 1);
    }
    
    return nextPayment.toISOString().split('T')[0];
  };

  const handleAddEMI = (e) => {
    e.preventDefault();
    
    const remainingPayments = calculateRemainingPayments(
      newEMIData.startDate,
      newEMIData.endDate,
      newEMIData.totalPayments
    );
    
    const nextPaymentDate = calculateNextPaymentDate(newEMIData.startDate);
    
    if (isEditing && selectedEMIId) {
      const updatedEMI = {
        ...newEMIData,
        id: selectedEMIId,
        remainingPayments,
        nextPaymentDate
      };
      updateEMI(updatedEMI);
      setIsEditing(false);
      setSelectedEMIId(null);
    } else {
      const newEMI = {
        ...newEMIData,
        id: Date.now().toString(),
        remainingPayments,
        nextPaymentDate
      };
      addEMI(newEMI);
    }
    
    setShowAddEMI(false);
    setNewEMIData({
      name: '',
      amount: 0,
      startDate: '',
      endDate: '',
      totalPayments: 0,
      autopay: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setNewEMIData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? e.target.checked 
        : name === 'amount' || name === 'totalPayments' 
          ? parseFloat(value) || null 
          : value
    }));
  };

  const handleEditEMI = (emi) => {
    setNewEMIData({
      name: emi.name,
      amount: emi.amount,
      startDate: emi.startDate,
      endDate: emi.endDate,
      totalPayments: emi.totalPayments,
      autopay: emi.autopay
    });
    setSelectedEMIId(emi.id);
    setIsEditing(true);
    setShowAddEMI(true);
  };

  // Calculate total monthly EMI payments
  const totalMonthlyPayments = emis.reduce((sum, emi) => sum + emi.amount, 0);
  
  // Count autopay enabled EMIs
  const autopayEnabledCount = emis.filter(emi => emi.autopay).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Autopay EMIs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">EMI Summary</h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedEMIId(null);
                  setShowAddEMI(!showAddEMI);
                  setNewEMIData({
                    name: '',
                    amount: 0,
                    startDate: '',
                    endDate: '',
                    totalPayments: 0,
                    autopay: true
                  });
                }}
                className="text-light-purple-600 hover:text-light-purple-800"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-light-purple-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Total Monthly Payments</p>
                <p className="text-2xl font-semibold text-gray-800">₹{totalMonthlyPayments.toFixed(2)}</p>
              </div>
              
              <div className="p-4 bg-light-purple-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Active EMIs</p>
                <p className="text-2xl font-semibold text-gray-800">{emis.length}</p>
              </div>
              
              <div className="p-4 bg-light-purple-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Autopay Enabled</p>
                <p className="text-2xl font-semibold text-gray-800">{autopayEnabledCount} of {emis.length}</p>
              </div>
            </div>
            
            {showAddEMI && (
              <div className="mt-6">
                <h3 className="text-md font-medium mb-3">
                  {isEditing ? 'Edit EMI' : 'Add New EMI'}
                </h3>
                <form onSubmit={handleAddEMI} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      EMI Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newEMIData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      placeholder="e.g., Car Loan"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Payment Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={newEMIData.amount}
                        onChange={handleInputChange}
                        className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
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
                      value={newEMIData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={newEMIData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="totalPayments" className="block text-sm font-medium text-gray-700 mb-1">
                      Total Number of Payments
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                    <input
                      type="number"
                      id="totalPayments"
                      name="totalPayments"
                      value={newEMIData.totalPayments}
                      onChange={handleInputChange}
                      className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autopay"
                      name="autopay"
                      checked={newEMIData.autopay}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-light-purple-600 focus:ring-light-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="autopay" className="ml-2 block text-sm text-gray-700">
                      Enable Autopay
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-light-purple-600 text-white py-2 px-4 rounded-md hover:bg-light-purple-700 focus:outline-none focus:ring-2 focus:ring-light-purple-500 focus:ring-offset-2"
                  >
                    {isEditing ? 'Update EMI' : 'Add EMI'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Your EMIs</h2>
            
            {emis.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No EMIs set up yet. Add your first EMI!</p>
            ) : (
              <EMIList emis={emis} onToggleAutopay={toggleEMIAutopay} />
            )}
          </div>
          
          {selectedEMI && !showAddEMI && (
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{selectedEMI.name} Details</h2>
                <button
                  onClick={() => handleEditEMI(selectedEMI)}
                  className="px-3 py-1 bg-light-purple-100 text-light-purple-700 rounded-md hover:bg-light-purple-200"
                >
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Monthly Payment</p>
                  <p className="text-lg font-medium">₹{selectedEMI.amount.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Next Payment Date</p>
                  <p className="text-lg font-medium">{selectedEMI.nextPaymentDate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <p className="text-lg font-medium">{selectedEMI.startDate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">End Date</p>
                  <p className="text-lg font-medium">{selectedEMI.endDate}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Progress</p>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-light-purple-500 h-2 rounded-full" 
                        style={{ width: `${((selectedEMI.totalPayments - selectedEMI.remainingPayments) / selectedEMI.totalPayments) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">
                      {selectedEMI.totalPayments - selectedEMI.remainingPayments}/{selectedEMI.totalPayments} payments
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Autopay Status</p>
                  <p className={`text-lg font-medium ${selectedEMI.autopay ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedEMI.autopay ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Total Remaining</p>
                  <p className="text-lg font-medium text-light-purple-700">
                  {/* ₹{(selectedEMI.amount * selectedEMI.remainingPayments).toFixed(2)} */}
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

export default Autopay;