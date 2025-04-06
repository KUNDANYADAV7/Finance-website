



import React, { useState } from 'react';

const AccountForm = ({ 
  onSubmit, 
  initialData = { name: '', balance: 0 }, 
  buttonText = 'Add Account' 
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || null : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      setFormData({ name: '', balance: 0 });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Account Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
          placeholder="e.g., Checking Account"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
          Initial Balance
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">₹</span>
          </div>
          <input
            type="number"
            id="balance"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        {errors.balance && <p className="mt-1 text-sm text-red-600">{errors.balance}</p>}
      </div>
      
      <button
        type="submit"
        className="w-full bg-light-purple-600 text-white py-2 px-4 rounded-md hover:bg-light-purple-700 focus:outline-none focus:ring-2 focus:ring-light-purple-500 focus:ring-offset-2"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default AccountForm;