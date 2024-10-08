import TransactionContext from "./TransactionContext.jsx";
import { useEffect, useState } from "react";
import { refreshDisplayGoal, refreshDisplayBalance } from "../utility/CurrencyUtil";
import axios from "axios";

// Context provider for transactions. Allows for the sharing of transaction data between components
export function TransactionContextProvider({ children }) {
  const [currency, setCurrency] = useState("NZD"); // default currency is NZD
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [balance, setBalance] = useState(0);
  const [goal, setGoal] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [uiUpdateRequest, setUiUpdateRequest] = useState(false);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);             // Default start date is one month before today
    if (date.getDate() !== new Date().getDate()) {  // Check that we don't have an invalid day, e.g. February 31st
      date.setDate(0);                              // If we do, just set it to the last day of the previous month
    }
    return date;
  });
  const [toDate, setToDate] = useState(new Date());

  // fetch the balance from the server
  useEffect(() => {
    axios
      .get("http://localhost:4000/user/balance")
      .then((response) => {
        setUiUpdateRequest(false);
        setLoading(false);
      })
      .catch((error) => {
        // If the user is not logged in (due to directly accessing dashboard path or token expiring), redirect to the login page
        window.location.href = "/login";
        console.error("Not logged in ", error);
      });
  }, [transactions, uiUpdateRequest]);

  useEffect(() => { 
    refreshDisplayGoal(setGoal, currency); 
    refreshDisplayBalance(setBalance, currency); 
  }, [currency]);

  // fetch transactions from the server and filter them
  useEffect(() => {
    axios
      .get(`http://localhost:4000/transaction`)
      .then((response) => {
        // Store all transactions in a state variable before any filtering is done. This can be accessed by other components if needed
        setAllTransactions(response.data.result);

        // These are the transactions that will be displayed on the page. They are filtered based on the start and end dates.
        const currTransactions = response.data.result.filter(transaction => {
            const transactionDate = new Date(transaction.created_at);
            return transactionDate >= fromDate && transactionDate <= toDate;
        });

        setTransactions(returnTransactionsPerPage(currTransactions, currentPage, 10));
        setUiUpdateRequest(false);
      })
      .catch((error) => {
        window.location.href = "/login";
        console.error("Not logged in ", error);
      });
  }, [currentPage, fromDate, toDate, uiUpdateRequest]);

  // function to return the transactions for a given page. Return empty array if a page has no transactions
  const returnTransactionsPerPage = (transactions, currentPage, pageSize) => {
    const transactionsPerPage = [];

    let i = 0;
    while (i < transactions.length) {
      transactionsPerPage.push(transactions.slice(i, i + pageSize));
      i += pageSize;
    }

    if (currentPage > transactionsPerPage.length) {
      return [];
    }

    return transactionsPerPage[currentPage - 1];
  };

  // function to request a UI update (refetch of transactions and balance)
  const requestUiUpdate = () => {
    setUiUpdateRequest(true);
  };

  useEffect(() => {
    const currencySymbols = {
      "NZD": "NZ$",
      "AUD": "AU$",
      "USD": "US$",
      "GBP": "£",
      "HKD": "HK$"
    }

    setCurrencySymbol(currencySymbols[currency]);
  }, currency)

  //functions to filter transactions
  const setDateRange = (from, to) => {
    setFromDate(from);
    setToDate(to);
  };
  
  //function for handling the selection of transactions for deletion
  const handleSelect = (transactionId, isSelected) => {
    setSelectedTransactions((prev) =>
      isSelected
        ? [...prev, transactionId]
        : prev.filter((id) => id !== transactionId)
    );
  };

  // all values and functions that can be accessed when consuming this context provider
  const contextValue = {
    currency, // the currency to convert to i.e NZD, USD, EUR
    currencySymbol,
    transactions, // the transactions to display (after filtering)
    allTransactions, // all transactions of the user
    selectedTransactions, // the transactions selected by the user for deletion
    currentPage,
    balance, // the balance of the user
    goal,
    fromDate,
    toDate,
    setBalance,
    setGoal,
    setSelectedTransactions,
    setDateRange,
    setCurrentPage,
    setCurrency,
    handleSelect, // function to handle the selection of transactions
    requestUiUpdate, // call this function to request a UI update of the transactions if it is not done automatically
    loading,
    setLoading,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
}

export default TransactionContextProvider;
