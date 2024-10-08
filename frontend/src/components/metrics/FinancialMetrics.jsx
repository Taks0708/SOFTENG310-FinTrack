import React, { useState, useContext, useEffect } from 'react';
import TransactionContext from '../../context/TransactionContext';
import '../../assets/css/default.css';
import {convertCurrency} from '../../utility/CurrencyUtil';
import DefaultButton from '../default/DefaultButton.jsx';

export default function FinancialMetrics() {
  const { balance, currency, allTransactions,goal} = useContext(TransactionContext);
  const [monthlyMetrics, setMonthlyMetrics] = useState({ monthlySpending: 0,
    monthlyIncome: 0,
    percentageSpent: 0,
    percentageSaved: 0});

  const [lifetimeMetrics, setLifetimeMetrics] = useState({
      totalSpending: 0,
      totalIncome: 0,
      percentOfGoal:0
  });

  const [convertedMonthlyMetrics, setConvertedMonthlyMetrics] = useState({ monthlySpending: 0,
      monthlyIncome: 0,
      percentageSpent: 0,
      percentageSaved: 0});

  const [convertedLifetimeMetrics, setConvertedLifetimeMetrics] = useState({  
      totalSpending: 0,
      totalIncome: 0,
      percentOfGoal:0
    });
        
  


  useEffect(() => {
    const fetchData = async () => {
      await calculateMetrics(allTransactions); //transactions change
      await calculateCurrency();
    };

    fetchData();

  },[allTransactions,currency,goal,balance])

  async function calculateCurrency(){
    const convertedMonthlySpending = await convertCurrency(currency, "NZD", monthlyMetrics.monthlySpending);
    const convertedMonthlyIncome = await convertCurrency(currency, "NZD", monthlyMetrics.monthlyIncome);
    const convertedTotalSpending = await convertCurrency(currency, "NZD", lifetimeMetrics.totalSpending);
    const convertedTotalIncome = await convertCurrency(currency, "NZD", lifetimeMetrics.totalIncome);
    const convertedBal = await convertCurrency(currency, "NZD", balance);

    const convertedPercentOfGoal = Math.round(convertedBal/goal * 100 * 100)/100 

    setConvertedMonthlyMetrics({
        monthlySpending: convertedMonthlySpending,
        monthlyIncome: convertedMonthlyIncome,
        percentageSpent: monthlyMetrics.percentageSpent,
        percentageSaved: monthlyMetrics.percentageSaved
    });

    setConvertedLifetimeMetrics({
        totalSpending: convertedTotalSpending,
        totalIncome: convertedTotalIncome,
        percentOfGoal:convertedPercentOfGoal 
    });
  }
  // Takes in a list of transactions and calculates the monthly spending, income, and percentages. This should always be
  // the full list of transactions, not just the ones currently displayed.
  function calculateMetrics (transactions) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
  
    let monthlySpending = 0;
    let monthlyIncome = 0;
    let totalSpending = 0;
    let totalIncome = 0;

  
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.created_at);
      const isCurrentMonth = transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;

      if (isCurrentMonth) {
        if (transaction.amount < 0) {
          monthlySpending += Math.abs(transaction.amount); // Spending is negative
        } else {
          monthlyIncome += parseFloat(transaction.amount); // Income is positive
        }
      }
      if (transaction.amount < 0) {
        totalSpending += Math.abs(transaction.amount); // Spending is negative
      } else {
        totalIncome += parseFloat(transaction.amount); // Income is positive
      }



    });
  
    const percentageSpent = monthlyIncome > 0 ? (monthlySpending / monthlyIncome) * 100 : 0;
    const percentageSaved = 100 - percentageSpent;

    const percentOfGoal = Math.round(balance/goal * 100 * 100)/100
  
    setMonthlyMetrics({
      monthlySpending,
      monthlyIncome,
      percentageSpent,
      percentageSaved
    });

    setLifetimeMetrics({
      totalSpending,
      totalIncome,
      percentOfGoal
    })
  };

  // Function to toggle the visibility of the modal
 
   


  return (
    <div className="flex justify-center">   
      <div className="inline-block border-4 border-main-green rounded-lg shadow-lg ">
        <h2 className="bg-main-green text-body text-white font-semibold p-2">Financial Metrics</h2>
        
        <div className='flex justify-center p-5'>
          
          <div className='mr-4 bg-slate-300 p-5 rounded-lg shadow-lg'>
            <h2 className="text-body-small font-semibold mb-4">Monthly</h2>
            <p><strong>Spending This Month:</strong> {convertedMonthlyMetrics.monthlySpending} {currency}</p>
            <p><strong>Income This Month:</strong> {convertedMonthlyMetrics.monthlyIncome} {currency}</p>
            <p><strong>% Income Spent:</strong> {convertedMonthlyMetrics.percentageSpent.toFixed(2)}%</p>
            <p><strong>% Income Saved:</strong> {convertedMonthlyMetrics.percentageSaved.toFixed(2)}%</p>
          </div>


          <div className='ml-4 bg-slate-300 p-5 rounded-lg shadow-lg'>
            <h2 className="text-body-small font-semibold mb-4">Lifetime</h2>
            <p><strong>Balance</strong> {Math.round(balance*100)/100} {currency}</p>
            <p><strong>Percent Of Goal</strong> {convertedLifetimeMetrics.percentOfGoal}%</p>
            <p><strong>Total Income:</strong> {convertedLifetimeMetrics.totalIncome} {currency}</p>
            <p><strong>Total Spending:</strong> {convertedLifetimeMetrics.totalSpending} {currency}</p>
          </div>
        </div>
      </div>
    </div>     
    
  );
}
