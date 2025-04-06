import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { CreditCard as CreditCardIcon, PlusCircle } from 'lucide-react';

function CreditCard() {
  const { creditCards, addCreditCard, addTransaction } = useFinance();
  const [selectedCardId, setSelectedCardId] = useState(
    creditCards.length > 0 ? creditCards[0].id : ''
  );
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardData, setNewCardData] = useState({
    name: '',
    number: '',
    expiryDate: '',
    cvv: '',
    limit: 0,
    balance: 0
  });
  const [error, setError] = useState('');

  const MAX_LIMIT = 200000;
  const selectedCard = creditCards.find(card => card.id === selectedCardId);

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
      .slice(0, 19);
    return formatted;
  };

  const formatExpiryDate = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      let month = parseInt(numbers.slice(0, 2));
      const year = numbers.slice(2, 4);
      
      if (month > 12) month = 12;
      if (month < 1) month = 1;
      
      const formattedMonth = month.toString().padStart(2, '0');
      return `${formattedMonth}${year.length ? '/' + year : ''}`;
    }
    return numbers;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError('');
    
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
      case 'limit':
        const limitValue = parseFloat(value) || null;
        if (limitValue > MAX_LIMIT) {
          setError(`Credit limit cannot exceed ₹${MAX_LIMIT.toLocaleString()}`);
          return;
        }
        formattedValue = limitValue;
        break;
      case 'balance':
        const balanceValue = parseFloat(value) || null;
        if (balanceValue > MAX_LIMIT) {
          setError(`Balance cannot exceed ₹${MAX_LIMIT.toLocaleString()}`);
          return;
        }
        if (balanceValue > newCardData.limit) {
          setError('Balance cannot exceed credit limit');
          return;
        }
        formattedValue = balanceValue;
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
    
    if (newCardData.limit > MAX_LIMIT) {
      setError(`Credit limit cannot exceed ₹${MAX_LIMIT.toLocaleString()}`);
      return;
    }

    if (newCardData.balance > newCardData.limit) {
      setError('Balance cannot exceed credit limit');
      return;
    }

    if (newCardData.balance > MAX_LIMIT) {
      setError(`Balance cannot exceed ₹${MAX_LIMIT.toLocaleString()}`);
      return;
    }

    const newCard = {
      ...newCardData,
      id: Date.now().toString(),
      transactions: []
    };
    addCreditCard(newCard);
    setSelectedCardId(newCard.id);
    setShowAddCard(false);
    setNewCardData({
      name: '',
      number: '',
      expiryDate: '',
      cvv: '',
      limit: 0,
      balance: 0
    });
    setError('');
  };

  const handleTransactionSubmit = (transactionData) => {
    if (selectedCardId) {
      const card = creditCards.find(c => c.id === selectedCardId);
      const newBalance = card.balance + transactionData.amount;
      
      if (newBalance > MAX_LIMIT) {
        setError(`Transaction would exceed maximum limit of ₹${MAX_LIMIT.toLocaleString()}`);
        return;
      }

      if (newBalance > card.limit) {
        setError('Transaction would exceed credit limit');
        return;
      }

      const newTransaction = {
        ...transactionData,
        id: Date.now().toString()
      };
      addTransaction(selectedCardId, newTransaction, 'creditCard');
      setError('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Credit Cards</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Credit Cards</h2>
              <button
                onClick={() => setShowAddCard(!showAddCard)}
                className="text-blue-600 hover:text-blue-800"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>
            
            {showAddCard && (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Add New Credit Card</h3>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Rewards Card"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="***"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
                      Credit Limit (Max: ₹200,000)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        id="limit"
                        name="limit"
                        value={newCardData.limit}
                        onChange={handleInputChange}
                        className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        max={MAX_LIMIT}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Balance (Max: ₹200,000)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        id="balance"
                        name="balance"
                        value={newCardData.balance}
                        onChange={handleInputChange}
                        className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        max={MAX_LIMIT}
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Credit Card
                  </button>
                </form>
              </div>
            )}
            
            {creditCards.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No credit cards yet. Add your first card!</p>
            ) : (
              <div className="space-y-3">
                {creditCards.map(card => (
                  <div
                    key={card.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedCardId === card.id
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-gray-50 hover:bg-blue-50'
                    }`}
                    onClick={() => setSelectedCardId(card.id)}
                  >
                    <div className="flex items-center mb-2">
                      <CreditCardIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-medium">{card.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{card.number}</p>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Limit: ₹{card.limit.toFixed(2)}</p>
                      <p className="text-sm font-medium text-red-600">Balance: ₹{card.balance.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
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
              <p className="text-gray-500">Select a credit card to view transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreditCard;