import React, { useEffect, useState, useContext } from "react";
import TransactionContext from "../context/TransactionContext";

const Transaction = ({ transaction }) => {
  const [isAmountNegative, setIsAmountNegative] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState(transaction.amount);
  const { currency, convertCurrency, handleSelect } =
    useContext(TransactionContext);

  // useEffect to check if each transaction is negative and then convert the currency
  useEffect(() => {
    const convert = async () => {
      const converted = await convertCurrency(
        currency,
        "NZD",
        transaction.amount
      ); // using context to convert amount
      setConvertedAmount(converted);
      setIsAmountNegative(converted < 0);
    };
    convert();
  }, [currency, transaction.amount, convertCurrency]);

  const handleCheckboxChange = (e) => {
    handleSelect(transaction.id, e.target.checked);
    console.log("clicked: ", transaction.id);
  };
  return (
    <div className="flex flex-row justify-start text-body pl-[8x]">
      <input type="checkbox" onChange={handleCheckboxChange} />
      <div
        className={` w-full flex flex-row justify-between text-body pl-[8px] ${
          isAmountNegative ? "text-red-500" : "text-green-500"
        }`}
      >
        <p>
          {isAmountNegative ? convertedAmount : `+${convertedAmount}`}:{" "}
          {transaction.description}
        </p>
        <p className="self-end">{transaction.created_at.substring(0, 10)}</p>
      </div>
    </div>
  );
};

export default Transaction;
