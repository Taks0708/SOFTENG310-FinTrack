import { useState, useContext } from "react";
import getAxiosInstance from "../../utility/AxiosUtil.jsx";
import { refreshDisplayBalance, convertCurrency } from "../../utility/CurrencyUtil.jsx";
import TransactionForm from "./TransactionForm";
import TransactionContext from "../../context/TransactionContext";
import '../../assets/css/default.css';
import DefaultButton from '../default/DefaultButton.jsx';

export default function AddTransactionButton() {
  const [showForm, setShowForm] = useState(false);
  const { balance, setBalance, currency,requestUiUpdate } = useContext(TransactionContext);

  const handleFormSubmit = async ({
    title,
    amount,
    description,
    transactionType,
  }) => {
    amount = await convertCurrency("NZD", currency, amount);
    console.log("That is ", amount, " in NZD!");

    try {
      // Post request to create the transaction
      const response = await getAxiosInstance().post("/transaction", {
        title,
        amount,
        description,
      }).then(requestUiUpdate());

      // PATCH request to update the balance
      const updateBalance = Number(balance) + Number(amount); // use Number() for strings
      await getAxiosInstance().patch("/user/balance", { balance: updateBalance });


      refreshDisplayBalance(setBalance, currency); // Update the balance state in the context
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setShowForm(false);
    }
  };

  return (
    <> 
      <DefaultButton onClick={() => setShowForm(true)}>Add Transaction</DefaultButton>
      {showForm && (
        <div className="absolute">
          <TransactionForm
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </>
  );
}