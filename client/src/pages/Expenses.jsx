import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import ExpenseChart from '../components/ExpenseChart';
import { PlusCircle } from 'lucide-react';

const Expenses = () => {
  const { expenses, addExpense, updateExpense } = useFinance();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpenseData, setNewExpenseData] = useState({
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0] // Initialize with today's date
  });
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    'Housing',
    'Food',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Shopping',
    'Healthcare',
    'Education',
    'Personal',
    'Debt',
    'Savings',
    'Other'
  ];

  const selectedExpense = expenses.find(expense => expense.id === selectedExpenseId);

  const handleAddExpense = (e) => {
    e.preventDefault();
    
    if (isEditing && selectedExpenseId) {
      const updatedExpense = {
        ...newExpenseData,
        id: selectedExpenseId
      };
      updateExpense(updatedExpense);
      setIsEditing(false);
      setSelectedExpenseId(null);
    } else {
      const newExpense = {
        ...newExpenseData,
        id: Date.now().toString()
      };
      addExpense(newExpense);
    }
    
    setShowAddExpense(false);
    setNewExpenseData({
      category: '',
      amount: 0,
      date: '' // Clear date after submission
    });
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewExpenseData(prev => ({
  //     ...prev,
  //     [name]: name === 'amount' ? parseFloat(value) || null : value
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpenseData(prev => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };
  

  const handleEditExpense = (expense) => {
    setNewExpenseData({
      category: expense.category,
      amount: expense.amount,
      date: expense.date
    });
    setSelectedExpenseId(expense.id);
    setIsEditing(true);
    setShowAddExpense(true);
  };

  // Group expenses by category for summary
  const expensesByCategory = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return { category, total };
  }).filter(item => item.total > 0);

  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Monthly Expenses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Expense</h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedExpenseId(null);
                  setShowAddExpense(!showAddExpense);
                  setNewExpenseData({
                    category: '',
                    amount: 0,
                    date: '' // Set today's date when opening form
                  });
                }}
                className="text-light-purple-600 hover:text-light-purple-800"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
            
            {showAddExpense && (
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newExpenseData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={newExpenseData.amount}
                      onChange={handleInputChange}
                      className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newExpenseData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-light-purple-600 text-white py-2 px-4 rounded-md hover:bg-light-purple-700 focus:outline-none focus:ring-2 focus:ring-light-purple-500 focus:ring-offset-2"
                >
                  {isEditing ? 'Update Expense' : 'Add Expense'}
                </button>
              </form>
            )}
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-3">Expense Summary</h3>
              <div className="space-y-2">
                {expensesByCategory.map(({ category, total }) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm">{category}</span>
                    <span className="text-sm font-medium">₹{total.toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">₹{totalExpenses.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <ExpenseChart expenses={expenses} />
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Expense History</h2>
            
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No expenses recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 font-medium text-right">Amount</th>
                      <th className="pb-2 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 text-sm">{expense.date}</td>
                        <td className="py-3 text-sm">{expense.category}</td>
                        <td className="py-3 text-sm text-right font-medium">
                          ₹{expense.amount.toFixed(2)}
                        </td>
                        <td className="py-3 text-sm text-right">
                          <button
                            onClick={() => handleEditExpense(expense)}
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
        </div>
      </div>
    </div>
  );
};

export default Expenses;