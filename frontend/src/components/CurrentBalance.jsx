import { useEffect, useState, useContext } from "react";
import TransactionContext from "../context/TransactionContext";
import { getConvertedBalance } from "../utility/CurrencyUtil";

export default function CurrentBalance() {
  const { currency, convertCurrency, balance } = useContext(TransactionContext);
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => { getConvertedBalance(setConvertedAmount); }, [currency, balance]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-sub-heading font-extrabold">
        Current Balance: ${convertedAmount}
      </h2>
    </div>
  );
}
