import { useContext, useState, useRef } from "react";
import TransactionContext from "../context/TransactionContext";
import axios from "axios";
export default function DeleteTransactionButton() {

  const enabledStyle = "bg-primary-red text-white text-button px-3 py-3 min-w-[280px] rounded-full hover:bg-primary-red-dark active:bg-primary-red-darker"
  const disabledStyle = "bg-primary-red opacity-50 text-white text-button px-3 py-3 min-w-[280px] rounded-full"

  const { selectedTransactions, setSelectedTransactions, requestUiUpdate } =
    useContext(TransactionContext);

  const [disableClick, setDisableClick] = useState(false);
  const disableClickSync = useRef(false); 
  
  const handleDeleteSelected = async () => {
    if (disableClickSync.current || disableClick) return;
    disableClickSync.current = true;
    setDisableClick(true);

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
    } finally {
      disableClickSync.current = false;
      setDisableClick(false);
    }
  };
  return (
    <button
      className={disableClick ? disabledStyle : enabledStyle}
      onClick={handleDeleteSelected}
      disabled={disableClick}
    >
      Delete Transaction
    </button>
  );
}
