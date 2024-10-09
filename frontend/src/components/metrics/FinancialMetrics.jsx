import React, { useState, useContext, useEffect } from "react";
import TransactionContext from "../../context/TransactionContext";
import "../../assets/css/default.css";
import { convertCurrency } from "../../utility/CurrencyUtil";
import axios from "axios";
import DefaultButton from "../default/DefaultButton.jsx";

export default function FinancialMetrics() {
    const { balance, currency, transactions, goal } =
        useContext(TransactionContext);

    //used to save the metrics in NZD
    const [monthlyMetrics, setMonthlyMetrics] = useState({
        monthlySpending: 0,
        monthlyIncome: 0,
        percentageSpent: 0,
        percentageSaved: 0,
    });

    const [lifetimeMetrics, setLifetimeMetrics] = useState({
        totalSpending: 0,
        totalIncome: 0,
        percentOfGoal: 0,
    });

    //used to save the metrics in the current currency
    const [convertedMonthlyMetrics, setConvertedMonthlyMetrics] = useState({
        monthlySpending: 0,
        monthlyIncome: 0,
        percentageSpent: 0,
        percentageSaved: 0,
    });

    const [convertedLifetimeMetrics, setConvertedLifetimeMetrics] = useState({
        totalSpending: 0,
        totalIncome: 0,
        percentOfGoal: 0,
    });

    //when any of the parameters that effect transaction are modified then recalculate the metrics and convert to the correct currency
    useEffect(() => {
        const fetchData = () => {
            calculateMetrics();
            calculateCurrency();
        };

        fetchData();
    }, [transactions, currency, goal, balance]);

    //converst the lifetime and montly metrics into the correct currency. then appends to ConvertedLifetimeMetrics and ConvertedMonthlyMetrics
    async function calculateCurrency() {
        const convertedMonthlySpending = await convertCurrency(
            currency,
            "NZD",
            monthlyMetrics.monthlySpending
        );
        const convertedMonthlyIncome = await convertCurrency(
            currency,
            "NZD",
            monthlyMetrics.monthlyIncome
        );
        const convertedTotalSpending = await convertCurrency(
            currency,
            "NZD",
            lifetimeMetrics.totalSpending
        );
        const convertedTotalIncome = await convertCurrency(
            currency,
            "NZD",
            lifetimeMetrics.totalIncome
        );

        const convertedPercentOfGoal =
            Math.round((balance / goal) * 100 * 100) / 100;

        setConvertedMonthlyMetrics({
            monthlySpending: convertedMonthlySpending,
            monthlyIncome: convertedMonthlyIncome,
            percentageSpent: monthlyMetrics.percentageSpent,
            percentageSaved: monthlyMetrics.percentageSaved,
        });

        setConvertedLifetimeMetrics({
            totalSpending: convertedTotalSpending,
            totalIncome: convertedTotalIncome,
            percentOfGoal: convertedPercentOfGoal,
        });
    }

    // Takes in a list of transactions and calculates the monthly and lifetime metrics. This should always be
    // the full list of transactions, not just the ones currently displayed.
    async function calculateMetrics() {
        try {
            const response = await axios.get(
                "http://localhost:4000/transaction/metrics"
            );
            if (response.data.success) {
                setMonthlyMetrics(response.data.monthlyMetrics);
                setLifetimeMetrics(response.data.lifetimeMetrics, {
                    percentOfGoal:
                        Math.round((balance / goal) * 100 * 100) / 100,
                });
            } else {
                console.error("Failed to fetch metrics");
            }
        } catch (error) {
            console.error("Error fetching metrics:", error);
        }
    }

    return (
        <div className="flex justify-center">
            <div className="inline-block border-4 border-main-green rounded-lg shadow-lg ">
                <h2 className="bg-main-green text-body text-white font-semibold p-2">
                    Financial Metrics
                </h2>

                <div className="flex justify-center p-5">
                    {/*Monthly metrics*/}
                    <div className="mr-4 bg-slate-300 p-5 rounded-lg shadow-lg">
                        <h2 className="text-body-small font-semibold mb-4">
                            Monthly
                        </h2>
                        <p>
                            <strong>Spending This Month:</strong>{" "}
                            {convertedMonthlyMetrics.monthlySpending} {currency}
                        </p>
                        <p>
                            <strong>Income This Month:</strong>{" "}
                            {convertedMonthlyMetrics.monthlyIncome} {currency}
                        </p>
                        <p>
                            <strong>% Income Spent:</strong>{" "}
                            {convertedMonthlyMetrics.percentageSpent.toFixed(2)}
                            %
                        </p>
                        <p>
                            <strong>% Income Saved:</strong>{" "}
                            {convertedMonthlyMetrics.percentageSaved.toFixed(2)}
                            %
                        </p>
                    </div>

                    {/*Lifetime metrics*/}
                    <div className="ml-4 bg-slate-300 p-5 rounded-lg shadow-lg">
                        <h2 className="text-body-small font-semibold mb-4">
                            Lifetime
                        </h2>
                        <p>
                            <strong>Balance</strong>{" "}
                            {Math.round(balance * 100) / 100} {currency}
                        </p>
                        <p>
                            <strong>Percent Of Goal</strong>{" "}
                            {convertedLifetimeMetrics.percentOfGoal}%
                        </p>
                        <p>
                            <strong>Total Income:</strong>{" "}
                            {convertedLifetimeMetrics.totalIncome} {currency}
                        </p>
                        <p>
                            <strong>Total Spending:</strong>{" "}
                            {convertedLifetimeMetrics.totalSpending} {currency}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
