import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PlusCircle } from 'lucide-react';

function Budget() {
  const { budgets, addBudget, updateBudgetCategory } = useFinance();
  const [selectedBudgetId, setSelectedBudgetId] = useState(
    budgets.length > 0 ? budgets[0].id : ''
  );
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudgetData, setNewBudgetData] = useState({
    // month: new Date().toLocaleString('default', { month: 'long' }),
    month: '',
    year: '',
    categories: [
      { id: '1', name: '', allocated: 0, spent: 0, required: true },
      { id: '2', name: '', allocated: 0, spent: 0, required: true },
      { id: '3', name: '', allocated: 0, spent: 0, required: true },
      { id: '4', name: '', allocated: '', spent: '', required: false },
      { id: '5', name: '', allocated: '', spent: '', required: false }
    ]
  });
  const [showUpdateCategory, setShowUpdateCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [validationError, setValidationError] = useState('');

  const selectedBudget = budgets.find(budget => budget.id === selectedBudgetId);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleAddBudget = (e) => {
    e.preventDefault();
    
    // Validate required categories
    const requiredCategories = newBudgetData.categories.filter(cat => cat.required);
    const hasEmptyRequired = requiredCategories.some(cat => 
      !cat.name.trim() || cat.allocated === 0
    );

    if (hasEmptyRequired) {
      setValidationError('The first three categories are mandatory.');
      return;
    }

    // Filter out empty optional categories
    const filteredCategories = newBudgetData.categories.filter(cat => 
      cat.required || (cat.name.trim() && (parseFloat(cat.allocated) > 0 || parseFloat(cat.spent) > 0))
    );

    // Check if budget for this month/year already exists
    const budgetExists = budgets.some(budget => 
      budget.month === newBudgetData.month && budget.year === newBudgetData.year
    );

    if (budgetExists) {
      setValidationError('A budget for this month and year already exists.');
      return;
    }

    // Clear validation error if everything is valid
    setValidationError('');

    const newBudget = {
      ...newBudgetData,
      categories: filteredCategories,
      id: Date.now().toString()
    };
    addBudget(newBudget);
    setSelectedBudgetId(newBudget.id);
    setShowAddBudget(false);
    
    // Reset form
    setNewBudgetData({
      month: '',
      year: '',
      categories: [
        { id: '1', name: '', allocated: 0, spent: 0, required: true },
        { id: '2', name: '', allocated: 0, spent: 0, required: true },
        { id: '3', name: '', allocated: 0, spent: 0, required: true },
        { id: '4', name: '', allocated: '', spent: '', required: false },
        { id: '5', name: '', allocated: '', spent: '', required: false }
      ]
    });
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...newBudgetData.categories];
    if (field === 'name') {
      updatedCategories[index].name = value;
    } else {
      // Allow empty string when backspacing
      updatedCategories[index][field] = value === '' ? '' : parseFloat(value) || 0;
    }
    setNewBudgetData({ ...newBudgetData, categories: updatedCategories });
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (selectedBudgetId && selectedCategory) {
      // Convert any empty string values to 0 before updating
      const updatedCategory = {
        ...selectedCategory,
        allocated: selectedCategory.allocated === '' ? 0 : parseFloat(selectedCategory.allocated),
        spent: selectedCategory.spent === '' ? 0 : parseFloat(selectedCategory.spent)
      };
      updateBudgetCategory(selectedBudgetId, updatedCategory);
      setShowUpdateCategory(false);
      setSelectedCategory(null);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory({ ...category });
    setShowUpdateCategory(true);
  };

  const handleSelectedCategoryChange = (field, value) => {
    if (selectedCategory) {
      setSelectedCategory({
        ...selectedCategory,
        [field]: value === '' ? '' : parseFloat(value) || 0
      });
    }
  };

  // Calculate total allocated and spent
  const totalAllocated = selectedBudget
    ? selectedBudget.categories.reduce((sum, category) => sum + (parseFloat(category.allocated) || 0), 0)
    : 0;
  
  const totalSpent = selectedBudget
    ? selectedBudget.categories.reduce((sum, category) => sum + (parseFloat(category.spent) || 0), 0)
    : 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Budget Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Budgets</h2>
              <button
                onClick={() => {
                  setShowAddBudget(!showAddBudget);
                  setValidationError('');
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
            
            {showAddBudget && (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Create New Budget</h3>
                {validationError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {validationError}
                  </div>
                )}
                <form onSubmit={handleAddBudget} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                      </label>
                      <select
                        id="month"
                        name="month"
                        value={newBudgetData.month}
                        onChange={(e) => setNewBudgetData({ ...newBudgetData, month: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                      <option value="" disabled>Select Month</option>
                        {months.map(month => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        id="year"
                        name="year"
                        value={newBudgetData.year}
                        onChange={(e) => setNewBudgetData({ ...newBudgetData, year: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder='Enter Year'
                        required
                      />
                    </div> */}
                    <div>
  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
    Year
  </label>
  <input
    type="number"
    id="year"
    name="year"
    value={newBudgetData.year}
    onChange={(e) => {
      const inputYear = e.target.value;
      if (inputYear.length <= 4) {
        setNewBudgetData({ ...newBudgetData, year: inputYear });
      }
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter Year"
    required
  />
</div>

                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Budget Categories</h4>
                    {newBudgetData.categories.map((category, index) => (
                      <div key={category.id} className="mb-4 p-3 bg-gray-50 rounded-md">
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name {category.required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="text"
                            value={category.name}
                            onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter category name${category.required ? '' : ' (optional)'}`}
                            required={category.required}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Allocated {category.required && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">₹</span>
                              </div>
                              <input
                                type="number"
                                value={category.allocated}
                                onChange={(e) => handleCategoryChange(index, 'allocated', e.target.value)}
                                className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                                step="0.01"
                                required={category.required}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Spent {category.required && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">₹</span>
                              </div>
                              <input
                                type="number"
                                value={category.spent}
                                onChange={(e) => handleCategoryChange(index, 'spent', e.target.value)}
                                className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                                step="0.01"
                                required={category.required}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create Budget
                  </button>
                </form>
              </div>
            )}
            
            {budgets.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No budgets yet. Create your first budget!</p>
            ) : (
              <div className="space-y-3">
                {budgets.map(budget => (
                  <div
                    key={budget.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedBudgetId === budget.id
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-gray-50 hover:bg-blue-50'
                    }`}
                    onClick={() => setSelectedBudgetId(budget.id)}
                  >
                    <h3 className="font-medium">{budget.month} {budget.year}</h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Total Allocated:</span>
                        <span className="font-medium">
                          ₹{budget.categories.reduce((sum, cat) => sum + (parseFloat(cat.allocated) || 0), 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Spent:</span>
                        <span className="font-medium">
                          ₹{budget.categories.reduce((sum, cat) => sum + (parseFloat(cat.spent) || 0), 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2">
          {selectedBudget ? (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">{selectedBudget.month} {selectedBudget.year} Budget</h2>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-blue-700">₹{totalSpent.toFixed(2)}</span> of <span className="font-medium">₹{totalAllocated.toFixed(2)}</span> spent
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div 
                    className={`h-2.5 rounded-full ${totalSpent > totalAllocated ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="space-y-4">
                  {selectedBudget.categories.map(category => (
                    <div 
                      key={category.id} 
                      className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{category.name}</h3>
                        <div className="text-sm">
                          <span className={`font-medium ${category.spent > category.allocated ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{(parseFloat(category.spent) || 0).toFixed(2)}
                          </span> 
                          <span className="text-gray-500"> / ₹{(parseFloat(category.allocated) || 0).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${category.spent > category.allocated ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min((parseFloat(category.spent) / parseFloat(category.allocated)) * 100 || 0, 100)}%` }}
                        ></div>
                      </div>
                      
                      {category.spent > category.allocated && (
                        <p className="text-xs text-red-500 mt-1">
                          Over budget by ₹{((parseFloat(category.spent) || 0) - (parseFloat(category.allocated) || 0)).toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {showUpdateCategory && selectedCategory && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Update {selectedCategory.name}</h3>
                  <form onSubmit={handleUpdateCategory} className="space-y-4">
                    <div>
                      <label htmlFor="allocated" className="block text-sm font-medium text-gray-700 mb-1">
                        Allocated Amount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          type="number"
                          id="allocated"
                          value={selectedCategory.allocated}
                          onChange={(e) => handleSelectedCategoryChange('allocated', e.target.value)}
                          className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="spent" className="block text-sm font-medium text-gray-700 mb-1">
                        Spent Amount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          type="number"
                          id="spent"
                          value={selectedCategory.spent}
                          onChange={(e) => handleSelectedCategoryChange('spent', e.target.value)}
                          className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUpdateCategory(false);
                          setSelectedCategory(null);
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center h-64">
              <p className="text-gray-500">Select a budget to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Budget;