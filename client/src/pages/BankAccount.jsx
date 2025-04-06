import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import AccountForm from '../components/AccountForm';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { PlusCircle } from 'lucide-react';

const BankAccount = () => {
  const { accounts, addAccount, addTransaction } = useFinance();
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.length > 0 ? accounts[0].id : ''
  );
  const [showAddAccount, setShowAddAccount] = useState(false);

  const selectedAccount = accounts.find(account => account.id === selectedAccountId);

  const handleAccountSubmit = (accountData) => {
    const newAccount = {
      ...accountData,
      id: Date.now().toString(),
      transactions: []
    };
    addAccount(newAccount);
    setSelectedAccountId(newAccount.id);
    setShowAddAccount(false);
  };

  const handleTransactionSubmit = (transactionData) => {
    if (selectedAccountId) {
      const newTransaction = {
        ...transactionData,
        id: Date.now().toString()
      };
      addTransaction(selectedAccountId, newTransaction, 'account');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bank Accounts</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Accounts</h2>
              <button
                onClick={() => setShowAddAccount(!showAddAccount)}
                className="text-light-purple-600 hover:text-light-purple-800"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
            
            {showAddAccount && (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Add New Account</h3>
                <AccountForm onSubmit={handleAccountSubmit} />
              </div>
            )}
            
            {accounts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No accounts yet. Add your first account!</p>
            ) : (
              <div className="space-y-3">
                {accounts.map(account => (
                  <div
                    key={account.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedAccountId === account.id
                        ? 'bg-light-purple-100 border-2 border-light-purple-300'
                        : 'bg-gray-50 hover:bg-light-purple-50'
                    }`}
                    onClick={() => setSelectedAccountId(account.id)}
                  >
                    <h3 className="font-medium">{account.name}</h3>
                    <p className={`text-lg font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{account.balance.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selectedAccount && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
              <TransactionForm onSubmit={handleTransactionSubmit} />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {selectedAccount ? (
            <TransactionList 
              transactions={selectedAccount.transactions} 
              title={`Transactions - ${selectedAccount.name}`} 
            />
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center h-64">
              <p className="text-gray-500">Select an account to view transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankAccount;