import React, { useState, useContext } from 'react';
import TransactionContext from '../context/TransactionContext';
import axios from 'axios';

export default function FinancialMetrics() {
  const [showMetrics, setShowMetrics] = useState(false);
  const { balance, currency, convertCurrency, allTransactions } = useContext(TransactionContext);
  const [convertedBalance, setConvertedBalance] = useState(0);
  const [monthlyMetrics, setMonthlyMetrics] = useState({});

  // Takes in a list of transactions and calculates the monthly spending, income, and percentages. This should always be
  // the full list of transactions, not just the ones currently displayed.
  const calculateMetrics = async () => {
    try {
      const response = await axios.get('/transactions/metrics');
      if (response.data.success) {
        setMonthlyMetrics(response.data.metrics);
      } else {
        console.error('Failed to fetch metrics');
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  // Function to toggle the visibility of the modal
  const handleClick = () => {
    setShowMetrics(!showMetrics);
    calculateMetrics(allTransactions);
  };

  // Calculate and set the converted balance when currency or balance changes
  React.useEffect(() => {
    const updateConvertedBalance = async () => {
      const converted = await convertCurrency(currency, 'NZD', balance); // Convert balance to current currency
      setConvertedBalance(converted);
    };
    updateConvertedBalance();
  }, [currency, balance, convertCurrency]);

  return (
    <div className="text-center">
      <button
        onClick={handleClick}
        className="bg-green-500 text-white text-button px-3 py-3 min-w-[280px] rounded-full hover:bg-green-600 active:bg-green-700">
        Financial Metrics
      </button>

      {/* Conditionally render the modal */}
      {showMetrics && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Financial Metrics</h2>
            <p><strong>Current Balance:</strong> {convertedBalance} {currency}</p>
            <p><strong>Spending this Month:</strong> {monthlyMetrics.monthlySpending} {currency}</p>
            <p><strong>Income this Month:</strong> {monthlyMetrics.monthlyIncome} {currency}</p>
            <p><strong>% Income Spent:</strong> {monthlyMetrics.percentageSpent.toFixed(2)}%</p>
            <p><strong>% Income Saved:</strong> {monthlyMetrics.percentageSaved.toFixed(2)}%</p>
            <button
              onClick={handleClick}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
