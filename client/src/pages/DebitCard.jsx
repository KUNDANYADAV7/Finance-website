import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { CreditCard as DebitCardIcon, PlusCircle } from 'lucide-react';

const DebitCard = () => {
  const { debitCards, accounts, addDebitCard, addTransaction } = useFinance();
  const [selectedCardId, setSelectedCardId] = useState(
    debitCards.length > 0 ? debitCards[0].id : ''
  );
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardData, setNewCardData] = useState({
    name: '',
    number: '',
    expiryDate: '',
    cvv: '',
    linkedAccount: accounts.length > 0 ? accounts[0].id : ''
  });

  const selectedCard = debitCards.find(card => card.id === selectedCardId);

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const chars = numbers.split('');
    const formatted = chars
      .reduce((acc, curr, i) => {
        if (i && i % 4 === 0) {
          acc.push(' ');
        }
        acc.push(curr);
        return acc;
      }, [])
      .join('')
      .slice(0, 19); // 16 digits + 3 spaces
    return formatted;
  };

  const formatExpiryDate = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      let month = parseInt(numbers.slice(0, 2));
      const year = numbers.slice(2, 4);
      
      // Validate and adjust month
      if (month > 12) month = 12;
      if (month < 1) month = 1;
      
      const formattedMonth = month.toString().padStart(2, '0');
      return `${formattedMonth}${year.length ? '/' + year : ''}`;
    }
    return numbers;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    switch (name) {
      case 'number':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        break;
      case 'cvv':
        formattedValue = value.replace(/\D/g, '').slice(0, 3);
        break;
      default:
        formattedValue = value;
    }

    setNewCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const newCard = {
      ...newCardData,
      id: Date.now().toString(),
      transactions: []
    };
    addDebitCard(newCard);
    setSelectedCardId(newCard.id);
    setShowAddCard(false);
    setNewCardData({
      name: '',
      number: '',
      expiryDate: '',
      cvv: '',
      linkedAccount: accounts.length > 0 ? accounts[0].id : ''
    });
  };

  const handleTransactionSubmit = (transactionData) => {
    if (selectedCardId) {
      const newTransaction = {
        ...transactionData,
        id: Date.now().toString()
      };
      addTransaction(selectedCardId, newTransaction, 'debitCard');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Debit Cards</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Debit Cards</h2>
              <button
                onClick={() => setShowAddCard(!showAddCard)}
                className="text-light-purple-600 hover:text-light-purple-800"
                disabled={accounts.length === 0}
                title={accounts.length === 0 ? "Add a bank account first" : "Add debit card"}
              >
                <PlusCircle className={`h-5 w-5 ${accounts.length === 0 ? 'opacity-50' : ''}`} />
              </button>
            </div>
            
            {accounts.length === 0 && (
              <p className="text-amber-600 text-sm mb-4">Please add a bank account before adding a debit card.</p>
            )}
            
            {showAddCard && accounts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Add New Debit Card</h3>
                <form onSubmit={handleAddCard} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newCardData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      placeholder="e.g., Main Debit Card"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="number"
                      name="number"
                      value={newCardData.number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      placeholder="**** **** **** ****"
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={newCardData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={newCardData.cvv}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                        placeholder="***"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="linkedAccount" className="block text-sm font-medium text-gray-700 mb-1">
                      Linked Bank Account
                    </label>
                    <select
                      id="linkedAccount"
                      name="linkedAccount"
                      value={newCardData.linkedAccount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-purple-500"
                      required
                    >
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.name} (₹{account.balance.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-light-purple-600 text-white py-2 px-4 rounded-md hover:bg-light-purple-700 focus:outline-none focus:ring-2 focus:ring-light-purple-500 focus:ring-offset-2"
                  >
                    Add Debit Card
                  </button>
                </form>
              </div>
            )}
            
            {debitCards.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No debit cards yet. Add your first card!</p>
            ) : (
              <div className="space-y-3">
                {debitCards.map(card => {
                  const linkedAccount = accounts.find(account => account.id === card.linkedAccount);
                  
                  return (
                    <div
                      key={card.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedCardId === card.id
                          ? 'bg-light-purple-100 border-2 border-light-purple-300'
                          : 'bg-gray-50 hover:bg-light-purple-50'
                      }`}
                      onClick={() => setSelectedCardId(card.id)}
                    >
                      <div className="flex items-center mb-2">
                        <DebitCardIcon className="h-5 w-5 text-light-purple-600 mr-2" />
                        <h3 className="font-medium">{card.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{card.number}</p>
                      <p className="text-sm text-gray-500">
                        Linked to: {linkedAccount ? linkedAccount.name : 'Unknown account'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {selectedCard && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
              <TransactionForm onSubmit={handleTransactionSubmit} />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {selectedCard ? (
            <TransactionList 
              transactions={selectedCard.transactions} 
              title={`Transactions - ${selectedCard.name}`} 
            />
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center h-64">
              <p className="text-gray-500">Select a debit card to view transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebitCard;