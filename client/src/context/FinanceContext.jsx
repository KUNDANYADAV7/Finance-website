import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



// Sample data
const initialAccounts = [
  {
    id: '1',
    name: 'Checking Account',
    balance: 5000,
    transactions: [
      { id: '1', date: '2023-05-01', description: 'Salary', amount: 3000, category: 'Income' },
      { id: '2', date: '2023-05-05', description: 'Rent', amount: -1200, category: 'Housing' },
    ],
  },
];

const initialCreditCards = [
  {
    id: '1',
    name: 'Rewards Card',
    number: '**** **** **** 4321',
    expiryDate: '05/26',
    cvv: '***',
    limit: 200000,
    balance: 2500,
    transactions: [
      { id: '1', date: '2023-05-10', description: 'Amazon', amount: -150, category: 'Shopping' },
      { id: '2', date: '2023-05-15', description: 'Restaurant', amount: -85, category: 'Dining' },
    ],
  },
];

const initialDebitCards = [
  {
    id: '1',
    name: 'Main Debit Card',
    number: '**** **** **** 1234',
    expiryDate: '03/25',
    cvv: '***',
    linkedAccount: '1',
    transactions: [
      { id: '1', date: '2023-05-12', description: 'Grocery Store', amount: -75, category: 'Groceries' },
      { id: '2', date: '2023-05-18', description: 'Gas Station', amount: -45, category: 'Transportation' },
    ],
  },
];

const initialInvestments = [
  {
    id: '1',
    name: 'Stock Portfolio',
    type: 'Stocks',
    amount: 10000,
    returnRate: 8.5,
    startDate: '2022-01-15',
  },
  {
    id: '2',
    name: 'Retirement Fund',
    type: '401k',
    amount: 25000,
    returnRate: 6.2,
    startDate: '2020-03-10',
  },
];

const initialBudgets = [
  {
    id: '1',
    month: 'May',
    year: 2023,
    categories: [
      { id: '1', name: 'Housing', allocated: 1500, spent: 1200 },
      { id: '2', name: 'Food', allocated: 600, spent: 450 },
      { id: '3', name: 'Transportation', allocated: 300, spent: 250 },
      { id: '4', name: 'Entertainment', allocated: 200, spent: 180 },
      { id: '5', name: 'Utilities', allocated: 400, spent: 350 },
    ],
  },
];

const initialExpenses = [
  { id: '1', category: 'Housing', amount: 1200, date: '2023-05-01' },
  { id: '2', category: 'Food', amount: 450, date: '2023-05-15' },
  { id: '3', category: 'Transportation', amount: 250, date: '2023-05-10' },
  { id: '4', category: 'Entertainment', amount: 180, date: '2023-05-20' },
  { id: '5', category: 'Utilities', amount: 350, date: '2023-05-05' },
];

const initialEMIs = [
  {
    id: '1',
    name: 'Car Loan',
    amount: 350,
    startDate: '2022-01-15',
    endDate: '2027-01-15',
    remainingPayments: 44,
    totalPayments: 60,
    nextPaymentDate: '2023-06-15',
    autopay: true,
  },
  {
    id: '2',
    name: 'Home Loan',
    amount: 1200,
    startDate: '2020-05-10',
    endDate: '2040-05-10',
    remainingPayments: 204,
    totalPayments: 240,
    nextPaymentDate: '2023-06-10',
    autopay: true,
  },
];

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  // Load data from localStorage or use initial data if not available
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('accounts');
    return savedAccounts ? JSON.parse(savedAccounts) : initialAccounts;
  });
  
  const [creditCards, setCreditCards] = useState(() => {
    const savedCreditCards = localStorage.getItem('creditCards');
    return savedCreditCards ? JSON.parse(savedCreditCards) : initialCreditCards;
  });
  
  const [debitCards, setDebitCards] = useState(() => {
    const savedDebitCards = localStorage.getItem('debitCards');
    return savedDebitCards ? JSON.parse(savedDebitCards) : initialDebitCards;
  });
  
  const [investments, setInvestments] = useState(() => {
    const savedInvestments = localStorage.getItem('investments');
    return savedInvestments ? JSON.parse(savedInvestments) : initialInvestments;
  });
  
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : initialBudgets;
  });
  
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : initialExpenses;
  });
  
  const [emis, setEmis] = useState(() => {
    const savedEmis = localStorage.getItem('emis');
    return savedEmis ? JSON.parse(savedEmis) : initialEMIs;
  });
  
  const navigate = useNavigate();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('creditCards', JSON.stringify(creditCards));
  }, [creditCards]);

  useEffect(() => {
    localStorage.setItem('debitCards', JSON.stringify(debitCards));
  }, [debitCards]);

  useEffect(() => {
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('emis', JSON.stringify(emis));
  }, [emis]);

  const addAccount = (account) => {
    setAccounts([...accounts, account]);
  };

  const updateAccount = (updatedAccount) => {
    setAccounts(accounts.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    ));
  };

  const addCreditCard = (card) => {
    setCreditCards([...creditCards, card]);
  };

  const updateCreditCard = (updatedCard) => {
    setCreditCards(creditCards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const addDebitCard = (card) => {
    setDebitCards([...debitCards, card]);
  };

  const updateDebitCard = (updatedCard) => {
    setDebitCards(debitCards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const addInvestment = (investment) => {
    setInvestments([...investments, investment]);
  };

  const updateInvestment = (updatedInvestment) => {
    setInvestments(investments.map(investment => 
      investment.id === updatedInvestment.id ? updatedInvestment : investment
    ));
  };

  const addBudget = (budget) => {
    setBudgets([...budgets, budget]);
  };

  const updateBudget = (updatedBudget) => {
    setBudgets(budgets.map(budget => 
      budget.id === updatedBudget.id ? updatedBudget : budget
    ));
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
  };

  const addEMI = (emi) => {
    setEmis([...emis, emi]);
  };

  const updateEMI = (updatedEMI) => {
    setEmis(emis.map(emi => 
      emi.id === updatedEMI.id ? updatedEMI : emi
    ));
  };

  const toggleEMIAutopay = (id) => {
    setEmis(emis.map(emi => 
      emi.id === id ? { ...emi, autopay: !emi.autopay } : emi
    ));
  };

  const addTransaction = (accountId, transaction, type) => {
    if (type === 'account') {
      const updatedAccounts = accounts.map(account => {
        if (account.id === accountId) {
          const newBalance = account.balance + transaction.amount;
          return {
            ...account,
            balance: newBalance,
            transactions: [...account.transactions, transaction]
          };
        }
        return account;
      });
      setAccounts(updatedAccounts);
    } else if (type === 'creditCard') {
      const updatedCards = creditCards.map(card => {
        if (card.id === accountId) {
          const newBalance = card.balance - transaction.amount;
          return {
            ...card,
            balance: newBalance,
            transactions: [...card.transactions, transaction]
          };
        }
        return card;
      });
      setCreditCards(updatedCards);
    } else if (type === 'debitCard') {
      const updatedCards = debitCards.map(card => {
        if (card.id === accountId) {
          return {
            ...card,
            transactions: [...card.transactions, transaction]
          };
        }
        return card;
      });
      setDebitCards(updatedCards);
      
      // Also update the linked account balance
      const linkedCard = debitCards.find(card => card.id === accountId);
      if (linkedCard) {
        const updatedAccounts = accounts.map(account => {
          if (account.id === linkedCard.linkedAccount) {
            const newBalance = account.balance + transaction.amount;
            return {
              ...account,
              balance: newBalance
            };
          }
          return account;
        });
        setAccounts(updatedAccounts);
      }
    }
  };

  const updateBudgetCategory = (budgetId, updatedCategory) => {
    const updatedBudgets = budgets.map(budget => {
      if (budget.id === budgetId) {
        const updatedCategories = budget.categories.map(category => 
          category.id === updatedCategory.id ? updatedCategory : category
        );
        return { ...budget, categories: updatedCategories };
      }
      return budget;
    });
    setBudgets(updatedBudgets);
  };

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        creditCards,
        debitCards,
        investments,
        budgets,
        expenses,
        emis,
        addAccount,
        updateAccount,
        addCreditCard,
        updateCreditCard,
        addDebitCard,
        updateDebitCard,
        addInvestment,
        updateInvestment,
        addBudget,
        updateBudget,
        addExpense,
        updateExpense,
        addEMI,
        updateEMI,
        toggleEMIAutopay,
        addTransaction,
        updateBudgetCategory
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};