import TransactionContext from "./TransactionContext.jsx";
import {
  filterPastWeekTransactions,
  filterPastMonthTransactions,
  filterPastYearTransactions,
} from "../utility/transactionFilters.js";
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
  const [filter, setFilter] = useState("");
  const [balance, setBalance] = useState(0);
  const [goal, setGoal] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [uiUpdateRequest, setUiUpdateRequest] = useState(false);
  const [loading, setLoading] = useState(true);

  // fetch the balance from the server
  useEffect(() => {
    axios
      .get("http://localhost:4000/user/balance")
      .then((response) => {
        setBalance(response.data.result.balance);
        setUiUpdateRequest(false);
        setLoading(false);
      })
      .catch((error) => {
        // If the user is not logged in (due to directly accessing dashboard path or token expiring), redirect to the login page
        window.location.href = "/login";
        console.error("Not logged in ", error);
      });
  }, [currency, balance, transactions, uiUpdateRequest]);

  // Fetch the user's current savings goal and convert to specified currency when the component mounts
  useEffect(() => { refreshDisplayGoal(setGoal, currency); }, [goal, currency]);

  // fetch transactions from the server and filter them
  useEffect(() => {
    axios
      .get(`http://localhost:4000/transaction`)
      .then((response) => {
        // Store all transactions in a state variable before any filtering is done. This can be accessed by other components if needed
        setAllTransactions(response.data.result);

        // These are the transactions that will be displayed on the page. They are filtered based on the filter state variable
        let currTransactions = response.data.result;


        if (filter === "year") {
          currTransactions = filterPastYearTransactions(currTransactions);
        } else if (filter === "month") {
          currTransactions = filterPastMonthTransactions(currTransactions);
        } else if (filter === "week") {
          currTransactions = filterPastWeekTransactions(currTransactions);
        }
        setTransactions(returnTransactionsPerPage(currTransactions, currentPage, 10));
        setUiUpdateRequest(false);
      })
      .catch((error) => {
        window.location.href = "/login";
        console.error("Not logged in ", error);
      });
  }, [currentPage, filter, balance, uiUpdateRequest]);

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
  const filterYear = () => {
    if (filter === "year") {
      setFilter("");
    } else {
      setFilter("year");
    }
  };

  const filterMonth = () => {
    if (filter === "month") {
      setFilter("");
    } else {
      setFilter("month");
    }
  };

  const filterWeek = () => {
    if (filter === "week") {
      setFilter("");
    } else {
      setFilter("week");
    }
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
    filter, // the filter type to apply to the transactions i.e year, month, week
    currentPage,
    balance, // the balance of the user
    goal,
    setBalance,
    setGoal,
    setSelectedTransactions,
    setFilter,
    filterYear, // filters the transactions, access the transactions with the transactions variable
    filterMonth, // filters the transactions, access the transactions with the transactions variable
    filterWeek, // filters the transactions, access the transactions with the transactions variable
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
