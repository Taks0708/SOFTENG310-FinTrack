import TransactionContext from "./TransactionContext.jsx";
import {
  filterPastWeekTransactions,
  filterPastMonthTransactions,
  filterPastYearTransactions,
} from "../utility/transactionFilters.js";
import { useEffect, useState } from "react";
import axios from "axios";

export function TransactionContextProvider({ children }) {
  const [currency, setCurrency] = useState("NZD"); // default currency is NZD
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [balance, setBalance] = useState(0);
  const [uiUpdateRequest, setUiUpdateRequest] = useState(false);

  // fetch the balance from the server
  useEffect(() => {
    axios
      .get("http://localhost:4000/user/balance")
      .then((response) => {
        setBalance(response.data.result.balance);
        setUiUpdateRequest(false);
      })
      .catch((error) => {
        // If the user is not logged in (due to directly accessing dashboard path or token expiring), redirect to the login page
        window.location.href = "/login";
        console.error("Not logged in ", error);
      });
  }, [currency, balance, transactions, uiUpdateRequest]);

  // fetch transactions from the server and filter them
  useEffect(() => {
    axios
      .get(`http://localhost:4000/transaction`)
      .then((response) => {
        setAllTransactions(response.data.result);
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

  /**
   * converts the currency of each transaction using the Frankfurter API
   * the conversion rates refresh at ~2am NZST every business day
   *
   * @param to // the currency to convert to
   * @param from // the currency to convert from (default value for this application is NZD)
   * @param amount // the amount of the transaction
   * @returns the converted amount in the desired currency at 3 decimal point
   */
  const convertCurrency = async (to, from, amount) => {
    if (!(to === from)) {
      try {
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
        );
        const data = await response.json();
        return parseFloat(data.rates[to]).toFixed(3);
      } catch (error) {
        console.error("Error calculating conversion", error);
      }
    } else {
      return amount;
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
    transactions, // the transactions to display (after filtering)
    allTransactions, // all transactions of the user
    selectedTransactions, // the transactions selected by the user for deletion
    filter, // the filter type to apply to the transactions i.e year, month, week
    currentPage,
    balance, // the balance of the user
    setBalance,
    setSelectedTransactions,
    setFilter,
    filterYear, // filters the transactions, access the transactions with the transactions variable
    filterMonth, // filters the transactions, access the transactions with the transactions variable
    filterWeek, // filters the transactions, access the transactions with the transactions variable
    setCurrentPage,
    setCurrency,
    convertCurrency, // returns a promise that resolves to the converted amount
    handleSelect, // function to handle the selection of transactions
    requestUiUpdate, // call this function to request a UI update of the transactions if it is not done automatically
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
}

export default TransactionContextProvider;
