import { useEffect, useState, useContext } from "react";
import TransactionContext from "../context/TransactionContext";

export default function CurrentBalance() {
    const { currency, convertCurrency, balance } = useContext(TransactionContext);
    const [convertedAmount, setConvertedAmount] = useState(0);

    // useEffect check if each transaction is negative and then converts the currency
    useEffect(() => {
        const convert = async () => {
            const convertedAmount = await convertCurrency(currency, 'NZD', balance); // using context to convert amount
            setConvertedAmount(convertedAmount);
        }
        convert();
    }, [currency]);

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-sub-heading font-extrabold">Current Balance: ${convertedAmount}</h2>
        </div>
    );

}
