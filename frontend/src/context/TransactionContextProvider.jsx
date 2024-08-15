import TransactionContext from "./TransactionContext.jsx";
import { filterPastWeekTransactions, filterPastMonthTransactions, filterPastYearTransactions } from '../utility/transactionFilters.js';
import { useEffect, useState } from 'react';
import axios from 'axios';


export function TransactionContextProvider({ children }) {
    const [currency, setCurrency] = useState('NZD'); // default currency is NZD
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [balance, setBalance] = useState(0);

    // fetch the balance from the server
    useEffect(() => {
        axios.get("http://localhost:4000/user/balance")
            .then(response => {
                setBalance(response.data.result.balance);
            }).catch(error => {
                // If the user is not logged in (due to directly accessing dashboard path or token expiring), redirect to the login page
                window.location.href = "/login";
            });
    }, [currency, balance]);

    // fetch transactions from the server and filter them
    useEffect(() => {
        axios.get(`http://localhost:4000/transaction/page/${currentPage}`)
            .then((response) => {
                let allTransactions = response.data.result;

                if (filter === 'year') {
                    allTransactions = filterPastYearTransactions(allTransactions);
                } else if (filter === 'month') {
                    allTransactions = filterPastMonthTransactions(allTransactions);
                } else if (filter === 'week') {
                    allTransactions = filterPastWeekTransactions(allTransactions);
                }
                setTransactions(allTransactions);
            })
            .catch((error) => {
                console.error('Not logged in ', error);
                window.location.href = '/login';
            });
    }, [currentPage, filter]);

    //functions to filter transactions
    const filterYear = () => {
        if (filter === 'year') {
            setFilter('');
        } else {
            setFilter('year');
        }
    };

    const filterMonth = () => {
        if (filter === 'month') {
            setFilter('');
        } else {
            setFilter('month');
        }
    };

    const filterWeek = () => {
        if (filter === 'week') {
            setFilter('');
        } else {
            setFilter('week');
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
                const response = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
                const data = await response.json();
                return parseFloat(data.rates[to]).toFixed(3)
            } catch (error) {
                console.error("Error calculating conversion", error);
            }
        } else {
            return amount;
        }
    }

    // all values and functions that can be accessed when consuming this context provider
    const contextValue = {
        currency,           // the currency to convert to i.e NZD, USD, EUR
        transactions,       // the transactions to display
        filter,             // the filter type to apply to the transactions i.e year, month, week
        currentPage,
        balance,            // the balance of the user
        setBalance,
        setFilter,
        filterYear,         // filters the transactions, access the transactions with the transactions variable
        filterMonth,        // filters the transactions, access the transactions with the transactions variable
        filterWeek,         // filters the transactions, access the transactions with the transactions variable
        setCurrentPage,
        setCurrency,
        convertCurrency,    // returns a promise that resolves to the converted amount
    };

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>);
};

export default TransactionContextProvider;