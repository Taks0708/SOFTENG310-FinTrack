import { useState, useContext } from "react";
import axios from "axios";
import TransactionForm from "./TransactionForm";
import TransactionContext from "../../context/TransactionContext";
import '../../assets/css/defaultButton.css';

export default function AddTransactionButton() {
  const [showForm, setShowForm] = useState(false);
  const { balance, setBalance } = useContext(TransactionContext);

  const handleFormSubmit = async ({
    title,
    amount,
    description,
    transactionType,
  }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    const axiosInstance = axios.create({
      baseURL: "http://localhost:4000",
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("amount: ", amount);

    try {
      // Post request to create the transaction
      const response = await axiosInstance.post("/transaction", {
        title,
        amount,
        description,
      });

      console.log("Transaction created successfully.", response.data);

      // Update the balance after the transaction is created

      // PATCH request to update the balance
      const updateBalance = Number(balance) + Number(amount); // use Number() for strings
      await axiosInstance.patch("/user/balance", { balance: updateBalance });
      console.log("Balance updated successfully.");
      setBalance(balance + amount); // Update the balance state in the context
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      console.log("Im at finally");
      setShowForm(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowForm(true)} class="defaultButton">
        Add Transaction
      </button>
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
