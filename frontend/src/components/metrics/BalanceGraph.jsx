import { useState, useContext, useEffect } from 'react';
import { add, format, differenceInCalendarDays } from "date-fns";
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
        goal,
        balance,
        transactions,
        fromDate,
        toDate
      } = useContext(TransactionContext);

    const [balanceData, setBalanceData] = useState([]);
    const [domainX, setDomainX] = useState([]);
    const [domainY, setDomainY] = useState([]);
    const [ticks, setTicks] = useState([]);

    const dateFormatter = (date) => {
        return format(new Date(date), "dd-MM-yyyy");
    };

    useEffect(() => {

        console.log(balance)
        console.log(transactions)

        console.log("Goal = " + goal)

        setDomainX([fromDate.getTime(), toDate.getTime()])
        setDomainY([0, goal])
        setTicks(getEvenSpacedPoints(fromDate, toDate, 5))

        let lastTime = toDate
        let lastBalance = balance

        const verticalSegments = []
        const flatSegments = transactions.reduce((acc, transaction) => {

            // Parse the transaction amount to a number
            const amount = parseFloat(transaction.amount);

            // Parse the date string
            const date = new Date(transaction.created_at);
            console.log(date)

            const flatSegment = [];
            flatSegment.push({x: lastTime.getTime(), y: lastBalance})
            flatSegment.push({x: date.getTime(), y: lastBalance})
            acc.push({points: flatSegment, colour: "#000000"})

            // Update the balance
            const newBalance = lastBalance - amount;

            const verticalSegment = [];
            const verticalSegmentColour = (lastBalance > newBalance) ? "#099e6a" : "#cc0a48";
            verticalSegment.push({x: date.getTime(), y: lastBalance})
            verticalSegment.push({x: date.getTime(), y: newBalance})
            verticalSegments.push({points: verticalSegment, colour: verticalSegmentColour})
            
            // Update the balance
            lastBalance -= amount;
            lastTime = date;
            
            return acc;
        }, []);

        const lastSegment = [];
        lastSegment.push({x: lastTime.getTime(), y: lastBalance})
        lastSegment.push({x: fromDate.getTime(), y: lastBalance})
        flatSegments.push({points: lastSegment, colour: "#000000"})

        setBalanceData(flatSegments.concat(verticalSegments))

    }, [balance, transactions, fromDate, toDate, goal])

    const getEvenSpacedPoints = (startDate, endDate, num) => {
        const diffDays = differenceInCalendarDays(endDate, startDate);
      
        let current = startDate,
          step = Math.round(diffDays / (num - 1));
      
        const ticks = [startDate.getTime()];
      
        for (let i = 1; i < num - 1; i++) {
          ticks.push(add(current, { days: i * step }).getTime());
        }
      
        ticks.push(endDate.getTime());
        return ticks;
      };

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
            <XAxis
                name="date"
                dataKey="x"
                hasTick
                scale="time"
                tickFormatter={dateFormatter}
                type="number"
                domain={domainX}
                ticks={ticks}
            />
            <YAxis type="number" dataKey="y" name="balance" unit="$" domain={domainY} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />

            {balanceData.map((segment, i) => <Scatter data={segment.points} fill={segment.colour} line key={i} />)}
            {/* <Scatter data={balanceData} fill="#ff0000" line /> */}

            </ScatterChart>
        </ResponsiveContainer>
    );
}
