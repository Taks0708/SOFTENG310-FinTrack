import { useContext } from "react";
import TransactionContext from "../context/TransactionContext";
import axios from "axios";
export default function DeleteTransactionButton() {
  const { selectedTransactions, setSelectedTransactions, requestUiUpdate } =
    useContext(TransactionContext);
  const handleDeleteSelected = async () => {
    console.log("Transactions to delete:", selectedTransactions);

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    const axiosInstance = axios.create({
      baseURL: "http://localhost:4000",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      // Assuming you have an API function to delete a transaction by ID
      await Promise.all(
        selectedTransactions.map((transactionId) =>
          axiosInstance.delete(`/transaction/${transactionId}`)
            .then(requestUiUpdate())
        )
      );
      console.log("Transactions deleted successfully.");
      setSelectedTransactions([]); // Clear the selected transactions
    } catch (error) {
      console.error("Failed to delete transactions", error);
    }
  };
  return (
    <button
      className="bg-primary-red text-white text-button px-3 py-3 min-w-[280px] rounded-full hover:bg-primary-red-dark active:bg-primary-red-darker"
      onClick={handleDeleteSelected}
    >
      Delete Transaction
    </button>
  );
}
