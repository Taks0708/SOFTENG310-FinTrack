import { useContext, useState, useRef } from "react";
import TransactionContext from "../../context/TransactionContext";
import axios from "axios";
import '../../assets/css/defaultButton.css';

export default function DeleteTransactionButton() {

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
      class="defaultButton"
      onClick={handleDeleteSelected}
      disabled={disableClick}
    >
      Delete Transaction
    </button>
  );
}
