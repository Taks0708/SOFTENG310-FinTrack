import { useState, useContext, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import TransactionContext from "../../context/TransactionContext";

export default function BalanceGraph() {

    const {
        balance,
        transactions
      } = useContext(TransactionContext);

      

    const [balanceData, setBalanceData] = useState([]);

    const parseDate = (dateString) => {
        // Parse the date string
        const date = new Date(dateString);
        
        // Create a new date object for the start of the year
        const startOfYear = new Date(date.getFullYear(), 0, 0);
        
        // Calculate the difference in milliseconds
        const diff = date - startOfYear;
        
        // Convert milliseconds to days and return the day of the year
        const oneDay = 1000 * 60 * 60 * 24;
        const parseDate = Math.floor(diff / oneDay);
        
        return parseDate;
    }

    useEffect(() => {

        let pastBalance = balance
        const newBalanceData = transactions.reduce((acc, transaction) => {

            // Parse the transaction amount to a number
            const amount = parseFloat(transaction.amount);
            const date = parseDate(transaction.created_at.substring(0, 10))

            acc.push({ x: date, y: pastBalance });
            
            // Update the balance
            pastBalance -= amount;
            
            // Push the new object with the creation date and updated balance
            acc.push({ x: date, y: pastBalance });
            
            return acc;
        }, []);

        newBalanceData.push({x: 0, y: pastBalance})

        setBalanceData(newBalanceData)
    }, [balance, transactions])

    return (
        <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
            margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
            }}
            >
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="date"/>
            <YAxis type="number" dataKey="y" name="balance" unit="$" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={balanceData} fill="#ff0000" line />
            </ScatterChart>
        </ResponsiveContainer>
    );
}
