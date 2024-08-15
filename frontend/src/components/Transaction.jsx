import React, { useEffect, useState, useContext } from 'react';
import TransactionContext from '../context/TransactionContext';

const Transaction = ({ transaction, }) => {
    const [isAmountNegative, setIsAmountNegative] = useState();
    const [convertedAmount, setConvertedAmount] = useState();
    const { currency, convertCurrency } = useContext(TransactionContext);

    // useEffect check if each transaction is negative and then converts the currency
    useEffect(() => {
        setIsAmountNegative(transaction.amount < 0);
        const convert = async () => {
            const converted = await convertCurrency(currency, 'NZD', transaction.amount); // using context to convert amount
            setConvertedAmount(converted);
        }
        convert();
    }, [currency]);

    return (
        <div>
            {isAmountNegative ? (
                <div className='flex flex-row justify-between text-body text-red-500 pl-[8px]'>
                    <p className=' '>{convertedAmount}: {transaction.description}</p>
                    <p className=''>{transaction.created_at.substring(0, 10)}</p>
                </div>
            ) : (
                <div className='flex flex-row justify-between text-body text-green-500'>
                    <p className=''>+{convertedAmount}: {transaction.description}</p>
                    <p className=''>{transaction.created_at.substring(0, 10)}</p>
                </div>
            )}
        </div>
    );
};

export default Transaction;
