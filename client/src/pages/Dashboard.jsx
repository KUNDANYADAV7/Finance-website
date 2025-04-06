import React from 'react';
import { useFinance } from '../context/FinanceContext';
import DashboardCard from '../components/DashboardCard';
import TransactionList from '../components/TransactionList';
import BudgetProgress from '../components/BudgetProgress';
import ExpenseChart from '../components/ExpenseChart';
import InvestmentChart from '../components/InvestmentChart';
import { Wallet, CreditCard, PiggyBank, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { 
    accounts, 
    creditCards, 
    investments, 
    budgets, 
    expenses 
  } = useFinance();

  // Calculate total account balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate total credit card debt
  const totalCreditCardDebt = creditCards.reduce((sum, card) => sum + card.balance, 0);
  
  // Calculate total investments
  const totalInvestments = investments.reduce((sum, investment) => sum + investment.amount, 0);
  
  // Calculate total budget allocated
  const totalBudgetAllocated = budgets.length > 0
    ? budgets[0].categories.reduce((sum, category) => sum + category.allocated, 0)
    : 0;
  
  // Calculate total budget spent
  const totalBudgetSpent = budgets.length > 0
    ? budgets[0].categories.reduce((sum, category) => sum + category.spent, 0)
    : 0;
  
  // Get recent transactions from all accounts and credit cards
  const allTransactions = [
    ...accounts.flatMap(account => 
      account.transactions.map(transaction => ({
        ...transaction,
        source: account.name
      }))
    ),
    ...creditCards.flatMap(card => 
      card.transactions.map(transaction => ({
        ...transaction,
        source: card.name
      }))
    )
  ];
  
  // Sort transactions by date (most recent first)
  const recentTransactions = [...allTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Balance"
          value={`₹${totalBalance.toFixed(2)}`}
          icon={<Wallet className="h-6 w-6 text-light-purple-600" />}
          change={{ value: 3.2, isPositive: true }}
        />
        
        <DashboardCard
          title="Credit Card Debt"
          value={`₹${totalCreditCardDebt.toFixed(2)}`}
          icon={<CreditCard className="h-6 w-6 text-light-purple-600" />}
          change={{ value: 1.5, isPositive: false }}
        />
        
        <DashboardCard
          title="Total Investments"
          value={`₹${totalInvestments.toFixed(2)}`}
          icon={<PiggyBank className="h-6 w-6 text-light-purple-600" />}
          change={{ value: 5.7, isPositive: true }}
        />
        
        <DashboardCard
          title="Budget Utilization"
          value={`₹${totalBudgetAllocated > 0 ? Math.round((totalBudgetSpent / totalBudgetAllocated) * 100) : 0}%`}
          icon={<BarChart3 className="h-6 w-6 text-light-purple-600" />}
          change={
            totalBudgetAllocated > 0 
              ? { 
                  value: 2.3, 
                  isPositive: totalBudgetSpent <= totalBudgetAllocated 
                }
              : undefined
          }
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TransactionList transactions={recentTransactions} />
        {budgets.length > 0 && <BudgetProgress categories={budgets[0].categories} />}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart expenses={expenses} />
        <InvestmentChart investments={investments} />
      </div>
    </div>
  );
};

export default Dashboard;